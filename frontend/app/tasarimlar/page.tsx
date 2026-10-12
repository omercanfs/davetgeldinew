import Link from "next/link";
import { Metadata } from "next";
import ThemeCard from '@/components/ThemeCard';

export const metadata: Metadata = {
  title: 'Dijital Davetiye Tasarımları ve Şablonları | DavetGeldi',
  description: 'Düğün, nişan, doğum günü ve kurumsal etkinlikleriniz için yüzlerce şık, modern ve çevre dostu dijital davetiye tasarımını inceleyin.',
};

async function getThemes() {
  try {
    const res = await fetch('http://127.0.0.1:3000/admin/themes', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

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

export default async function TasarimlarPage() {
  const themes = await getThemes();
  const categories = await getCategories();
  const activeThemes = themes.filter((t: any) => t.isActive);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl font-black tracking-tighter text-slate-900">DavetGeldi<span className="text-indigo-600">.</span></span>
          </Link>
          <div className="hidden md:flex gap-8 text-sm font-bold text-slate-600">
            <Link href="/#ozellikler" className="hover:text-indigo-600 transition-colors">Özellikler</Link>
            <Link href="/#nasil-calisir" className="hover:text-indigo-600 transition-colors">Nasıl Çalışır?</Link>
            <Link href="/tasarimlar" className="hover:text-indigo-600 transition-colors">Tasarımlar</Link>
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

      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            Etkinliğinize Ruh Katacak <br/> <span className="text-indigo-600">Özel Tasarımlar</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Sıradan kağıt davetiyeleri unutun. Misafirlerinizi büyüleyecek, konseptinize en uygun dijital davetiye şablonunu seçin ve dakikalar içinde kişiselleştirin.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex flex-wrap justify-center gap-3">
          <Link href="/tasarimlar" className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md">
            Tüm Tasarımlar
          </Link>
          {categories.map((cat: any) => (
            <Link 
              key={cat.id} 
              href={`/kategori/${cat.slug}`} 
              className="bg-white text-slate-700 hover:text-indigo-600 border border-slate-200 hover:border-indigo-300 px-6 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all"
            >
              {cat.icon} {cat.name}
            </Link>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeThemes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-4xl mb-4 block">🎨</span>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Henüz Tasarım Eklenmemiş</h3>
              <p className="text-slate-500">Çok yakında harika tasarımlarla burada olacağız.</p>
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

      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/" className="text-2xl font-black tracking-tighter text-white">
            DavetGeldi<span className="text-indigo-500">.</span>
          </Link>
          <div className="text-sm font-medium flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Kullanım Koşulları</Link>
            <Link href="#" className="hover:text-white transition-colors">Gizlilik Politikası</Link>
            <Link href="#" className="hover:text-white transition-colors">İletişim</Link>
          </div>
          <p className="text-xs">© 2026 DavetGeldi. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}