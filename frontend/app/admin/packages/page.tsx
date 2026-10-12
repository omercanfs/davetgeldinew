"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminPackages() {
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPackages = async () => {
    try {
      const res = await fetch("http://localhost:3000/admin/packages");
      const data = await res.json();
      setPackages(data);
    } catch (error) {
      console.error("Paketler çekilemedi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // SİSTEMİ İLK KEZ KURAN VEYA EKSİKLERİ TAMAMLAYAN FONKSİYON
  const handleInitializeDefaults = async () => {
    const defaults = [
      { addonKey: "standart", type: "BASE", name: "Standart Paket", description: "Dijital Davetiye, Harita, Geri Sayım", price: 499, hasMap: true },
      { addonKey: "premium", type: "BUNDLE", name: "Premium Paket", description: "Standart + LCV Katılım Takibi", price: 699, hasMap: true, hasRsvp: true },
      { addonKey: "vip", type: "BUNDLE", name: "VIP Elite Paket", description: "Her Şey Dahil (LCV, Galeri, Müzik)", price: 899, hasMap: true, hasRsvp: true, hasGallery: true, hasMusic: true, isPremium: true },
      { addonKey: "lcv", type: "ADDON", name: "LCV & Katılım Formu", description: "Misafirlerinizi kolayca yönetin.", price: 150, hasRsvp: true },
      { addonKey: "gallery", type: "ADDON", name: "Fotoğraf Galerisi", description: "En güzel anılarınızı ekleyin.", price: 200, hasGallery: true },
      { addonKey: "music", type: "ADDON", name: "Arka Plan Müziği", description: "Davetiyenize ses katın.", price: 50, hasMusic: true }
    ];

    let addedCount = 0;
    for (const pkg of defaults) {
      const exists = packages.find(p => p.addonKey === pkg.addonKey);
      if (!exists) {
        await fetch("http://localhost:3000/admin/packages", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(pkg)
        });
        addedCount++;
      }
    }
    
    if (addedCount > 0) {
      alert(`✅ Sistem için gerekli ${addedCount} sabit özellik başarıyla kuruldu!`);
      fetchPackages();
    } else {
      alert("Sistem zaten eksiksiz kurulu.");
    }
  };

  const handleUpdate = async (pkg: any) => {
    try {
      const res = await fetch(`http://localhost:3000/admin/packages/${pkg.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: pkg.name, price: parseFloat(pkg.price), description: pkg.description })
      });
      if (res.ok) alert(`✅ ${pkg.name} başarıyla güncellendi!`);
    } catch (error) {
      alert("Sunucu hatası.");
    }
  };

  const handleChange = (id: number, field: string, value: any) => {
    setPackages(packages.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  if (isLoading) return <div className="p-20 text-center font-bold text-slate-500">Ürünler Yükleniyor...</div>;

  const corePackages = ["standart", "premium", "vip"];
  const coreAddons = ["lcv", "gallery", "music"];

  const hasAllDefaults = corePackages.every(k => packages.find(p => p.addonKey === k)) && 
                         coreAddons.every(k => packages.find(p => p.addonKey === k));

  return (
    <div className="min-h-screen bg-slate-50 flex">
     

      {/* SAĞ İÇERİK */}
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Paket & Eklenti Fiyatlandırması</h1>
            <p className="text-slate-500 mt-1">Müşteriye sunulacak 3 Ana Paketin ve Eklentilerin isim/fiyat ayarlarını yapın.</p>
          </div>
          {!hasAllDefaults && (
            <button onClick={handleInitializeDefaults} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-md animate-bounce">
              ⚠️ Sistemi Kur / Eksikleri Tamamla
            </button>
          )}
        </header>

        <div className="grid md:grid-cols-2 gap-12">
          {/* ANA PAKETLER */}
          <div>
            <h2 className="text-xl font-black text-indigo-900 mb-6 flex items-center gap-2"><span>📦</span> Ana Paketler</h2>
            <div className="space-y-4">
              {packages.filter(p => corePackages.includes(p.addonKey)).map(pkg => (
                <div key={pkg.id} className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm relative overflow-hidden">
                  <div className="flex justify-between mb-4">
                    <span className="text-xs font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2 py-1 rounded">{pkg.addonKey}</span>
                  </div>
                  <input type="text" value={pkg.name} onChange={(e) => handleChange(pkg.id, 'name', e.target.value)} className="w-full text-xl font-bold border-b border-slate-200 mb-2 outline-none focus:border-indigo-500" />
                  <input type="text" value={pkg.description} onChange={(e) => handleChange(pkg.id, 'description', e.target.value)} className="w-full text-sm text-slate-500 border-b border-slate-200 mb-4 outline-none focus:border-indigo-500" />
                  <div className="flex gap-4 items-center">
                    <div className="flex-1 flex items-center bg-slate-50 rounded-lg px-3 border border-slate-200">
                      <span className="text-slate-400 font-bold">₺</span>
                      <input type="number" value={pkg.price} onChange={(e) => handleChange(pkg.id, 'price', e.target.value)} className="w-full bg-transparent p-2 outline-none font-black text-lg text-slate-800" />
                    </div>
                    <button onClick={() => handleUpdate(pkg)} className="bg-slate-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors">Güncelle</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EKLENTİLER */}
          <div>
            <h2 className="text-xl font-black text-amber-900 mb-6 flex items-center gap-2"><span>🧩</span> Eklentiler (Add-ons)</h2>
            <div className="space-y-4">
              {packages.filter(p => coreAddons.includes(p.addonKey)).map(pkg => (
                <div key={pkg.id} className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm">
                  <div className="flex justify-between mb-4">
                    <span className="text-xs font-black uppercase tracking-widest text-amber-500 bg-amber-50 px-2 py-1 rounded">{pkg.addonKey}</span>
                  </div>
                  <input type="text" value={pkg.name} onChange={(e) => handleChange(pkg.id, 'name', e.target.value)} className="w-full text-lg font-bold border-b border-slate-200 mb-2 outline-none focus:border-amber-500" />
                  <input type="text" value={pkg.description} onChange={(e) => handleChange(pkg.id, 'description', e.target.value)} className="w-full text-xs text-slate-500 border-b border-slate-200 mb-4 outline-none focus:border-amber-500" />
                  <div className="flex gap-4 items-center">
                    <div className="flex-1 flex items-center bg-slate-50 rounded-lg px-3 border border-slate-200">
                      <span className="text-slate-400 font-bold">₺</span>
                      <input type="number" value={pkg.price} onChange={(e) => handleChange(pkg.id, 'price', e.target.value)} className="w-full bg-transparent p-2 outline-none font-black text-lg text-slate-800" />
                    </div>
                    <button onClick={() => handleUpdate(pkg)} className="bg-slate-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors">Güncelle</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}