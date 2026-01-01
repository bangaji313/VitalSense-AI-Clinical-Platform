"use client";

import { useState, useRef } from "react";
import { UploadCloud, Database, FileSpreadsheet, CheckCircle, AlertCircle, RefreshCw, Server, ArrowRight, Play, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Papa from "papaparse"; // Import Parser CSV

// IMPORTS PENTING (AI & DB)
import { predictMortalityRisk } from "@/lib/ml-logic/inference";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function MigrationPage() {
  const [status, setStatus] = useState("idle"); // idle, uploading, processing, complete
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ total: 0, success: 0, failed: 0 });
  const fileInputRef = useRef(null);

  // Helper Log Visual
  const addLog = (message, type = "info") => {
    setLogs((prev) => [...prev, { message, type, time: new Date().toLocaleTimeString() }]);
  };

  // 1. TRIGGER KETIKA FILE DIPILIH
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setStatus("uploading");
    setLogs([]);
    addLog(`File detected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`, "info");

    // PARSE CSV MENGGUNAKAN PAPAPARSE
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
            if (results.data.length === 0) {
                addLog("Error: File is empty or invalid format.", "error");
                setStatus("idle");
                return;
            }
            addLog(`Parsing complete. Found ${results.data.length} records.`, "success");
            
            // Lanjut ke Proses ETL
            startETLProcess(results.data);
        },
        error: (err) => {
            addLog(`CSV Error: ${err.message}`, "error");
            setStatus("idle");
        }
    });
  };

  // 2. MESIN ETL (EXTRACT - TRANSFORM - LOAD)
  const startETLProcess = async (rawData) => {
    setStatus("processing");
    setProgress(10);
    
    let successCount = 0;
    let failCount = 0;
    const total = rawData.length;

    addLog("Starting Transformation & AI Analysis...", "warning");

    // Loop data satu per satu (Sequential agar log terlihat mengalir)
    for (let i = 0; i < total; i++) {
        const row = rawData[i];
        
        try {
            // A. TRANSFORM: Mapping kolom CSV ke format System
            // Pastikan nama kolom di CSV sesuai (case sensitive di CSV biasanya lowercase)
            const inputData = {
                name: row.name,
                age: row.age,
                sex: row.sex, // 1 or 0
                time: row.time,
                diagnosis: row.diagnosis || "Imported Data",
                // Mapping parameter medis (konversi string ke number)
                creatinine_phosphokinase: row.cpk, 
                ejection_fraction: row.ejection_fraction,
                serum_creatinine: row.serum_creatinine,
                serum_sodium: row.serum_sodium,
                platelets: row.platelets,
                diabetes: row.diabetes,
                anaemia: row.anaemia,
                high_blood_pressure: row.hypertension,
                smoking: row.smoking
            };

            // B. AI INFERENCE: Hitung risiko sebelum masuk DB
            const aiResult = predictMortalityRisk(inputData);
            
            // Update Progress UI
            addLog(`[Row ${i+1}] Transform: ${row.name} -> Risk: ${aiResult.riskScore}%`, "info");

            // C. LOAD: Simpan ke Firestore Real
            await addDoc(collection(db, "patients"), {
                ...inputData,
                sex: parseInt(inputData.sex), // Pastikan number
                risk_score: aiResult.riskScore,
                status: aiResult.riskLevel,
                vitals: inputData, // Simpan raw data juga
                createdAt: serverTimestamp(),
                assessedAt: new Date().toISOString(),
                source: "Bulk Migration (CSV)" // Penanda sumber data
            });

            successCount++;

        } catch (err) {
            console.error(err);
            failCount++;
            addLog(`[Row ${i+1}] Failed: ${err.message}`, "error");
        }

        // Update Progress Bar Realtime
        const percentage = Math.round(((i + 1) / total) * 100);
        setProgress(10 + (percentage * 0.9)); // Max 100%
        
        // Sedikit delay buatan biar terlihat canggih di video (200ms per row)
        await new Promise(r => setTimeout(r, 200));
    }

    // FINISH
    setStatus("complete");
    setProgress(100);
    setStats({ total, success: successCount, failed: failCount });
    addLog(`Migration Job Finished. Success: ${successCount}, Failed: ${failCount}`, "success");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Real Data Migration (ETL)</h1>
            <p className="text-slate-500">Bulk import CSV data, execute AI analysis, and load to Firestore Cloud.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            <Server className="h-4 w-4" />
            Target: <span className="font-bold text-slate-700">Production DB (Firestore)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* KOLOM KIRI: Upload & Visual */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Upload Area */}
            <div className={cn(
                "relative rounded-xl border-2 border-dashed p-10 text-center transition-all",
                status === "idle" ? "border-slate-300 hover:border-teal-500 bg-slate-50 hover:bg-teal-50" : "border-slate-200 bg-slate-50 opacity-80"
            )}>
                {/* Input File Tersembunyi */}
                <input 
                    type="file" 
                    accept=".csv"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileUpload}
                />

                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="p-4 bg-white rounded-full shadow-sm">
                        {status === "processing" ? (
                            <Loader2 className="h-10 w-10 text-teal-600 animate-spin" />
                        ) : (
                            <UploadCloud className="h-10 w-10 text-teal-600" />
                        )}
                    </div>
                    
                    {status === "idle" ? (
                        <>
                            <h3 className="text-lg font-semibold text-slate-700">Upload Legacy Data (CSV)</h3>
                            <p className="text-sm text-slate-500">Drag & drop or click below (Format: name, age, sex, cpk...)</p>
                            <button 
                                onClick={() => fileInputRef.current.click()}
                                className="mt-4 flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-2 font-bold text-white hover:bg-teal-700 shadow-md transition-all"
                            >
                                <Play className="h-4 w-4 fill-current" /> Select CSV File
                            </button>
                        </>
                    ) : (
                        <div className="w-full max-w-md space-y-2">
                             <div className="flex justify-between text-xs font-bold uppercase text-slate-500">
                                <span>Status: {status === "processing" ? "Processing ETL Pipeline..." : "Upload Complete"}</span>
                                <span>{Math.round(progress)}%</span>
                             </div>
                             <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                                <div 
                                    className="h-full bg-teal-500 transition-all duration-300 ease-out" 
                                    style={{ width: `${progress}%` }}
                                ></div>
                             </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Visualisasi Pipeline */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h3 className="mb-6 font-bold text-slate-800">Pipeline Stages</h3>
                <div className="flex items-center justify-between px-4">
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center"><FileSpreadsheet className="h-5 w-5" /></div>
                        <span className="text-xs font-bold text-slate-600">CSV Input</span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-300" />
                    <div className="flex flex-col items-center gap-2">
                        <div className={cn("h-10 w-10 rounded-full flex items-center justify-center transition-colors", status === "processing" ? "bg-teal-100 text-teal-700 animate-pulse" : "bg-slate-100 text-slate-400")}>
                            <RefreshCw className={cn("h-5 w-5", status === "processing" && "animate-spin")} />
                        </div>
                        <span className="text-xs font-bold text-slate-600">AI Transformation</span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-300" />
                    <div className="flex flex-col items-center gap-2">
                        <div className={cn("h-10 w-10 rounded-full flex items-center justify-center transition-colors", status === "complete" ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-400")}>
                            <Database className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-600">Firestore Cloud</span>
                    </div>
                </div>
            </div>

        </div>

        {/* KOLOM KANAN: Terminal Log */}
        <div className="lg:col-span-1 space-y-6">
            
            {/* Terminal */}
            <div className="flex h-[450px] flex-col rounded-xl border bg-slate-900 shadow-lg overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-4 py-2">
                    <span className="text-xs font-mono text-slate-400">migration_log.sh</span>
                    <div className="flex gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-red-500"></div><div className="h-2.5 w-2.5 rounded-full bg-yellow-500"></div><div className="h-2.5 w-2.5 rounded-full bg-green-500"></div></div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 font-mono text-[10px] space-y-2 scrollbar-thin scrollbar-thumb-slate-700" id="terminal-log">
                    <p className="opacity-50 text-slate-500"># Ready for file stream...</p>
                    {logs.map((log, idx) => (
                        <div key={idx} className={cn(
                            "break-words",
                            log.type === "error" ? "text-red-400" : 
                            log.type === "warning" ? "text-yellow-400" : "text-green-400"
                        )}>
                            <span className="opacity-50">[{log.time}]</span> {">"} {log.message}
                        </div>
                    ))}
                    {status === "processing" && <span className="animate-pulse text-teal-500">_</span>}
                </div>
            </div>

            {/* Summary Report */}
            {status === "complete" && (
                <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 animate-in slide-in-from-bottom-2">
                    <h4 className="flex items-center gap-2 font-bold text-teal-800 mb-3">
                        <CheckCircle className="h-5 w-5" /> Success Report
                    </h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-slate-600">Total Rows:</span><span className="font-bold">{stats.total}</span></div>
                        <div className="flex justify-between"><span className="text-slate-600">Loaded to Cloud:</span><span className="font-bold text-green-600">{stats.success}</span></div>
                    </div>
                    <button onClick={() => { setStatus("idle"); setLogs([]); }} className="mt-4 w-full rounded border border-teal-600 py-1.5 text-xs font-bold text-teal-700 hover:bg-teal-100">
                        Upload Another File
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}