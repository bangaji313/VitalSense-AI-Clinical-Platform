import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Tetap di Kiri */}
      <Sidebar />

      {/* Konten Utama di Kanan */}
      <div className="ml-64 w-full">
        <Header />
        <main className="mt-16 p-6">
            {children}
        </main>
      </div>
    </div>
  );
}