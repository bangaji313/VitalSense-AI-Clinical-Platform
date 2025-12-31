"use client";

import { useState } from "react";
import { Activity, CheckCircle, AlertTriangle } from "lucide-react";
import { predictMortalityRisk } from "@/lib/ml-logic/inference";
import { cn } from "@/lib/utils";

export default function PatientForm({ onResult }) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    anaemia: "0",
    creatinine_phosphokinase: "",
    diabetes: "0",
    ejection_fraction: "",
    high_blood_pressure: "0",
    platelets: "",
    serum_creatinine: "",
    serum_sodium: "",
    sex: "1",
    smoking: "0",
    time: "30", // Follow up period (default 30 hari)
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulasi loading biar terlihat "mikir" saat demo video (0.5 detik)
    setTimeout(() => {
      // Panggil Otak AI (inference.js)
      const result = predictMortalityRisk(formData);
      
      // Kirim hasil ke Dashboard untuk ditampilkan
      onResult(result, formData);
      setLoading(false);
    }, 800);
  };

  // Helper untuk input class
  const inputClass = "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";
  const labelClass = "mb-1 block text-xs font-semibold text-slate-600 uppercase tracking-wider";

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3 border-b pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-600">
          <Activity className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">New Clinical Assessment</h2>
          <p className="text-xs text-slate-500">Enter patient vitals for AI analysis</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 0: Patient Identity */}
        <div>
            <label className={labelClass}>Patient Name</label>
            <input 
                required 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className={inputClass} 
                placeholder="Full Name (e.g. Maulana Seno)" 
            />
        </div>
        {/* SECTION 1: Demographics & History */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Age (Years)</label>
            <input required type="number" name="age" value={formData.age} onChange={handleChange} className={inputClass} placeholder="e.g. 65" />
          </div>
          <div>
            <label className={labelClass}>Sex</label>
            <select name="sex" value={formData.sex} onChange={handleChange} className={inputClass}>
              <option value="1">Male</option>
              <option value="0">Female</option>
            </select>
          </div>
          <div>
             <label className={labelClass}>Follow-up Period (Days)</label>
             <input required type="number" name="time" value={formData.time} onChange={handleChange} className={inputClass} placeholder="Days observed" />
          </div>
        </div>

        {/* SECTION 2: Comorbidities (Ya/Tidak) */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { key: "diabetes", label: "Diabetes" },
            { key: "anaemia", label: "Anaemia" },
            { key: "high_blood_pressure", label: "Hypertension" },
            { key: "smoking", label: "Smoker" },
          ].map((item) => (
            <div key={item.key} className="rounded-lg border p-3">
              <label className="mb-2 block text-xs font-bold text-slate-500">{item.label}</label>
              <div className="flex gap-2">
                <label className="flex cursor-pointer items-center gap-1 text-xs">
                  <input type="radio" name={item.key} value="1" checked={formData[item.key] === "1"} onChange={handleChange} /> Yes
                </label>
                <label className="flex cursor-pointer items-center gap-1 text-xs">
                  <input type="radio" name={item.key} value="0" checked={formData[item.key] === "0"} onChange={handleChange} /> No
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* SECTION 3: Lab Results (Vital Signs) */}
        <div>
          <h3 className="mb-3 text-sm font-bold text-slate-800 border-l-4 border-teal-500 pl-2">Laboratory Results</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
            <div>
              <label className={labelClass}>Ejection Fraction (%)</label>
              <input required type="number" name="ejection_fraction" value={formData.ejection_fraction} onChange={handleChange} className={inputClass} placeholder="Normal: 55-70" />
            </div>
            <div>
              <label className={labelClass}>Serum Creatinine (mg/dL)</label>
              <input required type="number" step="0.1" name="serum_creatinine" value={formData.serum_creatinine} onChange={handleChange} className={inputClass} placeholder="Normal: 0.6-1.2" />
            </div>
            <div>
              <label className={labelClass}>CPK (mcg/L)</label>
              <input required type="number" name="creatinine_phosphokinase" value={formData.creatinine_phosphokinase} onChange={handleChange} className={inputClass} placeholder="Enzyme level" />
            </div>
            <div>
              <label className={labelClass}>Platelets (kiloplatelets/mL)</label>
              <input required type="number" name="platelets" value={formData.platelets} onChange={handleChange} className={inputClass} placeholder="e.g. 260000" />
            </div>
             <div>
              <label className={labelClass}>Serum Sodium (mEq/L)</label>
              <input required type="number" name="serum_sodium" value={formData.serum_sodium} onChange={handleChange} className={inputClass} placeholder="e.g. 135" />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 py-3 font-bold text-white transition-colors hover:bg-teal-700 disabled:bg-teal-300"
        >
          {loading ? "Analyzing Clinical Data..." : "Run AI Analysis"}
        </button>
      </form>
    </div>
  );
}