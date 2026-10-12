"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminThemes() {
  const [themes, setThemes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // YENİ TEMA FORMU
  const [isAdding, setIsAdding] = useState(false);
  const [newTheme, setNewTheme] = useState({
    name: "", icon: "🎨", coverImage: "", fontFamily: "font-serif", 
    primaryColor: "#3b4033", animation: "fade-in", categoryIds: [] as number[]
  });

  const fetchData = async () => {
    try {
      const [themeRes, catRes] = await Promise.all([
        fetch("http://localhost:3000/admin/themes"),
        fetch("http://localhost:3000/admin/categories")
      ]);
      setThemes(await themeRes.json());
      setCategories(await catRes.json());
    } catch (error) {
      console.error("Veriler çekilemedi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Kategori Seçim Mantığı (Çoklu Seçim)
  const toggleCategory = (catId: number) => {
    setNewTheme(prev => {
      const exists = prev.categoryIds.includes(catId);
      return {
        ...prev,
        categoryIds: exists ? prev.categoryIds.filter(id => id !== catId) : [...prev.categoryIds, catId]
      };
    });
  };

  const handleAddTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTheme.name) return alert("Tema adı zorunludur!");
    if (newTheme.categoryIds.length === 0) return alert("En az 1 kategori seçmelisiniz!");

    try {
      const res = await fetch("http://localhost:3000/admin/themes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTheme)
      });
      if (res.ok) {
        setIsAdding(false);
        setNewTheme({ name: "", icon: "🎨", coverImage: "", fontFamily: "font-serif", primaryColor: "#3b4033", animation: "fade-in", categoryIds: [] });
        fetchData();
        alert("✅ Tema başarıyla eklendi!");
      }
    } catch (error) {
      alert("Hata oluştu.");
    }
  };

  const toggleThemeStatus = async (theme: any) => {
    try {
      await fetch(`http://localhost:3000/admin/themes/${theme.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !theme.isActive })
      });
      fetchData();
    } catch (error) {
      alert("Hata oluştu.");
    }
  };

  if (isLoading) return <div className="p-20 text-center font-bold">Temalar Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex">
    
      {/* SAĞ İÇERİK */}
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Tema Yönetimi</h1>
            <p className="text-slate-500 mt-1">Sistemdeki tasarımları, fontları, animasyonları ve kategori bağlantılarını yönetin.</p>
          </div>
          <button onClick={() => setIsAdding(!isAdding)} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold">
            {isAdding ? "İptal Et" : "+ Yeni Tema Ekle"}
          </button>
        </header>

        {/* YENİ TEMA FORMU */}
        {isAdding && (
          <form onSubmit={handleAddTheme} className="bg-white p-6 rounded-2xl border shadow-sm mb-8 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Tasarım Ayarları</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="text-xs font-bold text-slate-500">Tema Adı</label>
                <input type="text" value={newTheme.name} onChange={(e) => setNewTheme({...newTheme, name: e.target.value})} placeholder="Örn: Klasik Siyah" className="w-full border p-3 rounded-xl mt-1 outline-none" required />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">İkon / Emoji</label>
                <input type="text" value={newTheme.icon} onChange={(e) => setNewTheme({...newTheme, icon: e.target.value})} className="w-full border p-3 rounded-xl mt-1 outline-none" required />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Ana Renk (HEX)</label>
                <div className="flex gap-2 mt-1">
                  <input type="color" value={newTheme.primaryColor} onChange={(e) => setNewTheme({...newTheme, primaryColor: e.target.value})} className="w-12 h-12 rounded cursor-pointer" />
                  <input type="text" value={newTheme.primaryColor} onChange={(e) => setNewTheme({...newTheme, primaryColor: e.target.value})} className="w-full border p-3 rounded-xl outline-none uppercase" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-xs font-bold text-slate-500">Yazı Tipi (Font)</label>
                <select value={newTheme.fontFamily} onChange={(e) => setNewTheme({...newTheme, fontFamily: e.target.value})} className="w-full border p-3 rounded-xl mt-1 outline-none bg-white">
                  <option value="font-serif">Klasik Tırnaklı (Serif)</option>
                  <option value="font-sans">Modern Düz (Sans)</option>
                  <option value="font-mono">Daktilo Tarzı (Mono)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Animasyon Tipi</label>
                <select value={newTheme.animation} onChange={(e) => setNewTheme({...newTheme, animation: e.target.value})} className="w-full border p-3 rounded-xl mt-1 outline-none bg-white">
                  <option value="fade-in">Yumuşak Geçiş (Fade In)</option>
                  <option value="slide-up">Aşağıdan Yukarı (Slide Up)</option>
                  <option value="zoom-in">Yakınlaşarak (Zoom In)</option>
                </select>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="text-xs font-bold text-slate-500 mb-2 block">Kapak Görseli URL (Giriş Arka Planı)</label>
              <input type="url" value={newTheme.coverImage} onChange={(e) => setNewTheme({...newTheme, coverImage: e.target.value})} placeholder="https://..." className="w-full border p-3 rounded-xl outline-none" />
            </div>

            <h2 className="text-lg font-bold mb-4 border-b pb-2 mt-8">Hangi Kategorilerde Gözükecek?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {categories.filter(c => c.isActive).map(cat => (
                <label key={cat.id} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${newTheme.categoryIds.includes(cat.id) ? 'bg-blue-50 border-blue-200' : 'bg-slate-50'}`}>
                  <input type="checkbox" checked={newTheme.categoryIds.includes(cat.id)} onChange={() => toggleCategory(cat.id)} className="w-5 h-5 accent-blue-600" />
                  <span className="text-sm font-bold text-slate-700">{cat.icon} {cat.name}</span>
                </label>
              ))}
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold mt-4 shadow-md">Temayı Kaydet</button>
          </form>
        )}

        {/* TEMA LİSTESİ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <div key={theme.id} className={`bg-white rounded-3xl overflow-hidden border-2 transition-all ${theme.isActive ? 'border-slate-200 shadow-sm' : 'border-dashed border-slate-300 opacity-70 grayscale'}`}>
              <div 
                className="h-32 w-full bg-cover bg-center border-b"
                style={{ 
                  backgroundColor: theme.primaryColor || '#ddd',
                  backgroundImage: theme.coverImage ? `url(${theme.coverImage})` : 'none'
                }}
              ></div>
              <div className="p-6 relative">
                <div className="absolute -top-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-md">
                  {theme.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800">{theme.name}</h3>
                <p className="text-xs text-slate-500 font-mono mt-1">ID: {theme.themeId}</p>
                
                <div className="mt-4 space-y-2 border-t pt-4">
                  <p className="text-sm"><span className="font-bold text-slate-500">Yazı Tipi:</span> {theme.fontFamily}</p>
                  <p className="text-sm"><span className="font-bold text-slate-500">Animasyon:</span> {theme.animation}</p>
                  
                  <div className="mt-2">
                    <span className="font-bold text-slate-500 text-xs block mb-1">Kullanıldığı Kategoriler:</span>
                    <div className="flex flex-wrap gap-1">
                      {theme.categories?.map((cat: any) => (
                         <span key={cat.id} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-full">{cat.icon} {cat.name}</span>
                      ))}
                      {(!theme.categories || theme.categories.length === 0) && <span className="text-xs text-red-500">Kategori Atanmamış!</span>}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => toggleThemeStatus(theme)}
                  className={`w-full mt-6 py-2 rounded-lg font-bold text-sm border transition-colors ${theme.isActive ? 'text-red-500 border-red-200 hover:bg-red-50' : 'text-emerald-600 border-emerald-200 bg-emerald-50'}`}
                >
                  {theme.isActive ? "Temayı Gizle" : "Temayı Yayına Al"}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}