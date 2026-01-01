"use client";

import { useState, useEffect } from "react";
import { Database, Copy, Check, Server, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { useSearch } from "@/lib/SearchContext"; 

export default function IntegrationPage() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // STATE UNTUK URL DINAMIS
  const [baseUrl, setBaseUrl] = useState("");

  const { searchQuery } = useSearch();

  // 1. AMBIL URL OTOMATIS (Client Side Only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Ini akan menghasilkan "http://localhost:3000" atau "https://nama-proyek-mas.vercel.app"
      setBaseUrl(window.location.origin);
    }
  }, []);

  // 2. AMBIL DATA REAL DARI FIRESTORE
  useEffect(() => {
    const q = query(collection(db, "patients"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPatients(liveData);
      
      if (liveData.length > 0 && !selectedPatient) {
        setSelectedPatient(liveData[0]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []); 

  // 3. GENERATE JSON FHIR DINAMIS
  const generateFHIRResource = (patient) => {
    if (!patient) return {};
    
    const fullName = patient.name || "Unknown";
    const names = fullName.split(" ");
    
    return {
      resourceType: "Patient",
      id: patient.id,
      active: true,
      name: [
        {
          use: "official",
          family: names.length > 1 ? names.slice(1).join(" ") : names[0],
          given: [names[0]]
        }
      ],
      gender: patient.sex === 1 ? "male" : "female",
      birthDate: `${2025 - (patient.age || 0)}-01-01`,
      extension: [
        {
          url: "http://vitalsense.ai/risk-score",
          valueDecimal: parseFloat(patient.risk_score) || 0
        },
        {
            url: "http://vitalsense.ai/clinical/diagnosis",
            valueString: patient.diagnosis
        }
      ],
      meta: {
        lastUpdated: patient.assessedAt || new Date().toISOString(),
        source: "VitalSense AI System v2.1"
      }
    };
  };

  const fhirData = selectedPatient ? generateFHIRResource(selectedPatient) : {};

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(fhirData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Interoperability Interface</h1>
        <p className="text-slate-500">
            FHIR R4 Standard Compliant API Endpoint. Enables data exchange with BPJS (SatuSehat) & EMRs.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Kolom Kiri: Daftar Pasien */}
        <div className="rounded-xl border bg-white p-0 shadow-sm overflow-hidden h-[500px] flex flex-col">
            <div className="border-b bg-slate-50 px-4 py-3 flex items-center justify-between">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Server className="h-4 w-4 text-teal-600"/>}
                    Patient Directory
                </h3>
                <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full border border-teal-200">
                    Live Firestore
                </span>
            </div>
            
            <div className="overflow-y-auto flex-1 p-2 space-y-2">
                {loading && <p className="text-center text-xs text-slate-400 py-10">Syncing database...</p>}
                
                {!loading && patients
                    .filter(p => {
                        if(!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return p.name?.toLowerCase().includes(q) || p.id?.toLowerCase().includes(q);
                    })
                    .map((p) => (
                    <button
                        key={p.id}
                        onClick={() => setSelectedPatient(p)}
                        className={`w-full text-left p-3 rounded-lg text-sm transition-all border ${
                            selectedPatient?.id === p.id 
                            ? "bg-slate-800 text-white border-slate-800 shadow-md" 
                            : "bg-white hover:bg-slate-50 text-slate-600 border-transparent"
                        }`}
                    >
                        <div className="font-bold truncate">{p.name}</div>
                        <div className={`text-xs mt-1 ${selectedPatient?.id === p.id ? "text-slate-300" : "text-slate-400"}`}>
                            ID: {p.id.substring(0,8)}... • Risk: {p.risk_score}%
                        </div>
                    </button>
                ))}
            </div>
        </div>

        {/* Kolom Kanan: JSON Viewer */}
        <div className="lg:col-span-2 space-y-4">
            
            {/* API Endpoint Simulation (URL DINAMIS) */}
            {selectedPatient && (
                <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-md border text-sm font-mono text-slate-600 overflow-x-auto">
                    <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs font-bold">GET</span>
                    <span className="truncate">
                        {/* URL SEKARANG MENGIKUTI DOMAIN ASLI */}
                        {baseUrl ? `${baseUrl}/api/fhir/${selectedPatient.id}` : "Generating Link..."}
                    </span>
                </div>
            )}

            {/* Code Block */}
            <div className="relative rounded-xl border bg-slate-900 p-6 shadow-sm min-h-[440px]">
                <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                        onClick={handleCopy}
                        className="flex items-center gap-1 rounded bg-slate-700 px-3 py-1.5 text-xs text-white hover:bg-slate-600 border border-slate-600"
                    >
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copied ? "Copied" : "Copy JSON"}
                    </button>
                </div>
                
                <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-teal-400">
                    <Database className="h-4 w-4" /> JSON Response (FHIR R4)
                </h4>
                
                <pre className="h-[380px] overflow-auto text-xs font-mono leading-relaxed text-slate-300 scrollbar-thin scrollbar-thumb-slate-700">
                    {selectedPatient ? JSON.stringify(fhirData, null, 2) : "// Select a patient to view data..."}
                </pre>
            </div>
        </div>
      </div>
    </div>
  );
}