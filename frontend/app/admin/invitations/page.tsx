"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AdminInvitations() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // URL Parametre Okuyucu
  const searchParams = useSearchParams();
  const filterUserId = searchParams.get("kullanici");
  
  // Filtreleme State'leri
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, PENDING_PAYMENT, ACTIVE, EXPIRED, DRAFT

  const fetchInvitations = async () => {
    try {
      const res = await fetch("http://localhost:3000/admin/invitations");
      const data = await res.json();
      setInvitations(data);
    } catch (error) {
      console.error("Davetiyeler çekilemedi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  // Admin İşlemleri: Onayla veya Kapat
  const handleAction = async (id: number, action: 'approve' | 'expire') => {
    const message = action === 'approve' 
      ? "Bu davetiyenin ödemesini onaylayıp yayına almak istediğinize emin misiniz?" 
      : "Bu davetiyeyi erişime kapatmak (süresini bitirmek) istediğinize emin misiniz?";
      
    if (!confirm(message)) return;
    
    try {
      const res = await fetch(`http://localhost:3000/admin/invitations/${id}/${action}`, { method: "PATCH" });
      if (res.ok) {
        fetchInvitations(); // Tabloyu yenile
      } else {
        alert("Bir hata oluştu.");
      }
    } catch (error) {
      alert("Sunucuya bağlanılamadı.");
    }
  };

  // AKILLI FİLTRELEME ALGORİTMASI
  const filteredInvitations = invitations.filter(inv => {
    // 0. URL Müşteri Filtresi (Müşteriler sayfasından tıklandığında çalışır)
    if (filterUserId && inv.userId !== Number(filterUserId)) {
      return false;
    }

    // 1. Arama Filtresi (Gelin, Damat veya Link adında arar)
    const searchString = `${inv.brideName || ''} ${inv.groomName || ''} ${inv.slug || ''}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());
    
    // 2. Durum Filtresi (Sekmeler)
    const matchesStatus = statusFilter === "ALL" || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (isLoading) return <div className="p-20 text-center font-bold text-slate-500">Davetiyeler Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col w-full">
      
      {/* SAĞ İÇERİK */}
      <div className="flex-1 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Davetiye Yönetimi</h1>
          <p className="text-slate-500 mt-1">Tüm davetiyeleri arayın, filtreleyin ve ödemeleri yönetin.</p>
        </header>

        {/* URL FİLTRESİ AKTİF UYARISI */}
        {filterUserId && (
          <div className="mb-6 bg-indigo-50 border border-indigo-200 text-indigo-700 px-6 py-4 rounded-2xl flex justify-between items-center shadow-sm">
            <p className="font-bold flex items-center gap-2">
              <span className="text-xl">👤</span> Müşteriye özel davetiyeler filtrelendi.
            </p>
            <Link href="/admin/invitations" className="bg-white px-4 py-2 rounded-xl text-xs font-black shadow-sm hover:bg-slate-50 transition-colors text-slate-700">
              Filtreyi Temizle ✕
            </Link>
          </div>
        )}

        {/* FİLTRELEME VE ARAMA ÇUBUĞU */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Durum Sekmeleri */}
          <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
            <button onClick={() => setStatusFilter("ALL")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${statusFilter === "ALL" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Tümü</button>
            <button onClick={() => setStatusFilter("PENDING_PAYMENT")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${statusFilter === "PENDING_PAYMENT" ? "bg-amber-100 text-amber-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Ödeme Bekleyenler</button>
            <button onClick={() => setStatusFilter("ACTIVE")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${statusFilter === "ACTIVE" ? "bg-emerald-100 text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Yayındakiler</button>
            <button onClick={() => setStatusFilter("EXPIRED")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${statusFilter === "EXPIRED" ? "bg-red-100 text-red-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Süresi Bitenler</button>
            <button onClick={() => setStatusFilter("DRAFT")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${statusFilter === "DRAFT" ? "bg-slate-200 text-slate-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Taslaklar</button>
          </div>

          {/* Akıllı Arama */}
          <div className="relative w-full md:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input 
              type="text" 
              placeholder="İsim veya link ara..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
            />
          </div>
        </div>

        {/* DAVETİYE TABLOSU */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 font-medium">Davetiye Bilgisi</th>
                <th className="p-6 font-medium">Müşteri</th>
                <th className="p-4 font-medium">Kategori / Paket</th>
                <th className="p-4 font-medium">Tarih</th>
                <th className="p-4 font-medium">Durum</th>
                <th className="p-4 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvitations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    <span className="text-4xl block mb-2">📭</span>
                    Bu kriterlere uygun davetiye bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredInvitations.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* İSİM VE LİNK */}
                    <td className="p-4">
                      <p className="font-bold text-slate-800 text-base">
                        {inv.brideName} {inv.groomName ? `& ${inv.groomName}` : ""}
                      </p>
                      <Link href={`/${inv.slug}`} target="_blank" className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-0.5">
                        🔗 davetgeldi.com/{inv.slug}
                      </Link>
                    </td>

                    {/* MÜŞTERİ BİLGİSİ */}
                    <td className="p-6">
                      <div className="font-bold text-slate-800 text-sm">{inv.user?.fullName || "Bilinmiyor"}</div>
                      <div className="text-xs text-slate-500">{inv.user?.email || "-"}</div>
                    </td>

                    {/* KATEGORİ VE PAKET */}
                    <td className="p-4">
                      <p className="text-sm font-bold text-slate-700">{inv.category?.name || "Kategori Yok"}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{inv.package?.name || "Paket Yok"}</p>
                    </td>

                    {/* OLUŞTURULMA TARİHİ */}
                    <td className="p-4 text-sm text-slate-600">
                      {new Date(inv.createdAt).toLocaleDateString('tr-TR')}
                    </td>

                    {/* DURUM ROZETİ */}
                    <td className="p-4">
                      {inv.status === 'PENDING_PAYMENT' && <span className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-200 flex items-center gap-2 w-max"><span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> Ödeme Bekliyor</span>}
                      {inv.status === 'ACTIVE' && <span className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-200 flex items-center gap-2 w-max"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Yayında</span>}
                      {inv.status === 'DRAFT' && <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 w-max inline-block">Taslak</span>}
                      {inv.status === 'EXPIRED' && <span className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-200 flex items-center gap-2 w-max"><span className="w-2 h-2 rounded-full bg-red-500"></span> Süresi Dolmuş</span>}
                    </td>

                    {/* İŞLEM BUTONLARI */}
                    <td className="p-4 text-right space-x-2">
                      {/* Ödeme Bekleyenleri Onayla */}
                      {(inv.status === 'PENDING_PAYMENT' || inv.status === 'DRAFT') && (
                        <button onClick={() => handleAction(inv.id, 'approve')} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors">
                          Ödemeyi Onayla
                        </button>
                      )}
                      
                      {/* Aktif Olanları Yayından Kaldır (Expire) */}
                      {inv.status === 'ACTIVE' && (
                        <button onClick={() => handleAction(inv.id, 'expire')} className="bg-white border border-slate-300 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors">
                          Yayından Kaldır
                        </button>
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