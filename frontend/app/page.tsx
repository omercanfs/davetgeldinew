"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeCard from '@/components/ThemeCard';
import CategoryCard from '@/components/CategoryCard';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [themes, setThemes] = useState<any[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem("davetgeldi_user");
    if (userData) setIsLoggedIn(true);

    fetch("http://127.0.0.1:3000/store/categories")
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data.slice(0, 6) : []))
      .catch(err => console.error("Kategoriler çekilemedi:", err));

    // BURASI GÜNCELLENDİ: store/themes yerine admin/themes kullanıyoruz
    fetch("http://127.0.0.1:3000/admin/themes")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Sadece aktif olan (satışa açık) temaları filtrele ve ilk 6'sını göster
          const activeThemes = data.filter((t: any) => t.isActive);
          setThemes(activeThemes.slice(0, 6));
        } else {
          setThemes([]);
        }
      })
      .catch(err => console.error("Temalar çekilemedi:", err));
  }, []);

  const faqs = [
    { q: "DavetGeldi nedir ve ne işe yarar?", a: "Etkinliklerinizi çok daha kolay yönetebilmenizi sağlayan yeni nesil bir dijital davetiye platformudur. Misafirlerinize şık tasarımlar sunarken, LCV (Katılım) durumlarını tek ekrandan takip edebilirsiniz." },
    { q: "Dijital davetiye fiyatları nedir?", a: "İhtiyacınıza göre şekillenen paketlerimiz mevcuttur. Müzik, harita ve gelişmiş LCV özelliklerine göre değişen fiyatlarımızı oluşturma ekranında şeffafça görebilirsiniz." },
    { q: "Dijital davetiye çevre dostu mu?", a: "Kesinlikle! Kağıt israfını tamamen ortadan kaldırarak hem doğayı koruyor hem de kargo/basım süreçlerindeki karbon ayak izinizi sıfıra indiriyoruz." },
    { q: "Davetlilerim uygulamayı indirmek zorunda mı?", a: "Hayır. Davetiyeniz size özel bir web bağlantısı (URL) olarak oluşur. Misafirleriniz linke tıklayarak doğrudan tarayıcı üzerinden davetiyenizi görüntüler ve LCV formunu doldurabilir." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* 1. NAVBAR (GELİŞMİŞ GLASSMORPHISM) */}
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
            <Link href="/tasarimlar" className="hover:text-indigo-600 transition-colors">Tasarımlar</Link>
            <Link href="/#fiyatlar" className="hover:text-indigo-600 transition-colors">Paketler</Link>
            <Link href="/#sss" className="hover:text-indigo-600 transition-colors">S.S.S</Link>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            {isLoggedIn ? (
              <Link href="/dashboard" className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5 inline-block">
                Panele Git
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden md:inline-block text-slate-600 hover:text-indigo-600 px-4 py-2 text-sm font-bold transition-colors">
                  Giriş Yap
                </Link>
                <Link href="/olustur" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5 inline-block">
                  Ücretsiz Başla
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs uppercase tracking-widest mb-6">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span></span>
              Yeni Nesil Davetiye Sistemi
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight mb-6">
              Etkinliklere Yeni Bir Bakış! <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Dijital Davetiye</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Düğün, nişan, doğum günü ve kurumsal etkinlikleriniz için çevre dostu, şık ve anında paylaşılabilir dijital davetiyeler oluşturun. Misafirlerinizi yorulmadan yönetin.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link href="/olustur" className="w-full sm:w-auto text-center bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-1">
                Davetiyeni Oluştur
              </Link>
              <Link href="/tasarimlar" className="w-full sm:w-auto text-center bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg shadow-sm transition-all flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> Örnekleri İncele
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[320px] lg:max-w-[380px] perspective-1000">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-violet-400 blur-3xl opacity-30 transform scale-90 translate-y-10"></div>
            <div className="relative bg-white border-[12px] border-slate-900 rounded-[3rem] shadow-2xl overflow-hidden aspect-[9/19] transform lg:rotate-y-[-10deg] transition-transform duration-700 hover:rotate-y-0">
               <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 rounded-b-xl w-32 mx-auto z-20"></div>
               <img src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-90" alt="Davetiye Örneği" />
               <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent p-6 flex flex-col justify-end">
                  <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-lg mb-4 text-center">
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">Düğün Davetiyesi</p>
                    <h3 className="text-2xl font-serif text-slate-800">Elif & Can</h3>
                    <p className="text-xs text-slate-500 mt-2">Sizi de bu mutlu günümüzde aramızda görmekten onur duyarız.</p>
                  </div>
                  <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm shadow-md">Katılım Durumunu Bildir</button>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NASIL ÇALIŞIR? */}
      <section id="nasil-calisir" className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">Hızlı ve Kolay</span>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mt-6 mb-16 tracking-tight">3 Adımda Nasıl Çalışır?</h2>
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent z-0"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-indigo-100 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-sm transform rotate-3">🎨</div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Tasarımı Seç</h3>
              <p className="text-slate-600 text-center leading-relaxed px-4">Yüzlerce şık tema arasından konseptinize en uygun tasarımı tek tıkla seçin.</p>
              <span className="mt-6 w-8 h-8 rounded-full border-2 border-slate-200 text-slate-400 font-bold flex items-center justify-center text-xs">01</span>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-violet-100 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-sm transform -rotate-3">✍️</div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Bilgileri Gir</h3>
              <p className="text-slate-600 text-center leading-relaxed px-4">Tarih, mekan, hikayeniz ve fotoğraflarınızla davetiyenizi kişiselleştirin.</p>
              <span className="mt-6 w-8 h-8 rounded-full border-2 border-slate-200 text-slate-400 font-bold flex items-center justify-center text-xs">02</span>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-emerald-100 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-sm transform rotate-3">🚀</div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Yayınla ve Paylaş</h3>
              <p className="text-slate-600 text-center leading-relaxed px-4">Oluşan özel linkinizi WhatsApp, SMS veya sosyal medyadan saniyeler içinde paylaşın.</p>
              <span className="mt-6 w-8 h-8 rounded-full border-2 border-slate-200 text-slate-400 font-bold flex items-center justify-center text-xs">03</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PREMIUM HİZMETLER */}
      <section id="ozellikler" className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
             <span className="bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">Ayrıcalıklar</span>
             <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mt-6 tracking-tight">Etkinliğiniz İçin <span className="text-emerald-600">Premium</span> Hizmetler</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div>
              <div className="inline-block bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 mb-6 flex items-center gap-2 shadow-sm w-max">
                <span>📋</span> LCV ve Misafir Yönetimi
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 leading-tight">Gelecekleri Tahmin Etmeyin, <br/>Kesin Olarak Bilin.</h3>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                Kişiye özel veya herkese açık davetiye linklerinizle misafirlerinizin katılım durumunu anlık olarak takip edin. Kaç kişi geleceklerini sorarak sürprizlerin önüne geçin.
              </p>
            </div>
            <div className="bg-indigo-100 rounded-[3rem] p-8 lg:p-12 relative transform lg:rotate-2">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                  <h4 className="font-bold text-slate-800">LCV Durumu</h4>
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-500 font-mono">Canlı Veri</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                    <div><p className="text-sm font-bold text-emerald-900">Ayşe Yılmaz</p><p className="text-xs text-emerald-700">+2 Kişi ile Katılacak</p></div>
                    <span className="text-xl">✅</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VİTRİN: KATEGORİLER VE TASARIMLAR (HİBRİT MODEL) */}
      <section id="kategoriler" className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Yüzlerce <span className="text-indigo-600">Dijital Davetiye</span> Seçeneği
          </h2>
          <p className="text-slate-600 mb-12 max-w-2xl mx-auto">En özel gününüz için özenle hazırlanmış tasarım konseptlerini keşfedin veya etkinliğinize göre filtreleyin.</p>
          
          {/* HIZLI KATEGORİ YÖNLENDİRMESİ (PILLS) */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            <Link href="/tasarimlar" className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-md">
              <span className="text-xl">✨</span> Tüm Tasarımlar
            </Link>
            {categories.map((cat) => (
              <Link 
                key={cat.id} 
                href={`/kategori/${cat.slug}`} 
                className="bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-colors shadow-sm"
              >
                <span className="text-xl">{cat.icon}</span> {cat.name}
              </Link>
            ))}
          </div>

          {/* GÖRSEL ŞOV: EN POPÜLER TASARIMLAR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {themes.length > 0 ? (
              themes.map((theme) => (
                <ThemeCard key={theme.id} theme={theme} showActions={true} />
              ))
            ) : (
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center text-slate-500 py-12">Tasarımlar yükleniyor...</div>
            )}
          </div>
          
          <div className="mt-12">
            <Link href="/tasarimlar" className="inline-block bg-white border-2 border-slate-200 text-slate-800 hover:border-slate-900 hover:bg-slate-900 hover:text-white px-10 py-4 rounded-xl font-black transition-all shadow-sm">
              Daha Fazla Tasarım Keşfet →
            </Link>
          </div>
        </div>
      </section>

      {/* 6. S.S.S */}
      <section id="sss" className="py-24 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="bg-slate-200 text-slate-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">Soru & Cevap</span>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mt-6 tracking-tight"><span className="text-indigo-600">SSS</span> - Sıkça Sorulan Sorular</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all">
                <button 
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)} 
                  className="w-full text-left px-6 py-5 flex justify-between items-center font-bold text-lg text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  {faq.q}
                  <span className={`text-2xl transition-transform ${activeFaq === idx ? 'rotate-45 text-indigo-600' : 'text-slate-400'}`}>+</span>
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ${activeFaq === idx ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-slate-600 leading-relaxed border-t border-slate-100 pt-4">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FİYATLANDIRMA VE PAKETLER BÖLÜMÜ */}
      <section id="fiyatlar" className="py-24 bg-slate-50 relative overflow-hidden border-t border-slate-200">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-amber-100 rounded-full blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-indigo-600 font-bold tracking-widest uppercase text-sm mb-3 block">Şeffaf Fiyatlandırma</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter">Bütçenize ve İhtiyacınıza Uygun Paketler</h2>
            <p className="text-lg text-slate-600">Sürpriz matbaa maliyetleri yok, kargo bekleme derdi yok. Etkinliğinize en uygun paketi seçin ve anında yayınlayın.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            
            {/* 1. STANDART PAKET */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-xl transition-all">
              <h3 className="text-2xl font-black text-slate-800 mb-2">Standart</h3>
              <p className="text-sm text-slate-500 mb-6 h-10">Sadece şık bir davetiye ve konum paylaşımı isteyenler için.</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-slate-900">499 ₺</span>
                <span className="text-slate-500 font-medium text-sm"> / tek ödeme</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm font-medium text-slate-600">
                <li className="flex items-center gap-3"><span className="text-emerald-500">✓</span> Sınırsız Misafir Görüntülemesi</li>
                <li className="flex items-center gap-3"><span className="text-emerald-500">✓</span> Google Haritalar Entegrasyonu</li>
                <li className="flex items-center gap-3"><span className="text-emerald-500">✓</span> Geri Sayım Aracı</li>
                <li className="flex items-center gap-3"><span className="text-emerald-500">✓</span> WhatsApp'tan Tek Tıkla Paylaşım</li>
                <li className="flex items-center gap-3 opacity-40"><span className="text-slate-300">✕</span> LCV (Katılım Formu)</li>
                <li className="flex items-center gap-3 opacity-40"><span className="text-slate-300">✕</span> Fotoğraf Galerisi</li>
              </ul>
              <Link href="/olustur?paket=standart" className="block text-center w-full py-4 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                Standart ile Başla
              </Link>
            </div>

            {/* 2. PREMIUM PAKET (YEM ETKİSİ - VURGULU) */}
            <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-800 transform md:-translate-y-4 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg whitespace-nowrap">
                En Çok Tercih Edilen
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Premium</h3>
              <p className="text-sm text-slate-400 mb-6 h-10">Davetli sayısını net bilmek ve stresi sıfırlamak isteyenler için.</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-white">699 ₺</span>
                <span className="text-slate-400 font-medium text-sm"> / tek ödeme</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm font-medium text-slate-300">
                <li className="flex items-center gap-3"><span className="text-amber-400">✓</span> Standart Paketteki Her Şey</li>
                <li className="flex items-center gap-3 font-bold text-white"><span className="text-amber-400">✓</span> LCV (Katılım) Formu Altyapısı</li>
                <li className="flex items-center gap-3"><span className="text-amber-400">✓</span> Misafir Yönetim Paneli (Dashboard)</li>
                <li className="flex items-center gap-3"><span className="text-amber-400">✓</span> Özel Menü / Çocuk Sayısı Takibi</li>
                <li className="flex items-center gap-3 opacity-40"><span className="text-slate-500">✕</span> Fotoğraf Galerisi</li>
                <li className="flex items-center gap-3 opacity-40"><span className="text-slate-500">✕</span> Arka Plan Müziği</li>
              </ul>
              <Link href="/olustur?paket=premium" className="block text-center w-full py-4 rounded-xl font-black bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/20">
                Premium ile Başla
              </Link>
            </div>

            {/* 3. VIP ELITE PAKET */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-xl transition-all">
              <h3 className="text-2xl font-black text-slate-800 mb-2">VIP Elite</h3>
              <p className="text-sm text-slate-500 mb-6 h-10">Misafirlerine unutulmaz ve eksiksiz bir deneyim sunmak isteyenler için.</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-slate-900">899 ₺</span>
                <span className="text-slate-500 font-medium text-sm"> / tek ödeme</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm font-medium text-slate-600">
                <li className="flex items-center gap-3"><span className="text-indigo-500">✓</span> Premium Paketteki Her Şey</li>
                <li className="flex items-center gap-3 font-bold text-slate-800"><span className="text-indigo-500">✓</span> Sınırsız Fotoğraf Galerisi</li>
                <li className="flex items-center gap-3 font-bold text-slate-800"><span className="text-indigo-500">✓</span> Arka Plan Müziği Ekleme</li>
                <li className="flex items-center gap-3"><span className="text-indigo-500">✓</span> İsim ve Mesajlı Karşılama Ekranı</li>
                <li className="flex items-center gap-3"><span className="text-indigo-500">✓</span> Sınırsız Düzenleme Hakkı</li>
              </ul>
              <Link href="/olustur?paket=vip" className="block text-center w-full py-4 rounded-xl font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors">
                VIP Elite ile Başla
              </Link>
            </div>

          </div>

          <p className="text-center text-slate-500 text-sm mt-12">
            İhtiyacınıza göre <span className="font-bold text-slate-700">Müzik, LCV ve Galeri</span> gibi özellikleri Standart pakete eklenti olarak da satın alabilirsiniz.
          </p>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-black tracking-tighter text-white">
            DavetGeldi<span className="text-indigo-500">.</span>
          </div>
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