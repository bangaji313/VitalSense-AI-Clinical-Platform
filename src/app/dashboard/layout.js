"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // State untuk Menu Mobile
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login"); 
    }
  }, [user, loading, router]);

  if (loading || !user) return null; 

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar menerima props untuk kontrol mobile */}
      <Sidebar 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />
      
      {/* PERBAIKAN RESPONSIF:
         md:ml-64 -> Margin kiri 64 hanya di Desktop (md ke atas).
         ml-0 -> Di HP margin kiri 0.
      */}
      <div className="flex-1 w-full ml-0 md:ml-64 transition-all duration-300">
        
        {/* Header menerima props untuk tombol toggle */}
        <Header setMobileMenuOpen={setMobileMenuOpen} />
        
        <main className="mt-16 p-4 md:p-6">
            {children}
        </main>
      </div>

      {/* Overlay Gelap saat Menu Mobile Terbuka */}
      {mobileMenuOpen && (
        <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
        />
      )}
    </div>
  );
}