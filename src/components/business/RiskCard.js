import { AlertTriangle, CheckCircle, Activity, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RiskCard({ result, patientData }) {
  if (!result) return null;

  const isHighRisk = result.probability > 0.5;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. KARTU UTAMA: SKOR */}
      <div className={cn(
        "rounded-xl border p-6 text-center shadow-lg transition-all",
        isHighRisk ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
      )}>
        <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500">Mortality Risk Prediction</h3>
        
        <div className="mt-4 flex items-center justify-center gap-4">
           {isHighRisk ? 
             <AlertTriangle className="h-12 w-12 text-red-600 animate-pulse" /> : 
             <CheckCircle className="h-12 w-12 text-green-600" />
           }
           <div>
             <span className={cn("text-5xl font-extrabold", isHighRisk ? "text-red-700" : "text-green-700")}>
                {result.riskScore}%
             </span>
             <p className={cn("text-sm font-bold", isHighRisk ? "text-red-600" : "text-green-600")}>
                {result.riskLevel.toUpperCase()} RISK
             </p>
           </div>
        </div>

        <p className="mt-4 text-xs text-slate-500">
            Based on logistic regression analysis of 12 clinical variables.
            <br/> Threshold for high risk is {">"} 50%.
        </p>
      </div>

      {/* 2. EXPLAINABLE AI SECTION (SC6 Governance/Transparency) */}
      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            <h4 className="font-bold text-slate-800">AI Insight: Key Drivers</h4>
        </div>
        
        <div className="space-y-3">
            {result.explanation.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                        <p className="text-sm font-medium text-slate-700 capitalize">
                            {item.feature.replace(/_/g, " ")}
                        </p>
                        <p className="text-xs text-slate-400">Value: {item.value}</p>
                    </div>
                    <div className={cn(
                        "text-xs font-bold px-2 py-1 rounded",
                        item.impact === "Increases Risk" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                    )}>
                        {item.impact}
                    </div>
                </div>
            ))}
            
            {result.explanation.length === 0 && (
                <p className="text-sm text-slate-500 italic">No single factor dominates, risk is balanced across variables.</p>
            )}
        </div>
        
        <div className="mt-4 bg-slate-100 p-3 rounded text-xs text-slate-600">
            <strong>Clinical Recommendation:</strong> 
            {isHighRisk 
              ? " Patient requires immediate ICU monitoring and aggressive intervention. High probability of adverse event." 
              : " Patient is stable. Continue standard ward monitoring and routine care."}
        </div>
      </div>
    </div>
  );
}