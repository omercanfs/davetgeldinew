"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalInvitations: 0, pendingPayment: 0, activeInvitations: 0, totalRevenue: 0 });
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Veritabanından gerçek verileri çekiyoruz
  const fetchData = async () => {
    try {
      const statsRes = await fetch("http://localhost:3000/admin/stats");
      const statsData = await statsRes.json();
      setStats(statsData);

      const invRes = await fetch("http://localhost:3000/admin/invitations");
      const invData = await invRes.json();
      setInvitations(invData);
    } catch (error) {
      console.error("Veriler çekilemedi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Adminin Havale/EFT Onaylama İşlemi
  const handleApprove = async (id: number) => {
    if (!confirm("EFT/Havale ödemesini onaylayıp, davetiyeyi yayına almak istediğinize emin misiniz?")) return;
    
    try {
      const res = await fetch(`http://localhost:3000/admin/invitations/${id}/approve`, { method: "PATCH" });
      if (res.ok) {
        alert("✅ Davetiye başarıyla onaylandı ve yayına alındı!");
        fetchData(); // Tabloyu ve istatistikleri anında güncelle
      } else {
        alert("Bir hata oluştu.");
      }
    } catch (error) {
      alert("Sunucuya bağlanılamadı.");
    }
  };

  if (isLoading) return <div className="p-20 text-center font-bold text-slate-500">Yönetim Paneli Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      

      {/* SAĞ İÇERİK */}
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Hoş Geldin, Yönetici</h1>
            <p className="text-slate-500 mt-1">Gerçek zamanlı sistem verileri.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm font-bold text-slate-700">
            {new Date().toLocaleDateString('tr-TR')}
          </div>
        </header>

        {/* GERÇEK İSTATİSTİKLER */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-blue-500">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Toplam Davetiye</p>
            <h3 className="text-4xl font-bold text-slate-800">{stats.totalInvitations}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-amber-500">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Ödeme Bekleyen</p>
            <h3 className="text-4xl font-bold text-amber-600">{stats.pendingPayment}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Aktif & Yayında</p>
            <h3 className="text-4xl font-bold text-emerald-600">{stats.activeInvitations}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-purple-500">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Aylık Gelir</p>
            <h3 className="text-4xl font-bold text-purple-600">₺{stats.totalRevenue.toLocaleString('tr-TR')}</h3>
          </div>
        </div>

        {/* GERÇEK DAVETİYE TABLOSU */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Son Oluşturulan Davetiyeler</h2>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-sm text-slate-500 uppercase tracking-wider">
                <th className="p-4 font-medium">Davetiye Bilgisi</th>
                <th className="p-4 font-medium">Müşteri</th>
                <th className="p-4 font-medium">Kategori</th>
                <th className="p-4 font-medium">Paket</th>
                <th className="p-4 font-medium">Durum</th>
                <th className="p-4 font-medium text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invitations.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400">Henüz davetiye oluşturulmamış.</td></tr>
              ) : (
                invitations.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-800">{inv.brideName} {inv.groomName ? `& ${inv.groomName}` : ""}</p>
                      <Link href={`/${inv.slug}`} target="_blank" className="text-xs text-blue-500 hover:underline">
                        /{inv.slug}
                      </Link>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800 text-sm">{inv.user?.fullName || "Bilinmiyor"}</div>
                      <div className="text-xs text-slate-500">{inv.user?.email || "-"}</div>
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">
                        {inv.category?.name || "Kategori Yok"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-bold text-slate-700">
                        {inv.package?.name || "Paket Yok"}
                      </span>
                    </td>
                    <td className="p-4">
                      {inv.status === 'PENDING_PAYMENT' && <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse">Ödeme Bekliyor</span>}
                      {inv.status === 'ACTIVE' && <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">Yayında</span>}
                      {inv.status === 'DRAFT' && <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">Taslak</span>}
                      {inv.status === 'EXPIRED' && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Süresi Dolmuş</span>}
                    </td>
                    <td className="p-4 text-right">
                      {inv.status === 'PENDING_PAYMENT' || inv.status === 'DRAFT' ? (
                        <button onClick={() => handleApprove(inv.id)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors">
                          Ödemeyi Onayla
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">İşlem Yok</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}