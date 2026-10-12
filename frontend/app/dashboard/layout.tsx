"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userDataStr = localStorage.getItem("davetgeldi_user");
    if (!userDataStr) {
      router.push("/login");
      return;
    }
    
    setUser(JSON.parse(userDataStr));
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    if (confirm("Hesabınızdan çıkış yapmak istediğinize emin misiniz?")) {
      localStorage.removeItem("davetgeldi_token");
      localStorage.removeItem("davetgeldi_user");
      router.push("/login");
    }
  };

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">Panel Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* PROFESYONEL ÜST NAVBAR (Tüm müşteri sayfalarında sabit kalır) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Sol Kısım: Logo */}
          <Link href="/dashboard" className="text-2xl font-black tracking-tighter text-slate-900 transition-transform hover:scale-105">
            DavetGeldi<span className="text-indigo-600">.</span>
          </Link>

          {/* Sağ Kısım: Aksiyonlar ve Profil */}
          <div className="flex items-center gap-4 md:gap-6">
            
            {/* Hızlı Davetiye Oluştur Butonu */}
            <Link href="/olustur" className="hidden md:flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors">
              <span>+</span> Yeni Davetiye
            </Link>

            {/* Ayıraç */}
            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

            {/* Kullanıcı Profili */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-md">
                {user?.fullName?.charAt(0).toUpperCase() || "M"}
              </div>
              <div className="hidden md:block text-right">
                <div className="text-sm font-bold text-slate-900 leading-tight">{user?.fullName}</div>
                <div className="text-xs text-slate-500 font-medium">
                  {user?.role === 'ADMIN' ? 'Yönetici Hesabı' : 'Müşteri Hesabı'}
                </div>
              </div>
            </div>

            {/* Çıkış Yap Butonu */}
            <button 
              onClick={handleLogout} 
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Çıkış Yap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>

          </div>
        </div>
      </header>

      {/* ALT SAYFALARIN İÇERİĞİ BURAYA GELECEK */}
      <main className="flex-1 w-full">
        {children}
      </main>

    </div>
  );
}