"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { 
  Stethoscope, ArrowRight, ShieldCheck, AlertCircle, 
  Eye, EyeOff, Info, Check, X 
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // State Form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // State Modal Demo
  const [showDemoModal, setShowDemoModal] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login Success");
      router.push("/dashboard");
    } catch (err) {
      console.error("Login Failed", err);
      let msg = "Failed to login.";
      if (err.code === "auth/invalid-credential") msg = "Wrong email or password.";
      if (err.code === "auth/too-many-requests") msg = "Too many attempts. Try again later.";
      setError(msg);
      setLoading(false);
    }
  };

  // Fungsi Mengisi Credential Demo
  const fillDemoCredentials = () => {
    // Pastikan email ini sesuai dengan akun Dokter yang sudah Mas buat
    setEmail("senoaji3313@gmail.com"); 
    setPassword("admin123"); 
    
    setShowDemoModal(false); 
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 font-sans">
      
      {/* --- DEMO ACCOUNT MODAL --- */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                
                {/* Modal Header */}
                <div className="bg-slate-900 px-6 py-5 md:px-8 md:py-6 flex justify-between items-start shrink-0">
                    <div>
                        <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                            <Info className="h-5 w-5 text-teal-400" /> 
                            System Access & Role Guide
                        </h3>
                        <p className="text-slate-400 text-xs md:text-sm mt-1">
                            Please review the access levels before proceeding.
                        </p>
                    </div>
                    <button onClick={() => setShowDemoModal(false)} className="text-slate-400 hover:text-white transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Modal Body (Scrollable) */}
                <div className="p-6 md:p-8 overflow-y-auto">
                    <div className="mb-6 bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
                        <strong>Notice:</strong> You are about to use a Shared Demo Account with <span className="font-bold underline">Chief Medical Officer</span> privileges. This grants you full access to all system modules.
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Available System Roles (RBAC)</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="p-4 rounded-xl border border-teal-200 bg-teal-50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-teal-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">DEMO ACCESS</div>
                            <div className="font-bold text-slate-800 mb-1">Medical Doctor (Chief)</div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Full access to Command Center, Patient Data, Integration API, and Audit Logs.
                            </p>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-200 bg-white opacity-70">
                            <div className="font-bold text-slate-800 mb-1">ICU Nurse</div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Restricted access. Operational monitoring and patient assessment input only. No API access.
                            </p>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-200 bg-white opacity-70">
                            <div className="font-bold text-slate-800 mb-1">IT Support</div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Technical access only (Data Migration & Integration). Cannot view patient clinical details.
                            </p>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-200 bg-white opacity-70">
                            <div className="font-bold text-slate-800 mb-1">Hospital Admin</div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Governance focus. Access to Dashboard statistics and Audit Logs. No clinical editing.
                            </p>
                        </div>
                    </div>

                    <p className="text-xs text-slate-500 italic mb-6">
                        *To test other roles (Nurse/IT/Admin), please Register a new account manually.
                    </p>

                    <div className="flex flex-col-reverse md:flex-row gap-3 justify-end pt-2">
                        <button 
                            onClick={() => setShowDemoModal(false)}
                            className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={fillDemoCredentials}
                            className="px-5 py-2.5 rounded-lg bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 shadow-lg shadow-teal-200/50 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                        >
                            Load Chief Doctor Credentials <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- LOGIN PAGE CONTENT --- */}
      
      {/* Bagian Kiri: Visual (PERBAIKAN LAYOUT CENTER) */}
      <div className="hidden w-1/2 flex-col justify-between bg-slate-900 p-12 text-white lg:flex">
        
        {/* Item 1: Logo (Top) */}
        <div className="flex items-center gap-2 text-teal-400">
           <Stethoscope className="h-8 w-8" />
           <span className="text-2xl font-bold tracking-tight">VitalSense AI</span>
        </div>
        
        {/* Item 2: Text (Center - otomatis karena justify-between) */}
        <div className="max-w-lg">
           <h1 className="text-4xl font-extrabold leading-tight">
             Predictive Intelligence for Critical Care.
           </h1>
           <p className="mt-4 text-slate-400 text-lg">
             Reduce mortality rates with real-time AI risk scoring, 
             FHIR interoperability, and automated governance.
           </p>
        </div>

        {/* Item 3: Footer (Bottom) */}
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

      {/* Bagian Kanan: Form */}
      <div className="flex w-full flex-col justify-center px-6 py-10 md:px-10 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
                <h2 className="text-3xl font-bold text-slate-900">Sign in to Platform</h2>
                <p className="text-slate-500 mt-2">Access the secure medical command center.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
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

                <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">Secure Password</label>
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                            placeholder="••••••••"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 animate-in slide-in-from-top-2">
                        <AlertCircle className="h-4 w-4" /> {error}
                    </div>
                )}

                <div className="space-y-3">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 py-3.5 font-bold text-white transition-all hover:bg-teal-700 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "Verifying Credentials..." : <>Access System <ArrowRight className="h-5 w-5" /></>}
                    </button>

                    <button 
                        type="button"
                        onClick={() => setShowDemoModal(true)}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 py-3 font-semibold text-slate-600 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 transition-all"
                    >
                        <Info className="h-4 w-4" /> Use Demo Account
                    </button>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-600">
                    <span>No credentials?</span>
                    <a href="/register" className="font-bold text-teal-600 hover:underline">
                        Register New Account
                    </a>
                </div>

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