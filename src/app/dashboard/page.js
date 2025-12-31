"use client";

import { useState } from "react";
import { Activity, Users, AlertTriangle, TrendingUp, Plus } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import PatientForm from "@/components/business/PatientForm";
import RiskCard from "@/components/business/RiskCard";
import mockData from "@/data/mock_patients.json"; // Import data awal
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [isAssessmentMode, setAssessmentMode] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [currentPatientInput, setCurrentPatientInput] = useState(null);
  
  // UBAH DISINI: Jadikan mockData sebagai State agar bisa ditambah
  const [patients, setPatients] = useState(mockData);

  // Statistik Dinamis (Berubah jika ada pasien baru)
  const totalPatients = patients.length;
  const criticalPatients = patients.filter(p => p.status === "Critical").length;
  // Hitung rata-rata risiko
  const totalRisk = patients.reduce((acc, curr) => acc + (typeof curr.risk_score === 'string' ? parseFloat(curr.risk_score) : curr.risk_score), 0);
  const avgRiskScore = totalPatients > 0 ? (totalRisk / totalPatients).toFixed(1) : 0;

  const handlePrediction = (result, inputData) => {
    setPredictionResult(result);
    setCurrentPatientInput(inputData);

    // LOGIKA BARU: Tambahkan pasien baru ke tabel "Recent History"
    const newPatient = {
        id: `P-${1000 + patients.length + 1}`, // Generate ID baru
        name: inputData.name, // Ambil nama dari form
        age: inputData.age,
        sex: parseInt(inputData.sex),
        diagnosis: "Observation", // Default diagnosis
        risk_score: result.riskScore,
        status: result.riskLevel,
        vitals: inputData // Simpan data mentah
    };

    // Update state pasien (tambah ke paling atas array)
    setPatients([newPatient, ...patients]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">ICU Command Center</h1>
            <p className="text-slate-500">Real-time mortality risk monitoring & operational assessment.</p>
        </div>
        <button 
            onClick={() => {
                setAssessmentMode(!isAssessmentMode);
                setPredictionResult(null); 
            }}
            className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 font-semibold text-white transition-all shadow-md",
                isAssessmentMode ? "bg-slate-600 hover:bg-slate-700" : "bg-teal-600 hover:bg-teal-700"
            )}
        >
            {isAssessmentMode ? "Close Assessment" : <><Plus className="h-5 w-5" /> New Assessment</>}
        </button>
      </div>

      {/* Mode Assessment */}
      {isAssessmentMode && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <PatientForm onResult={handlePrediction} />
            </div>
            <div className="lg:col-span-1">
                {predictionResult ? (
                    <RiskCard result={predictionResult} patientData={currentPatientInput} />
                ) : (
                    <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed bg-slate-50 p-6 text-slate-400">
                        <Activity className="mb-2 h-10 w-10 opacity-20" />
                        <p>Waiting for clinical data input...</p>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* Mode Monitoring (Dashboard Utama) */}
      {!isAssessmentMode && (
        <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Patients" value={totalPatients} icon={Users} status="neutral" trend="up" trendValue="+1" />
                <StatCard title="Critical Risk" value={criticalPatients} icon={AlertTriangle} status="danger" trend="up" trendValue={criticalPatients > 0 ? "+1" : "0"} />
                <StatCard title="Avg. Risk Score" value={`${avgRiskScore}%`} icon={Activity} status="warning" trend="down" trendValue="Dynamic" />
                <StatCard title="System Uptime" value="99.9%" icon={TrendingUp} status="success" trend="neutral" trendValue="Stable" />
            </div>

            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="border-b bg-slate-50 px-6 py-4">
                    <h3 className="font-semibold text-slate-800">Recent Assessments History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                            <tr>
                                <th className="px-6 py-3">Patient Name</th>
                                <th className="px-6 py-3">Age/Sex</th>
                                <th className="px-6 py-3">Risk Score</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {patients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {patient.name}
                                        <span className="block text-xs text-slate-400">ID: {patient.id}</span>
                                    </td>
                                    <td className="px-6 py-4">{patient.age} th / {patient.sex === 1 ? "L" : "P"}</td>
                                    <td className="px-6 py-4 font-bold">{patient.risk_score}%</td>
                                    <td className="px-6 py-4">
                                        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                            patient.status === "Critical" ? "bg-red-100 text-red-800" : 
                                            patient.status === "High" ? "bg-orange-100 text-orange-800" : 
                                            patient.status === "Moderate" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                                        )}>{patient.status}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-teal-600 font-medium hover:underline">View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
      )}
    </div>
  );
}