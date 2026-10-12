"use client";

import { useState, useEffect } from "react";
import RsvpModal from "./RsvpModal";

// ==========================================
// ORTAK PREMİUM TEMA MOTORU (DİNAMİK VERİ DESTEĞİ İLE)
// ==========================================
function PremiumThemeCore({ invitation, config, dbTheme }: { invitation: any, config: any, dbTheme: any }) {
  const [isOpened, setIsOpened] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const isDemoMode = invitation.status !== "ACTIVE";

  // ADMİN PANELİNDEN GELEN DİNAMİK AYARLAR
  // Eğer admin panelinde özel bir renk/font girildiyse onları kullanır, girilmediyse config'deki yedeği kullanır.
  const dynamicColor = dbTheme?.primaryColor || undefined;
  const dynamicFont = dbTheme?.fontFamily || '';
  const dynamicAnimation = dbTheme?.animation || 'fade-in';
  const customCoverImage = dbTheme?.coverImage || null;

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(invitation.eventDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };
    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();
    return () => clearInterval(timer);
  }, [invitation.eventDate]);

  useEffect(() => {
    document.body.style.overflow = isOpened ? 'auto' : 'hidden';
    return () => { document.body.style.overflow = 'auto'; }
  }, [isOpened]);

  const copyToClipboard = () => {
    if (invitation.bankIban) {
      navigator.clipboard.writeText(invitation.bankIban);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleAudio = () => {
    const audioEl = document.getElementById('bg-audio') as HTMLAudioElement;
    if (audioEl) {
      if (isPlaying) { audioEl.pause(); setIsPlaying(false); } 
      else { audioEl.play(); setIsPlaying(true); }
    }
  };

  const milestones = invitation.milestones || [];
  const eventStops = invitation.eventStops || [];
  const primaryStop = eventStops.length > 0 ? eventStops[0] : null;

  // Animasyon Class'ını Belirleme
  const animationClass = 
    dynamicAnimation === 'slide-up' ? (isOpened ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0') :
    dynamicAnimation === 'zoom-in' ? (isOpened ? 'scale-100 opacity-100' : 'scale-95 opacity-0') :
    (isOpened ? 'opacity-100' : 'opacity-0');

  return (
    // Dinamik Fontu en dış katmana uyguluyoruz
    <div className={`min-h-screen transition-colors duration-1000 ${dynamicFont || 'font-serif'} ${config.textClass}`}>
      
      {/* 0. DEMO / ÖNİZLEME ŞERİDİ */}
      {isDemoMode && (
        <div className="fixed top-0 left-0 w-full z-[200] bg-amber-500/90 backdrop-blur-md text-amber-950 py-3 px-4 shadow-xl text-center">
          <p className="text-xs md:text-sm font-bold tracking-widest uppercase">
            ⚠️ Bu bir önizleme sürümüdür
          </p>
          <p className="text-[10px] md:text-xs opacity-80 mt-0.5">
            Ödeme onaylandıktan sonra bu uyarı kalkacak ve LCV (Katılım) formu aktif olacaktır.
          </p>
        </div>
      )}

      {/* 1. SABİT ARKA PLAN */}
      <div 
        className={`fixed inset-0 z-0 bg-cover bg-center ${customCoverImage ? '' : config.globalBgImage}`}
        style={customCoverImage ? { backgroundImage: `url(${customCoverImage})` } : {}}
      ></div>
      
      {/* 2. ARKA PLAN FİLTRESİ */}
      <div className={`fixed inset-0 z-10 ${config.globalOverlay}`}></div>

      {/* 3. ANA İÇERİK KATMANI */}
      <div className={`relative z-20 pb-24 ${isDemoMode ? "pt-12" : ""}`}>
        
        {/* ÇOKLU DİL */}
        <div className={`absolute top-8 right-8 z-[90] hidden md:flex px-4 py-2 gap-4 text-xs font-bold tracking-widest backdrop-blur-md rounded-full ${config.cardAltStyle}`}>
          <span className="cursor-pointer" style={{ color: dynamicColor }}>TR</span>
          <span className="opacity-50 hover:opacity-100 cursor-pointer transition-opacity">DE</span>
          <span className="opacity-50 hover:opacity-100 cursor-pointer transition-opacity">EN</span>
        </div>

        {/* MÜZİK */}
        {invitation.musicUrl && (
          <>
            <audio id="bg-audio" loop className="hidden"><source src={invitation.musicUrl} type="audio/mpeg" /></audio>
            <button onClick={toggleAudio} className={`fixed bottom-8 right-8 z-[90] px-6 py-3 text-xs font-bold tracking-widest flex items-center gap-2 shadow-2xl backdrop-blur-md transition-all hover:scale-105 rounded-full ${config.cardStyle}`} style={{ color: dynamicColor }}>
              {isPlaying ? "⏸ MÜZİĞİ DURDUR" : "🎵 MÜZİĞİ ÇAL"}
            </button>
          </>
        )}

        {/* KAPAK (ZARF) */}
        <div 
          className={`fixed inset-0 z-[100] transition-transform duration-[1500ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${isOpened ? '-translate-y-full' : 'translate-y-0'} ${customCoverImage ? 'bg-slate-900' : config.coverBgClass} flex flex-col items-center justify-end pb-32`}
          style={dynamicColor ? { backgroundColor: dynamicColor } : {}}
        >
           <div 
             className={`absolute inset-0 opacity-50 bg-cover bg-center mix-blend-overlay ${customCoverImage ? '' : config.coverPatternClass}`}
             style={customCoverImage ? { backgroundImage: `url(${customCoverImage})` } : {}}
           ></div>
           
           {/* Admin panelinden gelen Tema Adı */}
           <p className={`tracking-[0.4em] text-xs uppercase mb-8 z-10 ${config.accentTextInvertClass} opacity-80`}>
             {dbTheme?.name || config.themeName} Tasarımı
           </p>
           <button onClick={() => { setIsOpened(true); toggleAudio(); }} className="bg-white/90 backdrop-blur-md text-slate-900 px-12 py-5 rounded-full tracking-[0.3em] text-sm font-bold hover:bg-white hover:scale-105 transition-all shadow-2xl z-10" style={{ color: dynamicColor }}>
             DAVETİ AÇ ↓
           </button>
        </div>

        {/* İÇERİK ANİMASYONU (Admin panelindeki animasyon türüne göre çalışır) */}
        <div className={`transition-all duration-1000 delay-700 ${animationClass}`}>
          
          {/* 1. HERO EKRANI */}
          <section className={`min-h-screen relative flex flex-col items-center justify-center p-8 text-center overflow-hidden ${config.heroStyle}`}>
             <div 
               className={`absolute inset-0 z-0 bg-cover bg-center ${customCoverImage ? '' : config.heroBgImage} ${config.heroOverlay}`}
               style={customCoverImage ? { backgroundImage: `url(${customCoverImage})` } : {}}
             ></div>
             <div className={`relative z-10 flex flex-col items-center w-full max-w-4xl mx-auto p-12 ${config.heroInnerBox || ""}`}>
               <p className={`tracking-[0.4em] text-xs font-bold mb-12 uppercase ${config.heroAccentText || config.accentTextClass}`} style={{ color: dynamicColor }}>Sizin İçin Aralandı</p>
               <h1 className={`text-7xl md:text-9xl mb-4 leading-none tracking-tight ${config.heroFont || 'font-light'}`}>{invitation.brideName}</h1>
               {invitation.groomName && (
                 <>
                   <span className={`text-5xl md:text-7xl italic font-serif my-4 ${config.heroAccentText || config.accentTextClass}`} style={{ color: dynamicColor }}>&</span>
                   <h1 className={`text-7xl md:text-9xl mt-4 mb-12 leading-none tracking-tight ${config.heroFont || 'font-light'}`}>{invitation.groomName}</h1>
                 </>
               )}
               
               <div className={`flex flex-col md:flex-row gap-4 md:gap-8 text-sm font-bold tracking-[0.2em] uppercase items-center mb-8 mt-8 ${config.heroTextClass || config.textClass}`}>
                 <span>{new Date(invitation.eventDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                 <span className="hidden md:block opacity-30">|</span>
                 <span>{invitation.locationName}</span>
               </div>
               {invitation.welcomeMessage && (
                 <p className={`max-w-md mx-auto leading-relaxed mb-8 text-lg opacity-90 ${config.heroTextClass || config.textClass}`}>{invitation.welcomeMessage}</p>
               )}
             </div>
          </section>

          {/* 2. GERİ SAYIM */}
          <section className={`py-24 px-8 text-center border-t border-b ${config.sectionBorder} ${config.glassOverlayClass}`}>
            <p className={`text-xs tracking-[0.3em] mb-12 uppercase ${config.accentTextClass}`} style={{ color: dynamicColor }}>Buluşmaya Kalan Süre</p>
            <div className="flex justify-center gap-8 md:gap-16">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center">
                  <span className={`text-5xl md:text-7xl font-light mb-2 ${config.heroFont || ''}`}>{value.toString().padStart(2, '0')}</span>
                  <span className={`text-[10px] tracking-widest uppercase ${config.accentTextClass}`} style={{ color: dynamicColor }}>
                    {unit === 'days' ? 'GÜN' : unit === 'hours' ? 'SAAT' : unit === 'minutes' ? 'DAKİKA' : 'SANİYE'}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 3. HİKAYE VE DÖNÜM NOKTALARI */}
          {(invitation.storyTitle || milestones.length > 0) && (
            <section className="py-32 px-8 bg-transparent">
              <div className="max-w-5xl mx-auto">
                {(invitation.storyTitle || invitation.storyContent) && (
                  <div className={`mb-24 flex flex-col md:flex-row gap-12 items-start p-12 rounded-3xl ${config.glassOverlayClass}`}>
                     <div className="md:w-1/2">
                       <p className={`text-xs tracking-[0.3em] mb-4 uppercase ${config.accentTextClass}`} style={{ color: dynamicColor }}>Hikayemiz</p>
                       <h2 className={`text-5xl md:text-6xl font-light tracking-tight mb-8 ${config.heroFont || ''}`}>{invitation.storyTitle}</h2>
                     </div>
                     <div className="md:w-1/2 leading-loose text-lg opacity-90">
                       <p className={`first-letter:text-7xl first-letter:font-light first-letter:mr-3 first-letter:float-left ${config.accentTextClass}`} style={{ color: dynamicColor }}>{invitation.storyContent}</p>
                     </div>
                  </div>
                )}
                
                {milestones.length > 0 && (
                  <div className={`grid md:grid-cols-2 gap-6`}>
                    {milestones.map((ms: any, idx: number) => (
                      <div key={ms.id || idx} className={`p-10 transition-all hover:-translate-y-1 backdrop-blur-md ${config.cardStyle}`}>
                        <span className={`text-xs tracking-[0.2em] uppercase mb-4 block ${config.accentTextClass}`} style={{ color: dynamicColor }}>0{idx + 1} KİLOMETRE TAŞI</span>
                        <h3 className={`text-3xl italic mb-4 ${config.heroFont || ''}`}>{ms.title}</h3>
                        <p className="text-sm leading-relaxed opacity-80"><span className="font-bold mr-2" style={{ color: dynamicColor }}>{new Date(ms.date).toLocaleDateString('tr-TR')}</span> {ms.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 4. PROGRAM VE MEKAN */}
          {eventStops.length > 0 && (
            <section className={`py-32 px-8 ${config.accentBgClass} ${config.accentTextInvertClass}`} style={dynamicColor ? { backgroundColor: dynamicColor } : {}}>
               <div className="max-w-6xl mx-auto">
                 <p className="text-xs tracking-[0.3em] mb-4 uppercase opacity-60">Program Akışı</p>
                 <h2 className={`text-6xl mb-16 font-light tracking-tight ${config.heroFont || ''}`}>Gün Boyunca</h2>
                 
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {eventStops.map((stop: any, idx: number) => (
                      <div key={stop.id || idx} className={`p-10 relative ${config.cardAltStyle} text-inherit`}>
                        <span className="absolute top-8 right-8 text-4xl font-light opacity-30">0{idx + 1}</span>
                        <p className="text-xs tracking-[0.2em] mb-8 uppercase opacity-70">Etkinlik</p>
                        <h3 className={`text-4xl mb-4 font-normal ${config.heroFont || ''}`}>{stop.title}</h3>
                        <p className="text-sm mb-1 opacity-90">{new Date(stop.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })}</p>
                        <p className="text-sm font-bold mb-8">{stop.timeString}</p>
                        <p className="text-base font-bold">{stop.locationName}</p>
                        <p className="text-sm mt-2 leading-relaxed opacity-80">{stop.address}</p>
                      </div>
                    ))}
                 </div>

                 {primaryStop && (
                   <div className={`p-12 md:p-16 max-w-4xl mx-auto ${config.cardAltStyle} text-inherit`}>
                     <p className="text-xs tracking-[0.2em] mb-4 uppercase opacity-60">BİLMENİZ GEREKENLER</p>
                     <h3 className={`text-4xl font-light mb-4 ${config.heroFont || ''}`}>Sizi burada ağırlıyoruz</h3>
                     <p className="mb-12 pb-12 border-b border-current opacity-60">{primaryStop.address || invitation.fullAddress}</p>
                     
                     <div className="grid grid-cols-2 gap-8 text-sm">
                       <div><p className="text-xs tracking-widest uppercase mb-1 opacity-50">Kıyafet</p><p>{primaryStop.dressCode || "-"}</p></div>
                       <div><p className="text-xs tracking-widest uppercase mb-1 opacity-50">Otopark</p><p>{primaryStop.parkingInfo || "-"}</p></div>
                       <div><p className="text-xs tracking-widest uppercase mb-1 opacity-50">Vale</p><p>{primaryStop.valeInfo || "-"}</p></div>
                       <div><p className="text-xs tracking-widest uppercase mb-1 opacity-50">Konaklama</p><p>{primaryStop.accomodation || "-"}</p></div>
                     </div>

                     {/* YENİ EKLENEN: GOOGLE HARİTALAR BUTONU */}
                     {invitation.mapCoordinates && (
                       <div className="mt-12 pt-12 border-t border-current flex justify-center">
                         <a href={invitation.mapCoordinates} target="_blank" rel="noreferrer" className="px-10 py-4 rounded-full text-sm font-bold tracking-[0.2em] transition-all hover:scale-105 uppercase bg-slate-900 text-white" style={dynamicColor ? { backgroundColor: dynamicColor } : {}}>
                           📍 YOL TARİFİ AL
                         </a>
                       </div>
                     )}
                   </div>
                 )}
               </div>
            </section>
          )}

          {/* 5. BANKA / HEDİYE */}
          {(invitation.bankIban || invitation.bankAccountName) && (
            <section className={`py-32 px-8 border-t ${config.sectionBorder} bg-transparent`}>
               <div className={`max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center p-12 md:p-16 shadow-2xl backdrop-blur-md ${config.cardStyle}`}>
                <div className="md:w-1/3 flex flex-col items-center text-center">
                   <div className={`w-32 h-32 rounded-full border border-dashed flex items-center justify-center p-2 mb-4 ${config.sectionBorder}`}>
                      <div className={`w-full h-full rounded-full flex flex-col items-center justify-center ${config.cardAltStyle}`} style={dynamicColor ? { backgroundColor: dynamicColor } : {}}>
                        <span className={`text-3xl font-light ${config.heroFont || ''}`}>{invitation.brideName?.[0]}{invitation.groomName?.[0]}</span>
                      </div>
                   </div>
                   <p className={`text-xs tracking-[0.2em] uppercase ${config.accentTextClass}`} style={{ color: dynamicColor }}>HEDİYE</p>
                </div>
                <div className="md:w-2/3 flex flex-col items-start text-left">
                  <h3 className={`text-4xl font-light mb-6 ${config.heroFont || ''}`}>Dilerseniz</h3>
                  <p className="mb-8 opacity-80">{invitation.bankMessage}</p>
                  <div className={`w-full border-t border-b py-6 mb-8 ${config.sectionBorder}`}>
                    <p className="font-bold text-lg">{invitation.bankAccountName}</p>
                    <p className={`text-sm mt-1 tracking-widest font-mono ${config.accentTextClass}`} style={{ color: dynamicColor }}>{invitation.bankIban}</p>
                  </div>
                  <button onClick={copyToClipboard} className={`border px-8 py-3 rounded-full text-xs font-bold tracking-[0.2em] transition-all hover:opacity-70 uppercase ${config.sectionBorder} bg-transparent`} style={dynamicColor ? { color: dynamicColor, borderColor: dynamicColor } : {}}>
                    {copied ? "KOPYALANDI ✔" : "IBAN'I KOPYALA"}
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* 6. LCV (DEMO MODUNDA KİLİTLİ) */}
          <section className={`py-32 px-8 text-center ${config.glassOverlayClass} relative`}>
             <div className="max-w-3xl mx-auto flex flex-col items-center relative z-10">
               <h3 className={`text-4xl font-light mb-12 w-full text-center ${config.heroFont || ''}`}>Bu mutlu günde yeriniz hazır</h3>
               <div className="w-full max-w-md relative">
                 
                 {isDemoMode && (
                   <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-8 text-white">
                     <span className="text-4xl mb-4">🔒</span>
                     <h4 className="font-bold text-lg mb-2">Form Kilitli</h4>
                     <p className="text-sm opacity-90 text-center">Bu alan, ödeme onaylandıktan sonra misafirleriniz için aktif hale gelecektir.</p>
                   </div>
                 )}

                 <RsvpModal invitationId={invitation.id} isRsvpClosed={invitation.isRsvpClosed} />
               </div>
             </div>
          </section>

        </div>
      </div>
    </div>
  )
}

// ==========================================
// TEMA SÖZLÜĞÜ (YAPISAL AYARLAR İÇİN)
// ==========================================
export default function ThemeRenderer({ invitation }: { invitation: any }) {
  // invitation.theme obje olarak backend'den geliyor (findSlug içinde eklemiştik)
  const dbTheme = invitation.theme || {};
  const themeId = dbTheme.themeId || invitation.themeId || "yasemin-perdesi"; 

  // Burada sadece yapısal (CSS yapısını etkileyen) taslaklar duruyor.
  // Renk, resim ve font gibi veriler artık 'dbTheme' değişkeni ile veritabanından ezilecek!
  const THEMES: Record<string, any> = {
    "yasemin-perdesi": {
      themeName: "Yasemin Perdesi",
      textClass: "text-[#3b4033]",
      accentTextClass: "text-[#677059]",
      accentTextInvertClass: "text-[#fdfaf5]",
      globalBgImage: "bg-[url('https://plus.unsplash.com/premium_photo-1736609966528-c0cacdb8a8c6?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]",
      globalOverlay: "bg-[#fdfaf5]/90", 
      coverBgClass: "bg-[#2d3326]",
      coverPatternClass: "bg-[url('https://plus.unsplash.com/premium_photo-1736609966528-c0cacdb8a8c6?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]",
      heroStyle: "border-[16px] border-[#eae0d5]/50 bg-transparent m-4 md:m-8 rounded-xl",
      heroBgImage: "bg-[url('https://plus.unsplash.com/premium_photo-1736609966528-c0cacdb8a8c6?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]",
      heroOverlay: "opacity-30 bg-[#fdfaf5]/50 rounded-xl",
      heroInnerBox: "bg-white/80 backdrop-blur-md rounded-xl shadow-2xl",
      glassOverlayClass: "bg-[#fdfaf5]/60 backdrop-blur-md", 
      accentBgClass: "bg-[#3b4033]/95 backdrop-blur-xl", 
      sectionBorder: "border-[#3b4033]/10",
      cardStyle: "bg-white/70 border border-white/40 rounded-2xl shadow-sm",
      cardAltStyle: "bg-white/10 border border-white/20 rounded-2xl backdrop-blur-sm"
    },
    // ... Diğer statik yapı taşları (Aynı kalacak, çünkü renkleri artık dbTheme ezecek)
    "kapadokya": {
      themeName: "Kapadokya",
      textClass: "text-[#5e381b]",
      accentTextClass: "text-[#b58763]",
      accentTextInvertClass: "text-[#fcf5ef]",
      globalBgImage: "bg-[url('https://images.unsplash.com/photo-1634410078081-1a918cef84c7?q=80&w=987&auto=format&fit=crop')]",
      globalOverlay: "bg-[#fcf5ef]/80", 
      coverBgClass: "bg-[#4a2a12]",
      coverPatternClass: "bg-[url('https://images.unsplash.com/photo-1634410078081-1a918cef84c7?q=80&w=987&auto=format&fit=crop')]",
      heroStyle: "rounded-2xl border border-[#ebd7c8] m-4 shadow-md bg-transparent",
      heroBgImage: "bg-[url('https://images.unsplash.com/photo-1634410078081-1a918cef84c7?q=80&w=987&auto=format&fit=crop')]",
      heroOverlay: "opacity-40 bg-[#fcf5ef]/50 rounded-2xl",
      heroInnerBox: "bg-white/70 backdrop-blur-md rounded-2xl",
      glassOverlayClass: "bg-transparent",
      accentBgClass: "bg-[#4a2a12]/95 backdrop-blur-md",
      sectionBorder: "border-[#ebd7c8]",
      cardStyle: "bg-white/60 backdrop-blur-md rounded-2xl border border-[#ebd7c8]",
      cardAltStyle: "bg-white/10 border border-white/20 rounded-2xl backdrop-blur-sm"
    },
    "sutun-perdesi": {
      themeName: "Sütun Perdesi",
      textClass: "text-[#362f2c]",
      accentTextClass: "text-[#8c7b70]",
      accentTextInvertClass: "text-[#f7f2ea]",
      globalBgImage: "bg-[url('https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=1000&auto=format&fit=crop')]",
      globalOverlay: "bg-[#f7f2ea]/85", 
      coverBgClass: "bg-[#362f2c]",
      coverPatternClass: "bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000&auto=format&fit=crop')]",
      heroStyle: "border-y-[1px] border-[#d4c5ae] bg-transparent py-20 m-4 md:m-8",
      heroBgImage: "bg-[url('https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=1000&auto=format&fit=crop')]",
      heroOverlay: "opacity-30 bg-[#f7f2ea]/50",
      heroInnerBox: "bg-white/50 backdrop-blur-md border border-[#d4c5ae] rounded-sm",
      glassOverlayClass: "bg-transparent", 
      accentBgClass: "bg-[#362f2c]/95 backdrop-blur-lg",
      sectionBorder: "border-[#d4c5ae]",
      cardStyle: "bg-white/50 backdrop-blur-md border border-[#d4c5ae] rounded-sm",
      cardAltStyle: "bg-white/5 border border-white/10 rounded-sm backdrop-blur-sm"
    },
    "isik-bahcesi": {
      themeName: "Işık Bahçesi",
      textClass: "text-[#fef08a]",
      accentTextClass: "text-[#eab308]",
      accentTextInvertClass: "text-[#fef08a]",
      globalBgImage: "bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop')]",
      globalOverlay: "bg-[#0b1329]/70", 
      coverBgClass: "bg-[#050a17]",
      coverPatternClass: "bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop')]",
      heroStyle: "bg-transparent border border-[#1e293b] m-4 md:m-8 shadow-[0_0_50px_rgba(234,179,8,0.1)] rounded-xl",
      heroBgImage: "bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop')]",
      heroOverlay: "opacity-40 bg-black/50 rounded-xl",
      heroInnerBox: "bg-[#0b1329]/40 backdrop-blur-sm rounded-xl",
      glassOverlayClass: "bg-[#0b1329]/40 backdrop-blur-sm",
      accentBgClass: "bg-[#050a17]/80 backdrop-blur-xl",
      sectionBorder: "border-yellow-900/30",
      cardStyle: "bg-[#0b1329]/60 backdrop-blur-md border border-yellow-900/30 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)]",
      cardAltStyle: "bg-black/40 rounded-xl border border-yellow-900/30 backdrop-blur-md"
    }
  };

  const selectedConfig = THEMES[themeId] || THEMES["yasemin-perdesi"];

  return <PremiumThemeCore invitation={invitation} config={selectedConfig} dbTheme={dbTheme} />;
}