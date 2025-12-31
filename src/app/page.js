"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Stethoscope, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // State Form
  const [email, setEmail] = useState("seno.aji@vitalsense.ai");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // SIMULASI AUTHENTICATION (SC11 Security)
    // Kita buat delay sedikit biar terasa "memproses" enkripsi
    setTimeout(() => {
      if (password === "admin123" || password === "") { 
        // Password "admin123" atau kosong kita anggap sukses buat demo cepat
        router.push("/dashboard");
      } else {
        setError("Invalid credentials. Access denied.");
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      
      {/* BAGIAN KIRI: BRANDING & VISUAL */}
      <div className="hidden w-1/2 flex-col justify-between bg-slate-900 p-12 text-white lg:flex">
        <div>
           <div className="flex items-center gap-2 text-teal-400">
              <Stethoscope className="h-8 w-8" />
              <span className="text-2xl font-bold tracking-tight">VitalSense AI</span>
           </div>
           <div className="mt-12 max-w-lg">
              <h1 className="text-4xl font-extrabold leading-tight">
                Predictive Intelligence for Critical Care.
              </h1>
              <p className="mt-4 text-slate-400 text-lg">
                Reduce mortality rates with real-time AI risk scoring, 
                FHIR interoperability, and automated governance.
              </p>
           </div>
        </div>
        
        {/* Compliance Badges (Gimmick SC6) */}
        <div className="flex gap-6 opacity-70">
            <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-teal-400" />
                <span className="text-sm font-semibold">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-teal-400" />
                <span className="text-sm font-semibold">AES-256 Encrypted</span>
            </div>
        </div>
      </div>

      {/* BAGIAN KANAN: FORM LOGIN */}
      <div className="flex w-full flex-col justify-center px-10 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
            
            <div className="mb-8 text-center lg:text-left">
                <h2 className="text-3xl font-bold text-slate-900">Sign in to Platform</h2>
                <p className="text-slate-500 mt-2">Access the secure medical command center.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                
                {/* Email Input */}
                <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">Medical ID / Email</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                        placeholder="doctor@hospital.id"
                        required
                    />
                </div>

                {/* Password Input */}
                <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">Secure Password</label>
                    <div className="relative">
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                            placeholder="••••••••"
                        />
                        <Lock className="absolute right-3 top-3.5 h-5 w-5 text-slate-400" />
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 animate-in slide-in-from-top-2">
                        <AlertCircle className="h-4 w-4" /> {error}
                    </div>
                )}

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 py-3.5 font-bold text-white transition-all hover:bg-teal-700 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>Processing Security Handshake...</> 
                    ) : (
                        <>Access System <ArrowRight className="h-5 w-5" /></>
                    )}
                </button>

                <div className="text-center text-xs text-slate-400 mt-6">
                    Protected by VitalSense Identity Management (v2.1). <br/>
                    Unauthorised access is a criminal offence.
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}