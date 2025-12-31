"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Activity, 
  Database, 
  ShieldCheck, 
  Stethoscope, 
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Command Center",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Real-time Monitoring"
  },
  {
    title: "Integration (FHIR)",
    href: "/dashboard/integration",
    icon: Activity, // SC5 - API
    description: "Interoperability"
  },
  {
    title: "Data Migration",
    href: "/dashboard/migration",
    icon: Database, // SC4 - Migration
    description: "ETL & Import"
  },
  {
    title: "Governance & Audit",
    href: "/dashboard/governance",
    icon: ShieldCheck, // SC6 - Governance
    description: "Quality & Security"
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-slate-900 text-white transition-transform">
      {/* Header Sidebar */}
      <div className="flex h-16 items-center border-b border-slate-800 px-6">
        <Stethoscope className="mr-2 h-6 w-6 text-teal-400" />
        <span className="text-xl font-bold tracking-tight">VitalSense AI</span>
      </div>

      {/* Menu Items */}
      <div className="h-full overflow-y-auto px-3 py-4">
        <ul className="space-y-2 font-medium">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center rounded-lg p-3 transition-colors hover:bg-slate-800",
                    isActive ? "bg-teal-600 text-white hover:bg-teal-700" : "text-slate-400"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 flex-shrink-0 transition duration-75", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                  <div className="ml-3">
                    <span className="block text-sm font-semibold">{item.title}</span>
                    <span className="block text-[10px] opacity-70 font-normal">{item.description}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        
        {/* Banner Bawah */}
        <div className="mt-10 rounded-lg bg-slate-800 p-4">
            <p className="text-xs text-slate-400">System Status</p>
            <div className="mt-2 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-bold text-green-400">Online & Secure</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Ver 2.1.0 (EAS Build)</p>
        </div>
      </div>
    </aside>
  );
}