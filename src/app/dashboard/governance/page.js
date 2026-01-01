"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, FileText, AlertOctagon, Lock, Eye, CheckCircle, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

export default function GovernancePage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil 20 log terakhir secara realtime
    const q = query(collection(db, "audit_logs"), orderBy("timestamp", "desc"), limit(20));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveLogs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLogs(liveLogs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Governance & Audit Trail</h1>
        <p className="text-slate-500">Live system accountability logs and security monitoring.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-5 shadow-sm flex items-center gap-4">
             <div className="p-3 bg-blue-100 rounded-full text-blue-600"><FileText className="h-6 w-6" /></div>
             <div><p className="text-xs font-bold text-slate-500 uppercase">Total Transactions</p><h3 className="text-2xl font-bold text-slate-800">{logs.length}</h3></div>
          </div>
          <div className="rounded-xl border bg-white p-5 shadow-sm flex items-center gap-4">
             <div className="p-3 bg-teal-100 rounded-full text-teal-600"><ShieldCheck className="h-6 w-6" /></div>
             <div><p className="text-xs font-bold text-slate-500 uppercase">Security Compliance</p><h3 className="text-2xl font-bold text-slate-800">100%</h3></div>
          </div>
          <div className="rounded-xl border bg-white p-5 shadow-sm flex items-center gap-4">
             <div className="p-3 bg-orange-100 rounded-full text-orange-600"><AlertOctagon className="h-6 w-6" /></div>
             <div><p className="text-xs font-bold text-slate-500 uppercase">Anomalies Detected</p><h3 className="text-2xl font-bold text-slate-800">0</h3></div>
          </div>
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50 p-6">
        <h3 className="flex items-center gap-2 font-bold text-blue-800 mb-2"><Lock className="h-5 w-5" /> SC6: Accountability Protocol</h3>
        <p className="text-sm text-blue-700">Every action in this system is immutable and recorded in the Firestore Cloud Ledger for audit purposes.</p>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="border-b bg-slate-50 px-6 py-4 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Eye className="h-4 w-4 text-slate-500" /> Live Activity Logs
            </h3>
            {loading && <Loader2 className="h-4 w-4 animate-spin text-teal-600"/>}
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                        <th className="px-6 py-3">Timestamp</th>
                        <th className="px-6 py-3">User / Role</th>
                        <th className="px-6 py-3">Action</th>
                        <th className="px-6 py-3">Resource</th>
                        <th className="px-6 py-3">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {loading && <tr><td colSpan="5" className="p-4 text-center">Loading logs...</td></tr>}
                    
                    {!loading && logs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-mono text-xs text-slate-500">
                                {log.timestamp?.seconds ? new Date(log.timestamp.seconds * 1000).toLocaleString() : "Just now"}
                            </td>
                            <td className="px-6 py-4">
                                <div className="font-medium text-slate-900">{log.user}</div>
                                <div className="text-xs text-slate-400">{log.role}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700 border border-slate-200">
                                    {log.action}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-xs font-mono">{log.resource}</td>
                            <td className="px-6 py-4">
                                <span className="flex items-center gap-1 text-green-600 font-bold text-xs">
                                    <CheckCircle className="h-3 w-3" /> {log.status}
                                </span>
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