"use client";

import { useState, useEffect } from "react";
import { UploadCloud, Database, FileSpreadsheet, CheckCircle, AlertCircle, RefreshCw, Server, ArrowRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MigrationPage() {
  const [status, setStatus] = useState("idle"); // idle, uploading, processing, complete
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ total: 0, success: 0, failed: 0 });

  // Simulasi Log Proses ETL (Biar terlihat canggih di video)
  const addLog = (message, type = "info") => {
    setLogs((prev) => [...prev, { message, type, time: new Date().toLocaleTimeString() }]);
  };

  const startMigration = () => {
    setStatus("uploading");
    setProgress(0);
    setLogs([]);
    setStats({ total: 0, success: 0, failed: 0 });

    // 1. TAHAP UPLOAD (Simulasi 1.5 detik)
    addLog("Initiating secure upload channel...", "info");
    
    setTimeout(() => {
        setProgress(30);
        setStatus("processing");
        addLog("File 'legacy_patient_data_2024.csv' uploaded successfully.", "success");
        runETLProcess();
    }, 1500);
  };

  // 2. TAHAP ETL (Extract, Transform, Load)
  const runETLProcess = () => {
    let currentProgress = 30;
    
    const steps = [
        { msg: "Reading raw data from CSV buffer...", delay: 800 },
        { msg: "Validating schema against FHIR R4 standard...", delay: 1600 },
        { msg: "Detected 2,540 records. Starting transformation...", delay: 2400 },
        { msg: "Mapping field 'DOB' to 'birthDate'...", delay: 3000 },
        { msg: "Normalizing gender codes (1/0 -> male/female)...", delay: 3800 },
        { msg: "Checking for duplicate MRN identifiers...", delay: 4600 },
        { msg: "Warning: 5 rows contain incomplete vitals. Skipped.", delay: 5200, type: "warning" },
        { msg: "Committing transaction to VitalSense PostgreSQL DB...", delay: 6000 },
    ];

    steps.forEach((step) => {
        setTimeout(() => {
            addLog(step.msg, step.type || "info");
            currentProgress += 8;
            setProgress(currentProgress);
        }, step.delay);
    });

    // 3. SELESAI
    setTimeout(() => {
        setStatus("complete");
        setProgress(100);
        setStats({ total: 2540, success: 2535, failed: 5 });
        addLog("Migration Pipeline completed successfully.", "success");
    }, 7000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Data Migration Pipeline (ETL)</h1>
            <p className="text-slate-500">Import legacy clinical data, validate schema, and transform to FHIR standard.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            <Server className="h-4 w-4" />
            Target: <span className="font-bold text-slate-700">Production DB (v2.1)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* KOLOM KIRI: Kontrol Utama */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Drag & Drop Area */}
            <div className={cn(
                "relative rounded-xl border-2 border-dashed p-10 text-center transition-all",
                status === "idle" ? "border-slate-300 hover:border-teal-500 bg-slate-50 hover:bg-teal-50" : "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
            )}>
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="p-4 bg-white rounded-full shadow-sm">
                        <UploadCloud className={cn("h-10 w-10 text-teal-600", status === "uploading" && "animate-bounce")} />
                    </div>
                    {status === "idle" ? (
                        <>
                            <h3 className="text-lg font-semibold text-slate-700">Drag & drop legacy CSV here</h3>
                            <p className="text-sm text-slate-500">or click to browse local files (Max 50MB)</p>
                            <button 
                                onClick={startMigration}
                                className="mt-4 flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-2 font-bold text-white hover:bg-teal-700 shadow-md transition-all"
                            >
                                <Play className="h-4 w-4 fill-current" /> Start Migration Job
                            </button>
                        </>
                    ) : (
                        <div className="w-full max-w-md space-y-2">
                             <div className="flex justify-between text-xs font-bold uppercase text-slate-500">
                                <span>Status: {status === "processing" ? "Transforming Data..." : "Uploading..."}</span>
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

            {/* 2. Visualisasi Pipeline (Stepper) */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h3 className="mb-6 font-bold text-slate-800">Pipeline Stages</h3>
                <div className="flex items-center justify-between px-4">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center gap-2">
                        <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", progress > 5 ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-400")}>
                            <FileSpreadsheet className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-600">Legacy Data</span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-300" />
                    
                    {/* Step 2 */}
                    <div className="flex flex-col items-center gap-2">
                        <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", progress > 30 ? "bg-teal-100 text-teal-700 animate-pulse" : "bg-slate-100 text-slate-400")}>
                            <RefreshCw className={cn("h-5 w-5", progress > 30 && progress < 90 && "animate-spin")} />
                        </div>
                        <span className="text-xs font-bold text-slate-600">ETL Process</span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-300" />

                    {/* Step 3 */}
                    <div className="flex flex-col items-center gap-2">
                        <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", progress === 100 ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-400")}>
                            <Database className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-600">VitalSense DB</span>
                    </div>
                </div>
            </div>

        </div>

        {/* KOLOM KANAN: Terminal Log & Stats */}
        <div className="lg:col-span-1 space-y-6">
            
            {/* Terminal Log */}
            <div className="flex h-[400px] flex-col rounded-xl border bg-slate-900 shadow-lg overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-4 py-2">
                    <span className="text-xs font-mono text-slate-400">system_log.txt</span>
                    <div className="flex gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
                        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-green-400 space-y-2 scrollbar-thin scrollbar-thumb-slate-700">
                    <p className="opacity-50 text-slate-500">// Waiting for input stream...</p>
                    {logs.map((log, idx) => (
                        <div key={idx} className={cn(
                            "break-words",
                            log.type === "error" ? "text-red-400" : 
                            log.type === "warning" ? "text-yellow-400" : "text-green-400"
                        )}>
                            <span className="opacity-50">[{log.time}]</span> {">"} {log.message}
                        </div>
                    ))}
                    {status === "complete" && (
                        <p className="animate-pulse text-teal-300 mt-4">_ END OF PROCESS</p>
                    )}
                </div>
            </div>

            {/* Summary Stats (Muncul setelah selesai) */}
            {status === "complete" && (
                <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 animate-in slide-in-from-bottom-2">
                    <h4 className="flex items-center gap-2 font-bold text-teal-800 mb-3">
                        <CheckCircle className="h-5 w-5" /> Migration Report
                    </h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-600">Total Records:</span>
                            <span className="font-bold">{stats.total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Successfully Loaded:</span>
                            <span className="font-bold text-green-600">{stats.success.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Validation Errors:</span>
                            <span className="font-bold text-red-600">{stats.failed}</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => setStatus("idle")}
                        className="mt-4 w-full rounded border border-teal-600 py-1.5 text-xs font-bold text-teal-700 hover:bg-teal-100"
                    >
                        Run New Job
                    </button>
                </div>
            )}

        </div>
      </div>
    </div>
  );
}