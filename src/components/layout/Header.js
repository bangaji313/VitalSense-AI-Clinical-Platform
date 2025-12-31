"use client";

import { Bell, UserCircle, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed left-64 right-0 top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      {/* Search Bar (Dummy Visual) */}
      <div className="flex items-center rounded-md bg-slate-100 px-3 py-2 w-96">
        <Search className="h-4 w-4 text-slate-500 mr-2" />
        <input 
            type="text" 
            placeholder="Search patient MRN, diagnosis..." 
            className="bg-transparent border-none text-sm focus:outline-none w-full text-slate-700"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notifikasi */}
        <button className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
        </button>

        {/* User Profile - SC11 Security User Mgmt Simulation */}
        <div className="flex items-center gap-3 pl-4 border-l">
            <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-800">Dr. Maulana Seno</p>
                <p className="text-xs text-teal-600 font-medium">Chief Medical Officer</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                <UserCircle className="h-8 w-8" />
            </div>
        </div>
      </div>
    </header>
  );
}