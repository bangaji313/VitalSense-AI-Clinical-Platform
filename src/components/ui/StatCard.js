import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

export default function StatCard({ title, value, icon: Icon, trend, trendValue, status }) {
    // Logic warna status
    const statusColors = {
        success: "text-green-600 bg-green-50",
        warning: "text-yellow-600 bg-yellow-50",
        danger: "text-red-600 bg-red-50",
        neutral: "text-blue-600 bg-blue-50"
    };

    return (
        <div className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
                </div>
                <div className={cn("p-3 rounded-lg", statusColors[status] || statusColors.neutral)}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
            
            {/* Trend Footer */}
            <div className="mt-4 flex items-center gap-2 text-xs">
                {trend === "up" && <ArrowUp className="h-3 w-3 text-red-500" />}
                {trend === "down" && <ArrowDown className="h-3 w-3 text-green-500" />}
                {trend === "neutral" && <Minus className="h-3 w-3 text-slate-400" />}
                
                <span className={cn(
                    "font-medium", 
                    trend === "up" ? "text-red-500" : trend === "down" ? "text-green-500" : "text-slate-500"
                )}>
                    {trendValue}
                </span>
                <span className="text-slate-400">vs last month</span>
            </div>
        </div>
    );
}