"use client";

import { useState } from "react";
import { Database, Copy, Check, Server } from "lucide-react";
import mockPatients from "@/data/mock_patients.json";

export default function IntegrationPage() {
  const [selectedPatient, setSelectedPatient] = useState(mockPatients[0]);
  const [copied, setCopied] = useState(false);

  // Konversi Data Simple ke Format FHIR (Standar HL7)
  // Ini simulasi mapping data (SC9 Data Migration & SC10 API)
  const generateFHIRResource = (patient) => {
    return {
      resourceType: "Patient",
      id: patient.id,
      active: true,
      name: [
        {
          use: "official",
          family: patient.name.split(" ").pop(),
          given: [patient.name.split(" ")[0]]
        }
      ],
      gender: patient.sex === 1 ? "male" : "female",
      birthDate: `${2025 - patient.age}-01-01`, // Estimasi
      extension: [
        {
          url: "http://vitalsense.ai/risk-score",
          valueDecimal: patient.risk_score
        },
        {
            url: "http://vitalsense.ai/clinical/diabetes",
            valueBoolean: patient.vitals.diabetes === 1
        }
      ],
      meta: {
        lastUpdated: new Date().toISOString(),
        source: "VitalSense AI System v2.1"
      }
    };
  };

  const fhirData = generateFHIRResource(selectedPatient);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(fhirData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
                <h3 className="font-semibold text-slate-700">Patient Directory</h3>
                <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full">Live DB</span>
            </div>
            <div className="overflow-y-auto flex-1 p-2 space-y-2">
                {mockPatients.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => setSelectedPatient(p)}
                        className={`w-full text-left p-3 rounded-lg text-sm transition-all ${
                            selectedPatient.id === p.id 
                            ? "bg-slate-800 text-white shadow-md" 
                            : "hover:bg-slate-50 text-slate-600"
                        }`}
                    >
                        <div className="font-bold">{p.name}</div>
                        <div className="text-xs opacity-70">ID: {p.id} • Risk: {p.risk_score}%</div>
                    </button>
                ))}
            </div>
        </div>

        {/* Kolom Kanan: JSON Viewer */}
        <div className="lg:col-span-2 space-y-4">
            {/* API Endpoint Simulation */}
            <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-md border text-sm font-mono text-slate-600">
                <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs">GET</span>
                <span>https://api.vitalsense.ai/fhir/Patient/{selectedPatient.id}</span>
            </div>

            {/* Code Block */}
            <div className="relative rounded-xl border bg-slate-900 p-6 shadow-sm min-h-[440px]">
                <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                        onClick={handleCopy}
                        className="flex items-center gap-1 rounded bg-slate-700 px-3 py-1.5 text-xs text-white hover:bg-slate-600"
                    >
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copied ? "Copied" : "Copy JSON"}
                    </button>
                </div>
                
                <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-teal-400">
                    <Database className="h-4 w-4" /> JSON Response (FHIR R4)
                </h4>
                
                <pre className="h-[380px] overflow-auto text-xs font-mono leading-relaxed text-slate-300 scrollbar-thin scrollbar-thumb-slate-700">
                    {JSON.stringify(fhirData, null, 2)}
                </pre>
            </div>
        </div>
      </div>
    </div>
  );
}