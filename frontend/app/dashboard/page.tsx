"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userDataStr = localStorage.getItem("davetgeldi_user");
    const token = localStorage.getItem("davetgeldi_token");

    if (!userDataStr || !token) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(userDataStr);
    setUser(userData);

    fetch("http://127.0.0.1:3000/invitations", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const myInvitations = Array.isArray(data) ? data.filter(inv => inv.userId === userData.id) : [];
        setInvitations(myInvitations);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Davetiyeler çekilemedi:", err);
        setIsLoading(false);
      });
  }, [router]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Panel Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Hoş Geldin, {user?.fullName.split(' ')[0]} 👋</h1>
            <p className="text-slate-500 mt-2">Davetiyelerinizi ve etkinlik detaylarınızı buradan yönetebilirsiniz.</p>
          </div>
          <div className="flex items-center gap-3">
            {user?.role === "ADMIN" && (
              <Link href="/admin" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-slate-800 transition-colors">
                Yönetici Paneli
              </Link>
            )}
            <Link href="/olustur" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-colors">
              + Yeni Davetiye
            </Link>
          </div>
        </header>

        {invitations.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
            <div className="text-6xl mb-4">💌</div>
            <h3 className="text-xl font-bold text-slate-800">Henüz Davetiyeniz Yok</h3>
            <p className="text-slate-500 mt-2 mb-6">İlk etkinliğinizi oluşturmak için harika bir gün!</p>
            <Link href="/olustur" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-full text-sm font-bold shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">
              Hemen Oluştur
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {invitations.map((inv) => (
              <div key={inv.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    {inv.status === 'PENDING_PAYMENT' && <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>Ödeme Bekliyor</span>}
                    {inv.status === 'ACTIVE' && <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Yayında</span>}
                    
                    {/* YENİ: KATEGORİ ROZETİ EKLENDİ */}
                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md text-xs font-bold border border-indigo-100">
                      🏷️ {inv.category?.name || "Kategori Yok"}
                    </span>

                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-xs font-bold">
                      {inv.package?.name || "Özel Paket"}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-slate-900">
                    {inv.brideName} {inv.groomName ? `& ${inv.groomName}` : ""}
                  </h2>
                  <div className="text-sm text-slate-500 mt-1 flex items-center gap-4">
                    <span>📅 {new Date(inv.eventDate).toLocaleDateString('tr-TR')}</span>
                    <Link href={`/${inv.slug}`} target="_blank" className="text-indigo-600 hover:underline">
                      🔗 davetgeldi.com/{inv.slug}
                    </Link>
                  </div>
                </div>

                <Link href={`/dashboard/invitation/${inv.id}`} className="w-full md:w-auto text-center bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg transition-all">
                  Davetiyeyi Yönet →
                </Link>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}