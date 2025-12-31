"use client";

import { ShieldCheck, FileText, AlertOctagon, Lock, Eye, CheckCircle } from "lucide-react";

export default function GovernancePage() {
  
  // DATA DUMMY: Audit Logs (Rekam Jejak Aktivitas)
  // Ini mensimulasikan database log keamanan (SC11 & SC6)
  const auditLogs = [
    {
      id: "LOG-9021",
      timestamp: "2025-12-31 10:42:15",
      user: "Dr. Maulana Seno",
      role: "Chief Medical Officer",
      action: "AI_PREDICTION_RUN",
      resource: "Patient: Seno Aji (P-1004)",
      status: "SUCCESS",
      ip: "192.168.1.105"
    },
    {
      id: "LOG-9020",
      timestamp: "2025-12-31 10:40:00",
      user: "Dr. Maulana Seno",
      role: "Chief Medical Officer",
      action: "VIEW_DASHBOARD",
      resource: "/dashboard",
      status: "SUCCESS",
      ip: "192.168.1.105"
    },
    {
      id: "LOG-9019",
      timestamp: "2025-12-31 09:15:22",
      user: "System Admin",
      role: "IT Administrator",
      action: "DATA_MIGRATION",
      resource: "Batch Import (Legacy DB)",
      status: "SUCCESS",
      ip: "10.0.0.55"
    },
    {
      id: "LOG-9018",
      timestamp: "2025-12-30 23:10:05",
      user: "Unknown",
      role: "Guest",
      action: "UNAUTHORIZED_ACCESS",
      resource: "/admin/config",
      status: "BLOCKED",
      ip: "45.22.19.112"
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* 1. HEADER SECTION */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Governance & Audit Trail</h1>
        <p className="text-slate-500">
            Compliance monitoring, data quality assurance, and system accountability logs.
        </p>
      </div>

      {/* 2. DATA QUALITY SCORECARDS (SC12 Data Quality) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Card 1: Data Completeness */}
          <div className="rounded-xl border bg-white p-5 shadow-sm flex items-center gap-4">
             <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                <FileText className="h-6 w-6" />
             </div>
             <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Data Completeness</p>
                <h3 className="text-2xl font-bold text-slate-800">98.5%</h3>
                <p className="text-xs text-green-600">High Integrity</p>
             </div>
          </div>

          {/* Card 2: Security Score */}
          <div className="rounded-xl border bg-white p-5 shadow-sm flex items-center gap-4">
             <div className="p-3 bg-teal-100 rounded-full text-teal-600">
                <ShieldCheck className="h-6 w-6" />
             </div>
             <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Security Compliance</p>
                <h3 className="text-2xl font-bold text-slate-800">100%</h3>
                <p className="text-xs text-slate-500">HIPAA & GDPR Ready</p>
             </div>
          </div>

          {/* Card 3: Anomaly Detection */}
          <div className="rounded-xl border bg-white p-5 shadow-sm flex items-center gap-4">
             <div className="p-3 bg-orange-100 rounded-full text-orange-600">
                <AlertOctagon className="h-6 w-6" />
             </div>
             <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Anomalies Detected</p>
                <h3 className="text-2xl font-bold text-slate-800">1</h3>
                <p className="text-xs text-slate-500">Last 24 Hours</p>
             </div>
          </div>
      </div>

      {/* 3. AI ETHICS & EXPLAINABILITY POLICY (SC6 Ethics) */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-6">
        <h3 className="flex items-center gap-2 font-bold text-blue-800 mb-2">
            <Lock className="h-5 w-5" /> AI Ethics & Privacy Protocol
        </h3>
        <p className="text-sm text-blue-700 leading-relaxed">
            VitalSense AI enforces <strong>"Human-in-the-Loop"</strong> governance. 
            All AI predictions are suggestions, not final decisions. Patient data is encrypted at rest (AES-256) 
            and anonymized before processing. The model is audited weekly for bias against age or gender demographics.
        </p>
      </div>

      {/* 4. AUDIT LOG TABLE (SC11 Security & SC6 Accountability) */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="border-b bg-slate-50 px-6 py-4 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Eye className="h-4 w-4 text-slate-500" /> System Activity Logs
            </h3>
            <button className="text-xs font-medium text-teal-600 hover:underline">Export Logs (CSV)</button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                        <th className="px-6 py-3">Timestamp</th>
                        <th className="px-6 py-3">User / Role</th>
                        <th className="px-6 py-3">Action</th>
                        <th className="px-6 py-3">Resource Affected</th>
                        <th className="px-6 py-3">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-mono text-xs">{log.timestamp}</td>
                            <td className="px-6 py-4">
                                <div className="font-medium text-slate-900">{log.user}</div>
                                <div className="text-xs text-slate-400">{log.role}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                                    {log.action}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-xs">{log.resource}</td>
                            <td className="px-6 py-4">
                                {log.status === "SUCCESS" ? (
                                    <span className="flex items-center gap-1 text-green-600 font-bold text-xs">
                                        <CheckCircle className="h-3 w-3" /> Success
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-red-600 font-bold text-xs">
                                        <Lock className="h-3 w-3" /> BLOCKED
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

    </div>
  );
}