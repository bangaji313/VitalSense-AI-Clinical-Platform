"use client";

import { Bell, Search, LogOut, Menu } from "lucide-react"; // Tambah ikon Menu
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { logActivity } from "@/lib/logger"; 
import { useSearch } from "@/lib/SearchContext"; 

// Terima props setMobileMenuOpen
export default function Header({ setMobileMenuOpen }) {
  const router = useRouter();
  const { user, userRole } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch(); 

  const handleLogout = async () => {
    await logActivity(user, "LOGOUT", "System Exit", "SUCCESS");
    await signOut(auth);
    router.push("/");
  };

  return (
    // PERBAIKAN CSS HEADER:
    // left-0: Default nempel kiri (HP)
    // md:left-64: Di Desktop geser 64 (sebelah sidebar)
    <header className="fixed left-0 md:left-64 right-0 top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 md:px-6 shadow-sm transition-all duration-300">
      
      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* TOMBOL HAMBURGER (Hanya muncul di Mobile / md:hidden) */}
        <button 
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100"
        >
            <Menu className="h-6 w-6" />
        </button>

        {/* Search Bar Responsif */}
        {/* w-full di HP, w-96 di Desktop */}
        <div className="flex items-center rounded-md bg-slate-100 px-3 py-2 w-full md:w-96 ring-1 ring-transparent focus-within:ring-teal-500 transition-all">
            <Search className="h-4 w-4 text-slate-500 mr-2 flex-shrink-0" />
            <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none text-sm focus:outline-none w-full text-slate-700 placeholder:text-slate-400 min-w-0"
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
            />
            {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600 text-xs font-bold px-1">✕</button>
            )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 ml-2 flex-shrink-0">
        <button className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
        </button>

        <div className="pl-2 md:pl-4 border-l flex items-center gap-2 md:gap-4">
            <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-800 truncate max-w-[150px]">{user?.displayName || "User"}</p>
                <p className="text-xs text-teal-600 font-medium">{userRole || "Medical Staff"}</p>
            </div>
            
            {/* Tombol Logout: Di HP cuma Icon, Di Desktop Icon + Teks */}
            <button 
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg bg-red-50 px-2 md:px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors border border-red-100"
                title="Sign Out"
            >
                <LogOut className="h-4 w-4" /> 
                <span className="hidden md:inline">Sign Out</span>
            </button>
        </div>
      </div>
    </header>
  );
}