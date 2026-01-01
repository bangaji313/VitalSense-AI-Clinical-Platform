"use client";

import Link from "next/link";
import { 
  ArrowRight, Activity, ShieldCheck, Database, 
  Stethoscope, Cpu, Globe, CheckCircle 
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-teal-100 selection:text-teal-900">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
              <Stethoscope className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">VitalSense AI</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors">
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-slate-800 hover:shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-teal-50 blur-3xl opacity-60 translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-blue-50 blur-3xl opacity-60 -translate-x-1/3 translate-y-1/4"></div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Text */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50/50 px-3 py-1 text-sm font-medium text-teal-700 mb-6">
                <span className="flex h-2 w-2 rounded-full bg-teal-600 animate-pulse"></span>
                v2.1 Production Ready
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-6 leading-tight">
                Predict Critical Risks. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">
                  Save More Lives.
                </span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                An advanced Clinical Decision Support System (CDSS) powered by Machine Learning. 
                Monitor ICU patients, predict mortality risk in real-time, and ensure data interoperability with FHIR standards.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-teal-200 transition-all hover:bg-teal-700 hover:-translate-y-1">
                  Deploy System <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="/login" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3.5 text-base font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50">
                  Live Demo
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-4 text-sm text-slate-500">
                <div className="flex -space-x-2">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200" />
                   ))}
                </div>
                <p>Trusted by 10+ Hospitals for Research</p>
              </div>
            </div>

            {/* Hero Visual (Abstract Dashboard) */}
            <div className="relative lg:h-[500px] w-full hidden lg:block">
               <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 to-slate-50 rounded-2xl border border-slate-200 shadow-2xl p-4 rotate-3 hover:rotate-0 transition-all duration-700">
                  {/* Mockup UI Inner */}
                  <div className="h-full w-full bg-white rounded-xl border border-slate-100 overflow-hidden relative">
                      <div className="absolute top-0 left-0 right-0 h-10 bg-slate-50 border-b flex items-center px-4 gap-2">
                          <div className="h-3 w-3 rounded-full bg-red-400"></div>
                          <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                          <div className="h-3 w-3 rounded-full bg-green-400"></div>
                      </div>
                      <div className="pt-16 px-8">
                          <div className="flex gap-4 mb-6">
                              <div className="h-24 w-1/3 bg-blue-50 rounded-lg animate-pulse"></div>
                              <div className="h-24 w-1/3 bg-red-50 rounded-lg"></div>
                              <div className="h-24 w-1/3 bg-teal-50 rounded-lg"></div>
                          </div>
                          <div className="space-y-3">
                              <div className="h-4 w-full bg-slate-100 rounded"></div>
                              <div className="h-4 w-5/6 bg-slate-100 rounded"></div>
                              <div className="h-4 w-4/6 bg-slate-100 rounded"></div>
                          </div>
                          {/* BAGIAN YANG TADI ERROR SUDAH DIPERBAIKI (Ganti > jadi &gt;) */}
                          <div className="mt-8 p-4 bg-slate-900 rounded-lg text-green-400 font-mono text-xs">
                              &gt; System Analysis: OK<br/>
                              &gt; Risk Prediction: 92.5% (Critical)<br/>
                              &gt; HL7 FHIR Stream: Connected_
                          </div>
                      </div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- FEATURES GRID (Bento Style) --- */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Engineered for Modern Healthcare
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Combines operational efficiency (SC4), seamless integration (SC5), and ethical AI governance (SC6).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm transition-all hover:shadow-md border border-slate-200">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Real-time AI Inference</h3>
              <p className="text-slate-600 leading-relaxed">
                Instant mortality risk scoring using Logistic Regression models directly in the browser or cloud edge.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm transition-all hover:shadow-md border border-slate-200">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 text-teal-600 group-hover:scale-110 transition-transform">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">FHIR Interoperability</h3>
              <p className="text-slate-600 leading-relaxed">
                Native support for HL7 FHIR R4 standard. Seamlessly exchange patient data with EMRs and SatuSehat.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm transition-all hover:shadow-md border border-slate-200">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">RBAC & Governance</h3>
              <p className="text-slate-600 leading-relaxed">
                Strict Role-Based Access Control and immutable Audit Logs ensure HIPAA/GDPR compliance and accountability.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- STATS / TRUST --- */}
      <section className="py-20 border-t border-slate-200 bg-white">
         <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
                <div>
                    <div className="text-4xl font-extrabold text-slate-900">99.9%</div>
                    <div className="mt-2 text-sm font-semibold text-slate-500">System Uptime</div>
                </div>
                <div>
                    <div className="text-4xl font-extrabold text-slate-900">&lt;50ms</div>
                    <div className="mt-2 text-sm font-semibold text-slate-500">Prediction Latency</div>
                </div>
                <div>
                    <div className="text-4xl font-extrabold text-slate-900">FHIR R4</div>
                    <div className="mt-2 text-sm font-semibold text-slate-500">Standard Compliant</div>
                </div>
                <div>
                    <div className="text-4xl font-extrabold text-slate-900">AES-256</div>
                    <div className="mt-2 text-sm font-semibold text-slate-500">End-to-End Encryption</div>
                </div>
            </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 py-12 text-slate-400">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
                <Stethoscope className="h-6 w-6 text-teal-500" />
                <span className="text-lg font-bold text-white">VitalSense AI</span>
            </div>
            <p className="text-sm">
                © 2025 VitalSense Project. All rights reserved. <br/>
                Developed for Applied Health Informatics (IFB-499).
            </p>
            <div className="flex gap-6">
                <Link href="#" className="hover:text-white">Privacy</Link>
                <Link href="#" className="hover:text-white">Terms</Link>
                <Link href="#" className="hover:text-white">Github</Link>
            </div>
        </div>
      </footer>

    </div>
  );
}