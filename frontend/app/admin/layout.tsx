"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userDataStr = localStorage.getItem("davetgeldi_user");
    
    // Sadece giriş yapmış mı diye bakıyoruz, Admin mi diye sormuyoruz (Geliştirme aşaması için)
    if (!userDataStr) {
      router.push("/login");
      return;
    }

    
    const user = JSON.parse(userDataStr);
    if (user.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }
    

    setIsAuthorized(true);
    setIsLoading(false);
  }, [router]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Admin Yetkileri Doğrulanıyor...</div>;

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* SOL MENÜ (SIDEBAR) */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex fixed h-full z-10">
        <div className="h-20 flex items-center px-8 border-b border-slate-800">
          <span className="text-2xl font-black text-white tracking-tighter">DavetGeldi<span className="text-indigo-500">.</span></span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="block px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">📊 Dashboard</Link>
          <Link href="/admin/invitations" className="block px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">💌 Davetiyeler (Siparişler)</Link>
          <Link href="/admin/customers" className="block px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">👥 Müşteriler</Link>
          <Link href="/admin/categories" className="block px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">📁 Kategoriler</Link>
          <Link href="/admin/themes" className="block px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">🎨 Temalar & Tasarımlar</Link>
          <Link href="/admin/packages" className="block px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">💰 Ürünler & Fiyatlar</Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Link href="/dashboard" className="block px-4 py-3 bg-indigo-600/20 text-indigo-400 rounded-xl font-bold text-center hover:bg-indigo-600 hover:text-white transition-colors">Müşteri Paneline Geç</Link>
        </div>
      </aside>

      {/* SAĞ İÇERİK ALANI */}
      <main className="flex-1 md:ml-64 p-8">
        {children}
      </main>
    </div>
  );
}