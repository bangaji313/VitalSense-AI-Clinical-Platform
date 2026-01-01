"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Activity, Database, ShieldCheck, Stethoscope, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext"; 

// Terima props dari Layout
export default function Sidebar({ mobileMenuOpen, setMobileMenuOpen }) {
  const pathname = usePathname();
  const { userRole } = useAuth(); 

  const menuItems = [
    {
      title: "Command Center",
      href: "/dashboard",
      icon: LayoutDashboard,
      description: "Real-time Monitoring",
      allowedRoles: ["Medical Doctor", "Nurse", "Hospital Admin"] 
    },
    {
      title: "Integration (FHIR)",
      href: "/dashboard/integration",
      icon: Activity,
      description: "Interoperability",
      allowedRoles: ["Medical Doctor", "IT Staff"]
    },
    {
      title: "Data Migration",
      href: "/dashboard/migration",
      icon: Database,
      description: "ETL & Import",
      allowedRoles: ["Medical Doctor", "IT Staff"]
    },
    {
      title: "Governance & Audit",
      href: "/dashboard/governance",
      icon: ShieldCheck,
      description: "Quality & Security",
      allowedRoles: ["Medical Doctor", "Hospital Admin"]
    },
  ];

  return (
    <>
    {/* PERBAIKAN CSS SIDEBAR:
       - fixed inset-y-0 left-0: Selalu nempel kiri penuh atas-bawah
       - z-40: Di atas konten lain
       - transform transition-transform: Animasi halus
       - -translate-x-full: Default di HP sembunyi ke kiri
       - md:translate-x-0: Di Desktop selalu muncul
       - mobileMenuOpen ? 'translate-x-0' : ... : Logika buka tutup di HP
    */}
    <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 border-r bg-slate-900 text-white transition-transform duration-300 ease-in-out md:translate-x-0",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
        <div className="flex items-center">
            <Stethoscope className="mr-2 h-6 w-6 text-teal-400" />
            <span className="text-xl font-bold tracking-tight">VitalSense AI</span>
        </div>
        {/* Tombol Close (X) hanya di HP */}
        <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X className="h-6 w-6" />
        </button>
      </div>

      <div className="h-full overflow-y-auto px-3 py-4">
        <ul className="space-y-2 font-medium">
          {menuItems.map((item) => {
            if (userRole && !item.allowedRoles.includes(userRole)) return null;
            if (!userRole) return null;

            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)} // Tutup menu saat link diklik (UX HP)
                  className={cn(
                    "group flex items-center rounded-lg p-3 transition-colors hover:bg-slate-800",
                    isActive ? "bg-teal-600 text-white hover:bg-teal-700" : "text-slate-400"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-white" : "text-slate-400")} />
                  <div className="ml-3">
                    <span className="block text-sm font-semibold">{item.title}</span>
                    <span className="block text-[10px] opacity-70 font-normal">{item.description}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        
        <div className="mt-10 rounded-lg bg-slate-800 p-4 border border-slate-700 mx-2">
            <p className="text-[10px] uppercase text-slate-400 tracking-wider">Current Access</p>
            <div className="mt-1 flex items-center gap-2">
                <div className={cn("h-2 w-2 rounded-full animate-pulse", userRole ? "bg-green-500" : "bg-red-500")}></div>
                <span className="text-xs font-bold text-white">{userRole || "Verifying..."}</span>
            </div>
        </div>
      </div>
    </aside>
    </>
  );
}