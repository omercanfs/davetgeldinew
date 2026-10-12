"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

export default function PublicInvitationPage() {
  const params = useParams();
  const slug = params.slug;

  const [invitation, setInvitation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!slug) return;

    fetch(`http://127.0.0.1:3000/invitations/slug/${slug}`)
      .then(res => res.json())
      .then(data => {
        setInvitation(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Davetiye bulunamadı", err);
        setIsLoading(false);
      });
  }, [slug]);

  if (isLoading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center font-bold text-white tracking-widest uppercase">Davetiye Yükleniyor...</div>;
  if (!invitation) return <div className="min-h-screen bg-slate-900 flex items-center justify-center font-bold text-red-400 tracking-widest uppercase">Bu Davetiye Bulunamadı veya Yayından Kaldırılmış.</div>;

  // PREMIUM ÖZELLİK KONTROLLERİ
  const addons = invitation.addons || [];
  const packageName = (invitation.package?.name || "").toLowerCase();
  const isVip = invitation.isPremium || packageName.includes("vip") || packageName.includes("elite");
  
  const hasLcv = isVip || addons.includes("lcv");
  const hasGallery = isVip || addons.includes("gallery");
  const hasMusic = (isVip || addons.includes("music")) && invitation.musicUrl;

  // ZARİF MÜZİK OYNATICI (Kullanıcı etkileşimi ile başlar)
  const handleOpenInvitation = () => {
    setIsEnvelopeOpened(true);
    if (hasMusic && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Otomatik oynatma engellendi.", e));
    }
  };

  // YOUTUBE LİNKİNİ EMBED LİNKİNE ÇEVİRİCİ
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  const videoId = hasMusic ? getEmbedUrl(invitation.musicUrl) : null;

  // TEMA BİLGİLERİNİ ÇEK VE UYGULA
  const theme = invitation.theme || {};
  const fontFamily = theme.fontFamily || 'font-sans'; // Adminden gelen font (örn: font-serif)
  const animationClass = theme.animation || 'fade-in'; // Adminden gelen animasyon
  const primaryColor = theme.primaryColor || '#1e293b'; // Adminden gelen renk
  const coverImage = theme.coverImageUrl || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070";

  return (
    <div className={`min-h-screen relative ${fontFamily} text-slate-800 bg-slate-50`} style={{ '--theme-primary': primaryColor } as React.CSSProperties}>
      
      {/* 1. AKILLI ÖNİZLEME UYARI BANDI */}
      {invitation.status === 'PENDING_PAYMENT' && (
        <div className="fixed top-0 left-0 w-full bg-amber-500 text-amber-950 text-center py-3 px-4 shadow-xl z-50">
          <h3 className="font-black tracking-widest text-xs md:text-sm uppercase">⚠️ Bu Bir Önizleme Sürümüdür</h3>
          <p className="text-[10px] md:text-xs font-medium opacity-90 mt-1 max-w-2xl mx-auto">
            {hasLcv 
              ? "Ödeme onaylandıktan sonra bu uyarı kalkacak ve misafirleriniz için LCV (Katılım) formu aktif olacaktır."
              : "Ödeme onaylandıktan sonra bu uyarı kalkacak ve davetiyeniz yayına alınacaktır."}
          </p>
        </div>
      )}

      {/* 2. KARŞILAMA EKRANI (Müzik Tetikleyici ve Tema Kapağı) */}
      {!isEnvelopeOpened ? (
        <div className="fixed inset-0 z-40 bg-slate-900 flex flex-col items-center justify-center p-4">
          {/* Buraya seçilen temanın arkaplan resmi gelebilir */}
          <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070')] bg-cover bg-center"></div>
          
          <div className="relative z-10 text-center text-white space-y-6">
            <p className="text-xs tracking-[0.3em] uppercase opacity-70 mb-4">{invitation.theme?.name || "Özel Tasarım"}</p>
            <h1 className="text-5xl md:text-7xl font-serif mb-2">{invitation.brideName}</h1>
            {invitation.groomName && <h1 className="text-5xl md:text-7xl font-serif">& {invitation.groomName}</h1>}
            <p className="text-lg md:text-xl font-light tracking-widest mt-6 opacity-90">
              {new Date(invitation.eventDate).toLocaleDateString('tr-TR')}
            </p>
            
            <button 
              onClick={handleOpenInvitation}
              className="mt-12 bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-sm text-white px-10 py-4 rounded-full tracking-[0.2em] uppercase text-sm transition-all duration-500 hover:scale-105"
            >
              Davetİ AÇ ↓
            </button>
          </div>
        </div>
      ) : (
        
        /* 3. ASIL DAVETİYE İÇERİĞİ (TEMA BÖLÜMÜ) */
        <div className={`relative ${invitation.status === 'PENDING_PAYMENT' ? 'pt-16' : ''}`}>
          
          {/* GİZLİ MÜZİK OYNATICI VEYA YOUTUBE İFRAME */}
          {hasMusic && videoId && (
            <div className="hidden">
              <iframe 
                width="1" height="1" 
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}`} 
                allow="autoplay" 
              />
            </div>
          )}

          {/* TASARIM/TEMA İÇERİĞİ */}
          <div className={`max-w-3xl mx-auto bg-white min-h-screen shadow-2xl animate-${animationClass}`}>
            
            {/* Kapak Görseli */}
            <div className="h-[60vh] bg-slate-200 relative">
              <img src={coverImage} alt="Kapak" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute bottom-10 left-0 w-full text-center text-white p-4">
                <h2 className="text-5xl font-bold mb-4" style={{ fontFamily: 'var(--theme-font, inherit)' }}>{invitation.brideName} & {invitation.groomName}</h2>
                <p className="tracking-widest uppercase text-sm">Evleniyoruz</p>
              </div>
            </div>

            <div className="p-10 md:p-20 space-y-24 text-center">
              
              {/* AİLE BİLGİLERİ */}
              {(invitation.brideParents || invitation.groomParents) && (
                <div>
                  <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-slate-400 mb-6" style={{ color: 'var(--theme-primary)' }}>Aileler</h3>
                  <div className="flex justify-center gap-12 text-lg">
                    {invitation.brideParents && <p>{invitation.brideName} Ailesi<br/><span className="text-sm text-slate-500">{invitation.brideParents}</span></p>}
                    {invitation.groomParents && <p>{invitation.groomName} Ailesi<br/><span className="text-sm text-slate-500">{invitation.groomParents}</span></p>}
                  </div>
                </div>
              )}

              {/* TARİH VE MEKAN (EventStops) */}
              <div>
                <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-slate-400 mb-6" style={{ color: 'var(--theme-primary)' }}>Tarih & Mekan</h3>
                <p className="text-2xl font-bold text-slate-800">{new Date(invitation.eventDate).toLocaleDateString('tr-TR')}</p>
                <p className="text-slate-500 mt-2 mb-8">Saat: {new Date(invitation.eventDate).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}</p>
                
                {invitation.eventStops && invitation.eventStops.length > 0 && (
                  <div className="space-y-6">
                    {invitation.eventStops.map((stop: any, idx: number) => (
                      <div key={idx} className="bg-slate-50 p-6 rounded-2xl">
                        <h4 className="font-bold text-lg mb-2">{stop.title}</h4>
                        <p className="text-slate-600 mb-2">{stop.time} - {stop.location}</p>
                        {stop.address && <p className="text-sm text-slate-500">{stop.address}</p>}
                        {stop.mapsUrl && <a href={stop.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-xs font-bold uppercase tracking-widest border border-slate-300 px-4 py-2 rounded-full hover:bg-slate-200 transition-colors">Haritada Gör</a>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* KİLOMETRE TAŞLARI (Milestones) */}
              {invitation.milestones && invitation.milestones.length > 0 && (
                 <div>
                  <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-slate-400 mb-8" style={{ color: 'var(--theme-primary)' }}>Hikayemiz</h3>
                  <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-200">
                    {invitation.milestones.map((milestone: any, idx: number) => (
                      <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 group-[.is-active]:bg-indigo-600 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 shadow-sm bg-white">
                          <div className="font-bold text-slate-800 mb-1">{milestone.title}</div>
                          <div className="text-sm text-slate-500">{milestone.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                 </div>
              )}

              {/* GALERİ MODÜLÜ (Eğer aktifse) */}
              {hasGallery && (
                <div>
                  <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-slate-400 mb-8">Anılarımız</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Örnek Galeri Alanı */}
                    <div className="bg-slate-100 aspect-square rounded-xl flex items-center justify-center text-slate-300">Foto 1</div>
                    <div className="bg-slate-100 aspect-square rounded-xl flex items-center justify-center text-slate-300">Foto 2</div>
                  </div>
                </div>
              )}

              {/* LCV FORMU MODÜLÜ (Eğer aktifse) */}
              {hasLcv && (
                <div className="border-t border-slate-100 pt-20">
                  <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-slate-400 mb-8">LCV (Katılım Bildirimi)</h3>
                  
                  {invitation.status === 'PENDING_PAYMENT' ? (
                    // ÖDEME BEKLİYORSA KİLİTLİ GÖRÜNÜM
                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-10 opacity-70 relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex flex-col items-center justify-center z-10">
                        <span className="text-4xl mb-3">🔒</span>
                        <p className="font-bold text-slate-800 text-sm">Form Önizlemededir</p>
                        <p className="text-xs text-slate-500 mt-1">Ödeme sonrası misafirleriniz buradan kayıt bırakabilir.</p>
                      </div>
                      <div className="space-y-4 filter blur-[1px]">
                        <input type="text" placeholder="Adınız Soyadınız" disabled className="w-full bg-white border border-slate-200 p-4 rounded-xl" />
                        <button disabled className="w-full bg-slate-800 text-white p-4 rounded-xl font-bold uppercase tracking-widest text-xs">Katılıyorum</button>
                      </div>
                    </div>
                  ) : (
                    // YAYINDAYSA GERÇEK FORM
                    <form className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 space-y-6" onSubmit={(e) => { e.preventDefault(); alert("LCV Başarıyla Gönderildi!"); }}>
                      <p className="text-sm text-slate-500 mb-6">Lütfen katılım durumunuzu bildiriniz.</p>
                      <input type="text" required placeholder="Adınız Soyadınız" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:border-slate-800 transition-colors" />
                      <select className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:border-slate-800 transition-colors">
                        <option value="">Kaç Kişi Katılacaksınız?</option>
                        <option value="1">1 Kişi</option>
                        <option value="2">2 Kişi</option>
                        <option value="3+">3 ve Üzeri</option>
                      </select>
                      <button type="submit" className="w-full bg-slate-900 hover:bg-black text-white p-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors">
                        Katılımı Onayla
                      </button>
                    </form>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}