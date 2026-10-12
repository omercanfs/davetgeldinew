"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Yeni Kategori Formu State'leri
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("🎉");
  const [newDesc, setNewDesc] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:3000/admin/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Kategoriler çekilemedi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Yeni Kategori Ekleme İşlemi
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return alert("Kategori adı zorunludur!");

    try {
      const res = await fetch("http://localhost:3000/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, icon: newIcon, description: newDesc, isActive: true })
      });
      if (res.ok) {
        setNewName(""); setNewIcon("🎉"); setNewDesc(""); setIsAdding(false);
        fetchCategories(); // Listeyi yenile
      }
    } catch (error) {
      alert("Eklerken hata oluştu.");
    }
  };

  // Kategori Aktiflik (Görünürlük) Değiştirme
  const handleToggleActive = async (cat: any) => {
    try {
      const res = await fetch(`http://localhost:3000/admin/categories/${cat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...cat, isActive: !cat.isActive })
      });
      if (res.ok) {
        fetchCategories(); // Anında ekrana yansıt
      }
    } catch (error) {
      alert("Güncellenirken hata oluştu.");
    }
  };

  if (isLoading) return <div className="p-20 text-center font-bold text-slate-500">Kategoriler Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex">
     
      {/* SAĞ İÇERİK */}
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Kategori Yönetimi</h1>
            <p className="text-slate-500 mt-1">Sistemdeki etkinlik türlerini yönetin ve yeni trendler ekleyin.</p>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold shadow-sm transition-colors"
          >
            {isAdding ? "İptal Et" : "+ Yeni Kategori Ekle"}
          </button>
        </header>

        {/* YENİ KATEGORİ EKLEME FORMU */}
        {isAdding && (
          <form onSubmit={handleAddCategory} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-end animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex-1 w-full">
              <label className="text-xs font-bold text-slate-500 ml-1">Kategori Adı</label>
              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Örn: Cinsiyet Belirleme" className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 mt-1" required />
            </div>
            <div className="w-24">
              <label className="text-xs font-bold text-slate-500 ml-1">İkon (Emoji)</label>
              <input type="text" value={newIcon} onChange={(e) => setNewIcon(e.target.value)} className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 mt-1 text-center text-xl" required />
            </div>
            <div className="flex-[2] w-full">
              <label className="text-xs font-bold text-slate-500 ml-1">Kısa Açıklama (Vitrin için)</label>
              <input type="text" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Örn: Bebeğinizin cinsiyetini duyurun..." className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 mt-1" />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-sm transition-colors h-[50px]">
              Kaydet
            </button>
          </form>
        )}

        {/* KATEGORİ LİSTESİ (VİTRİN KARTLARI GİBİ) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className={`bg-white p-6 rounded-3xl border-2 transition-all flex flex-col relative ${cat.isActive ? "border-slate-100 shadow-sm hover:shadow-md" : "border-dashed border-slate-300 opacity-60 grayscale"}`}>
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-3xl mb-4 shadow-inner">
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800">{cat.name}</h3>
              <p className="text-sm text-slate-500 mt-2 mb-6 flex-1">{cat.description || "Açıklama eklenmemiş."}</p>
              
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <span className={`text-xs font-bold ${cat.isActive ? "text-emerald-600" : "text-slate-400"}`}>
                  {cat.isActive ? "Vitrinde Görünüyor" : "Gizlendi"}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={cat.isActive} onChange={() => handleToggleActive(cat)} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}