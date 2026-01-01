"use client";

import { useState, useEffect } from "react";
import { Activity, Users, AlertTriangle, TrendingUp, Plus, Loader2, X } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import PatientForm from "@/components/business/PatientForm";
import RiskCard from "@/components/business/RiskCard";
import { cn } from "@/lib/utils";

// FIREBASE & UTILS IMPORTS
import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { logActivity } from "@/lib/logger"; // Import Logger
import { useAuth } from "@/lib/AuthContext"; // Import Auth
import { useSearch } from "@/lib/SearchContext"; // Import Search

export default function DashboardPage() {
  // 1. HOOKS HARUS DI PALING ATAS
  const { user } = useAuth();
  const { searchQuery } = useSearch();

  // STATE
  const [isAssessmentMode, setAssessmentMode] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [currentPatientInput, setCurrentPatientInput] = useState(null);
  const [loadingSave, setLoadingSave] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // 2. SUBSCRIBE KE FIRESTORE
  useEffect(() => {
    const q = query(collection(db, "patients"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const patientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPatients(patientsData);
      setLoadingData(false);
    });
    return () => unsubscribe();
  }, []);

  // 3. FUNGSI SIMPAN KE DATABASE & LOGGING
  const handlePrediction = async (result, inputData) => {
    setPredictionResult(result);
    setCurrentPatientInput(inputData);
    setLoadingSave(true);

    try {
        // A. Simpan Data Pasien
        await addDoc(collection(db, "patients"), {
            name: inputData.name,
            age: inputData.age,
            sex: parseInt(inputData.sex),
            diagnosis: "Heart Failure Assessment",
            risk_score: result.riskScore,
            status: result.riskLevel,
            vitals: inputData, 
            createdAt: serverTimestamp(),
            assessedAt: new Date().toISOString()
        });

        // B. Catat Log Activity
        await logActivity(user, "ASSESSMENT_RUN", `Patient: ${inputData.name}`, "SUCCESS");

    } catch (error) {
        console.error("Error saving patient:", error);
        alert("Failed to save to database!");
    } finally {
        setLoadingSave(false);
    }
  };

  // HITUNG STATISTIK
  const totalPatients = patients.length;
  const criticalPatients = patients.filter(p => p.status === "Critical").length;
  const totalRisk = patients.reduce((acc, curr) => acc + (parseFloat(curr.risk_score) || 0), 0);
  const avgRiskScore = totalPatients > 0 ? (totalRisk / totalPatients).toFixed(1) : "0.0";

  return (
    <div className="space-y-6 animate-in fade-in duration-700 relative">
      
      {/* --- MODAL DETAIL PASIEN (SUDAH DIPERBAIKI LENGKAP) --- */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-all">
            <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">{selectedPatient.name}</h3>
                        <p className="text-xs text-slate-500">ID: {selectedPatient.id}</p>
                    </div>
                    <button onClick={() => setSelectedPatient(null)} className="rounded-full p-2 hover:bg-slate-100">
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </div>
                
                {/* Modal Content */}
                <div className="p-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Hasil Risiko */}
                    <div className={cn(
                        "rounded-lg border p-4 text-center",
                        selectedPatient.status === "Critical" || selectedPatient.status === "High" ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
                    )}>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">AI Risk Prediction</p>
                        <h2 className={cn("text-3xl font-extrabold mt-2", 
                            selectedPatient.status === "Critical" || selectedPatient.status === "High" ? "text-red-700" : "text-green-700"
                        )}>
                            {selectedPatient.risk_score}%
                        </h2>
                        <span className={cn("inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold",
                             selectedPatient.status === "Critical" || selectedPatient.status === "High" ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"
                        )}>
                            {selectedPatient.status} Risk
                        </span>
                    </div>

                    {/* Detail Klinis (SUDAH DIKEMBALIKAN LENGKAP) */}
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b pb-1">
                            <span className="text-slate-500">Age / Sex</span>
                            <span className="font-medium text-slate-900">
                                {selectedPatient.age} years / {selectedPatient.sex === 1 ? "Male" : "Female"}
                            </span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                            <span className="text-slate-500">Ejection Fraction</span>
                            <span className="font-medium text-slate-900">{selectedPatient.vitals?.ejection_fraction}%</span>
                        </div>
                        {/* INI YANG TADI HILANG, SEKARANG SUDAH ADA LAGI */}
                        <div className="flex justify-between border-b pb-1">
                            <span className="text-slate-500">Serum Creatinine</span>
                            <span className="font-medium text-slate-900">{selectedPatient.vitals?.serum_creatinine} mg/dL</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                            <span className="text-slate-500">Comorbidities</span>
                            <div className="text-right">
                                {selectedPatient.vitals?.diabetes === "1" || selectedPatient.vitals?.diabetes === 1 ? (
                                    <span className="block text-xs bg-slate-100 px-1 rounded">Diabetes</span>
                                ) : null}
                                
                                {selectedPatient.vitals?.high_blood_pressure === "1" || selectedPatient.vitals?.high_blood_pressure === 1 ? (
                                    <span className="block text-xs bg-slate-100 px-1 rounded mt-1">Hypertension</span>
                                ) : null}

                                {/* Cek jika tidak ada penyakit */}
                                {(!selectedPatient.vitals?.diabetes || selectedPatient.vitals?.diabetes === "0") && 
                                 (!selectedPatient.vitals?.high_blood_pressure || selectedPatient.vitals?.high_blood_pressure === "0") && (
                                    <span className="text-slate-400 italic">None</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-slate-50 px-6 py-4 rounded-b-xl flex justify-end">
                    <button 
                        onClick={() => setSelectedPatient(null)}
                        className="px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors"
                    >
                        Close Detail
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* HEADER DASHBOARD */}
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

      {/* AREA ASSESSMENT */}
      {isAssessmentMode && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <PatientForm onResult={handlePrediction} />
            </div>
            <div className="lg:col-span-1">
                {loadingSave && !predictionResult && (
                    <div className="flex h-full flex-col items-center justify-center rounded-xl border bg-white p-6 text-teal-600">
                        <Loader2 className="h-10 w-10 animate-spin" />
                        <p className="mt-2 font-semibold">Saving to Cloud Database...</p>
                    </div>
                )}
                {predictionResult && (
                    <>
                        <RiskCard result={predictionResult} patientData={currentPatientInput} />
                        {loadingSave ? (
                             <p className="text-center text-xs text-slate-400 mt-2 flex items-center justify-center gap-1"><Loader2 className="h-3 w-3 animate-spin"/> Syncing to Firestore...</p>
                        ) : (
                             <p className="text-center text-xs text-green-600 mt-2 font-bold">✓ Data Saved to Secure Cloud</p>
                        )}
                    </>
                )}
                {!predictionResult && !loadingSave && (
                    <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed bg-slate-50 p-6 text-slate-400">
                        <Activity className="mb-2 h-10 w-10 opacity-20" />
                        <p>Waiting for clinical data input...</p>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* AREA MONITORING UTAMA */}
      {!isAssessmentMode && (
        <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Patients" value={totalPatients} icon={Users} status="neutral" trend="up" trendValue="Live" />
                <StatCard title="Critical Risk" value={criticalPatients} icon={AlertTriangle} status="danger" trend="up" trendValue={criticalPatients > 0 ? "Action Needed" : "Stable"} />
                <StatCard title="Avg. Risk Score" value={`${avgRiskScore}%`} icon={Activity} status="warning" trend="down" trendValue="Dynamic" />
                <StatCard title="System Uptime" value="99.9%" icon={TrendingUp} status="success" trend="neutral" trendValue="Stable" />
            </div>

            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="border-b bg-slate-50 px-6 py-4 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-800">Recent Assessments History</h3>
                    {loadingData && <span className="text-xs text-slate-400 flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin"/> Syncing...</span>}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                            <tr>
                                <th className="px-6 py-3">Patient Name</th>
                                <th className="px-6 py-3">Age/Sex</th>
                                <th className="px-6 py-3">Risk Score</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loadingData && patients.length === 0 && (
                                <tr><td colSpan="6" className="py-8 text-center text-slate-400">Loading secure data...</td></tr>
                            )}
                            
                            {/* FILTER SEARCH */}
                            {patients
                                .filter((p) => {
                                    if (!searchQuery) return true;
                                    const q = searchQuery.toLowerCase();
                                    return (
                                        p.name?.toLowerCase().includes(q) ||
                                        p.diagnosis?.toLowerCase().includes(q) ||
                                        p.id?.toLowerCase().includes(q)
                                    );
                                })
                                .map((patient) => (
                                <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {patient.name}
                                        <span className="block text-xs text-slate-400 font-mono">ID: {patient.id.substr(0, 8)}...</span>
                                    </td>
                                    <td className="px-6 py-4">{patient.age} / {patient.sex === 1 ? "M" : "F"}</td>
                                    <td className="px-6 py-4 font-bold">{patient.risk_score}%</td>
                                    <td className="px-6 py-4">
                                        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                            patient.status === "Critical" ? "bg-red-100 text-red-800" : 
                                            patient.status === "High" ? "bg-orange-100 text-orange-800" : 
                                            patient.status === "Moderate" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                                        )}>{patient.status}</span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500">
                                        {patient.createdAt?.seconds ? new Date(patient.createdAt.seconds * 1000).toLocaleDateString() : "Just now"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => setSelectedPatient(patient)} className="text-teal-600 font-bold hover:underline hover:text-teal-800">View</button>
                                    </td>
                                </tr>
                            ))}
                            
                            {/* Pesan kalau search tidak ketemu */}
                            {patients.length > 0 && searchQuery && patients.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-slate-400">
                                        No patients found matching "{searchQuery}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
      )}
    </div>
  );
}