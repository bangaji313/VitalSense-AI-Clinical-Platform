"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; 
import { auth, db } from "@/lib/firebase"; 
import { 
  Stethoscope, UserPlus, Mail, User, ShieldCheck, 
  CheckCircle, Eye, EyeOff, Info, X, HelpCircle 
} from "lucide-react"; 

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // State untuk Toggle Password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // State untuk Popup Role Info
  const [showRoleInfo, setShowRoleInfo] = useState(false);

  // State Form
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Medical Doctor"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: formData.fullName
      });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        createdAt: serverTimestamp(),
        isActive: true,
        emailVerified: false 
      });

      await sendEmailVerification(user);

      setSuccess(true);
      setLoading(false);

    } catch (err) {
      console.error("Registration Error:", err);
      let msg = "Failed to register.";
      if (err.code === "auth/email-already-in-use") msg = "Email is already registered.";
      if (err.code === "auth/weak-password") msg = "Password should be at least 6 characters.";
      setError(msg);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-xl border bg-white p-8 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-slate-900">Account Created!</h2>
            <p className="mb-6 text-slate-500">
                We have sent a verification email to <strong>{formData.email}</strong>. 
                Please check your inbox (and spam folder) to activate your account.
            </p>
            <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700 mb-6">
                <strong>System Note:</strong> For this exam demo, you can proceed to login, 
                but in a real system, access would be restricted until verified.
            </div>
            <button 
                onClick={() => router.push("/login")} 
                className="w-full rounded-lg bg-teal-600 py-3 font-bold text-white hover:bg-teal-700"
            >
                Back to Login
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50 font-sans">
      
      {/* --- ROLE INFO MODAL (POPUP) --- */}
      {showRoleInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="bg-slate-900 px-6 py-5 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-teal-400" /> 
                        Role-Based Access Guide
                    </h3>
                    <button onClick={() => setShowRoleInfo(false)} className="text-slate-400 hover:text-white transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 bg-slate-50 max-h-[70vh] overflow-y-auto">
                    <p className="text-sm text-slate-500 mb-4">
                        VitalSense AI enforces strict access control. Choose the role that matches your profession:
                    </p>
                    
                    <div className="space-y-3">
                        {/* Medical Doctor */}
                        <div className="flex gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-teal-400 transition-colors">
                            <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 flex-shrink-0">
                                <Stethoscope className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">Medical Doctor (Chief)</h4>
                                <p className="text-xs text-slate-500 mt-1">
                                    <span className="font-semibold text-teal-700">Full Access:</span> Command Center, Patient Detail, Integration API, Migration Tool, and Audit Logs. 
                                </p>
                            </div>
                        </div>

                        {/* Nurse */}
                        <div className="flex gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 transition-colors">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                                <UserPlus className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">ICU Nurse</h4>
                                <p className="text-xs text-slate-500 mt-1">
                                    <span className="font-semibold text-blue-700">Clinical Only:</span> Can View Dashboard & Input New Patient Assessment. Restricted from System Config & Logs.
                                </p>
                            </div>
                        </div>

                        {/* IT Support */}
                        <div className="flex gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-purple-400 transition-colors">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 flex-shrink-0">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">IT Support (Technical)</h4>
                                <p className="text-xs text-slate-500 mt-1">
                                    <span className="font-semibold text-purple-700">Technical Only:</span> Access to Data Migration (ETL) and FHIR Integration. <span className="text-red-500 font-bold">Cannot View Patient Dashboard (Privacy).</span>
                                </p>
                            </div>
                        </div>

                        {/* Admin */}
                        <div className="flex gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-orange-400 transition-colors">
                            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 flex-shrink-0">
                                <Info className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">Hospital Administrator</h4>
                                <p className="text-xs text-slate-500 mt-1">
                                    <span className="font-semibold text-orange-700">Governance Only:</span> View Dashboard Statistics & Governance Audit Logs. No Clinical Input access.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Modal Footer */}
                <div className="p-4 bg-white border-t border-slate-200 flex justify-end">
                    <button 
                        onClick={() => setShowRoleInfo(false)}
                        className="px-6 py-2 rounded-lg bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors"
                    >
                        Understood
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Bagian Kiri: Visual */}
      <div className="hidden w-1/2 flex-col justify-between bg-slate-900 p-12 text-white lg:flex">
        <div className="flex items-center gap-2 text-teal-400">
            <Stethoscope className="h-8 w-8" />
            <span className="text-2xl font-bold tracking-tight">VitalSense AI</span>
        </div>
        <div>
            <h1 className="text-4xl font-extrabold leading-tight">Join the Network.</h1>
            <p className="mt-4 text-slate-400 text-lg">
                Create your secure credentials to access the Integrated ICU Mortality Prediction System.
            </p>
        </div>
        <div className="flex gap-4 opacity-70">
            <div className="flex items-center gap-2 text-sm"><ShieldCheck className="h-4 w-4"/> Secure RBAC</div>
        </div>
      </div>

      {/* Bagian Kanan: Form */}
      <div className="flex w-full flex-col justify-center px-10 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900">Register Account</h2>
                <p className="text-slate-500 mt-2">Enter your professional details below.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
                
                {/* Full Name */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Full Name & Title</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <input required name="fullName" type="text" placeholder="e.g. Dr. Maulana Seno" 
                            className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none"
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Professional Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <input required name="email" type="email" placeholder="doctor@hospital.id" 
                            className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none"
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Role Selection dengan Tombol Info */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-bold text-slate-700">System Role</label>
                        <button 
                            type="button" 
                            onClick={() => setShowRoleInfo(true)}
                            className="text-xs font-semibold text-teal-600 hover:text-teal-800 flex items-center gap-1 transition-colors"
                        >
                            <HelpCircle className="h-3 w-3" /> Which role should I choose?
                        </button>
                    </div>
                    <select name="role" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none bg-white" onChange={handleChange}>
                        <option value="Medical Doctor">Medical Doctor (Chief)</option>
                        <option value="Nurse">ICU Nurse</option>
                        <option value="Hospital Admin">Hospital Administrator</option>
                        <option value="IT Staff">IT Support (Technical)</option>
                    </select>
                </div>

                {/* Password Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Password Utama */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                        <div className="relative">
                            <input 
                                required 
                                name="password" 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••" 
                                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none"
                                onChange={handleChange}
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Confirm</label>
                        <div className="relative">
                            <input 
                                required 
                                name="confirmPassword" 
                                type={showConfirm ? "text" : "password"} 
                                placeholder="••••••" 
                                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none"
                                onChange={handleChange}
                            />
                            <button 
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                            >
                                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error Box */}
                {error && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                        {error}
                    </div>
                )}

                <button type="submit" disabled={loading} className="w-full rounded-lg bg-teal-600 py-3 font-bold text-white hover:bg-teal-700 disabled:opacity-70 flex justify-center items-center gap-2">
                    {loading ? "Registering..." : <><UserPlus className="h-5 w-5"/> Create Account</>}
                </button>

                <div className="text-center text-sm text-slate-600 mt-4">
                    Already have an account? <Link href="/login" className="text-teal-600 font-bold hover:underline">Sign In here</Link>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}