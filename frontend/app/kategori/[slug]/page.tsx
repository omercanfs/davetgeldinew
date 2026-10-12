import Link from "next/link";
import { notFound } from "next/navigation";
import ThemeCard from '@/components/ThemeCard';

async function getCategories() {
  try {
    const res = await fetch('http://127.0.0.1:3000/store/categories', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

async function getThemesByCategory(categoryId: number) {
  try {
    const res = await fetch(`http://127.0.0.1:3000/store/themes/${categoryId}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

export default async function KategoriPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const categories = await getCategories();
  
  // Bulunduğumuz kategoriyi tespit et
  const activeCategory = categories.find((c: any) => c.slug === slug);
  if (!activeCategory) return notFound(); // Kategori yoksa 404 sayfasına at

  const themes = await getThemesByCategory(activeCategory.id);
  const activeThemes = themes.filter((t: any) => t.isActive);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      
      {/* 1. NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl font-black tracking-tighter text-slate-900">
              DavetGeldi<span className="text-indigo-600">.</span>
            </span>
          </Link>
          <div className="hidden md:flex gap-8 text-sm font-bold text-slate-600">
            <Link href="/#ozellikler" className="hover:text-indigo-600 transition-colors">Özellikler</Link>
            <Link href="/#nasil-calisir" className="hover:text-indigo-600 transition-colors">Nasıl Çalışır?</Link>
            <Link href="/tasarimlar" className="text-indigo-600 transition-colors">Tasarımlar</Link>
            <Link href="/#fiyatlar" className="hover:text-indigo-600 transition-colors">Paketler</Link>
            <Link href="/#sss" className="hover:text-indigo-600 transition-colors">S.S.S</Link>
          </div>
          <div>
            <Link href="/olustur" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5 inline-block">
              Ücretsiz Başla
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. ANA İÇERİK */}
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <span className="text-6xl mb-4 block drop-shadow-sm">{activeCategory.icon}</span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Özel <span className="text-indigo-600">{activeCategory.name}</span> Davetiyeleri
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            En mutlu gününüz için zarif ve modern tasarımlar. Hızlıca seçin, dakikalar içinde kişiselleştirip paylaşın.
          </p>
        </div>

        {/* 3. DİNAMİK KATEGORİ MENÜSÜ (Kilit Nokta Burası!) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 flex flex-wrap justify-center gap-3">
          <Link href="/tasarimlar" className="bg-white border border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 px-6 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all">
            ✨ Tüm Tasarımlar
          </Link>
          {categories.map((cat: any) => {
            const isActive = cat.slug === slug;
            return (
              <Link 
                key={cat.id} 
                href={`/kategori/${cat.slug}`} 
                className={`px-6 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all border flex items-center gap-2 ${
                  isActive 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                    : 'bg-white text-slate-700 hover:text-indigo-600 border-slate-200 hover:border-indigo-300'
                }`}
              >
                {cat.icon} {cat.name}
              </Link>
            );
          })}
        </div>

        {/* 4. TASARIM KARTLARI VİTRİNİ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeThemes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-4xl mb-4 block">🛠️</span>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Bu Kategoriye Ait Tasarım Yok</h3>
              <p className="text-slate-500">Bu kategori için harika şablonlar tasarlıyoruz, çok yakında burada olacaklar!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {activeThemes.map((theme: any) => (
                <ThemeCard key={theme.id} theme={theme} showActions={true} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 5. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/" className="text-2xl font-black tracking-tighter text-white">
            DavetGeldi<span className="text-indigo-500">.</span>
          </Link>
          <div className="hidden md:flex gap-8 text-sm font-bold text-slate-600">
            <Link href="/#ozellikler" className="hover:text-indigo-600 transition-colors">Özellikler</Link>
            <Link href="/#nasil-calisir" className="hover:text-indigo-600 transition-colors">Nasıl Çalışır?</Link>
            <Link href="/tasarimlar" className="hover:text-indigo-600 transition-colors">Tasarımlar</Link>
            <Link href="/#fiyatlar" className="hover:text-indigo-600 transition-colors">Paketler</Link>
            <Link href="/#sss" className="hover:text-indigo-600 transition-colors">S.S.S</Link>
          </div>
          <p className="text-xs">© 2026 DavetGeldi. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}