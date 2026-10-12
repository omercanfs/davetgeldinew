import { Metadata } from "next";
import Link from "next/link";
import ThemeRenderer from "@/components/ThemeRenderer";

// Next.js 15 için Props tipi
type Props = {
  params: Promise<{ themeId: string }>;
};

// 1. DEMO İÇİN DİNAMİK SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  return { 
    title: `${resolvedParams.themeId.toUpperCase()} Tasarımı | Ön İzleme`,
    description: "Bu tasarım şablonunu hemen kendi etkinliğiniz için özelleştirebilirsiniz."
  };
}

export default async function DemoPage({ params }: Props) {
  const resolvedParams = await params;
  const { themeId } = resolvedParams;

  // 2. MÜŞTERİYİ BÜYÜLEYECEK SAHTE (MOCK) DAVETİYE VERİSİ
  // Form doldurulmadığı halde tasarım dolu dolu gözüksün diye bu verileri kullanıyoruz.
  const mockInvitation = {
    id: 0,
    slug: "demo-onizleme",
    status: "ACTIVE", // Demo modunda kilit çıkmasın, LCV tam görünsün diye ACTIVE yapıyoruz
    brideName: "Yasemin",
    groomName: "Levent",
    eventDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // Bugünden 45 gün sonrası
    locationName: "La Vie Jardin",
    fullAddress: "Çubuklu Yolu No:42, Beykoz / İstanbul",
    themeId: themeId,
    welcomeMessage: "Otopark: Ücretsiz Mevcut | Vale: Kapıda | Kıyafet: Smart Casual",
    storyTitle: "Birlikte Büyüyen Hikayemiz",
    storyContent: "Hikayemiz küçük bir bahçede başladı, uzun yaz akşamları ve birlikte kurduğumuz hayallerle büyüdü. Şimdi en sevdiğimiz insanlarla yeni hayatımıza başlıyoruz.",
    milestones: [
      { title: "İlk Tanışma", date: "2023-05-14", description: "O yağmurlu günde bir kahve dükkanında göz göze geldik." },
      { title: "Evlilik Teklifi", date: "2024-02-14", description: "Birlikte çıkacağımız uzun yolculuğa sonsuz bir 'Evet' dedik." }
    ],
    eventStops: [
      { title: "Karşılama & Kokteyl", date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), timeString: "19:00", locationName: "Göl Kenarı", address: "Açık alan", dressCode: "Şık", parkingInfo: "Var", valeInfo: "-", accomodation: "-" },
      { title: "Düğün Yemeği", date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), timeString: "20:30", locationName: "La Vie Jardin Ana Salon", address: "Çubuklu Yolu No:42", dressCode: "Resmi", parkingInfo: "Mevcut", valeInfo: "Kapıda", accomodation: "Anlaşmalı Oteller" }
    ],
    isRsvpClosed: false,
    theme: {
        themeId: themeId
    }
  };

  return (
    <div className="relative">
      
      {/* 3. DEMO YÖNETİM ÇUBUĞU (Ziyaretçi kaybolmasın diye en üstte sabit durur) */}
      <div className="fixed top-0 left-0 w-full z-[999] bg-slate-900/95 backdrop-blur-md text-white py-4 px-4 md:px-8 flex justify-between items-center shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-4">
          <Link href="/tasarimlar" className="text-slate-400 hover:text-white font-bold text-xs md:text-sm flex items-center gap-2 transition-colors">
            <span>←</span> <span className="hidden md:inline">Geri Dön</span>
          </Link>
          <span className="hidden md:block text-slate-600">|</span>
          <span className="text-xs md:text-sm font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Ön İzleme Modu
          </span>
        </div>
        
        {/* BU TASARIMI KULLAN BUTONU */}
        <Link 
          href={`/olustur?tema=${themeId}`} 
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 md:px-8 md:py-3 rounded-full text-xs md:text-sm font-black shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all hover:scale-105"
        >
          Bu Tasarımı Kullan
        </Link>
      </div>

      {/* 4. MOTORU SAHTE (MOCK) VERİ İLE ÇAĞIR (Üst bar menüyü ezmesin diye pt-20 ekliyoruz) */}
      <div className="pt-16 md:pt-20">
        <ThemeRenderer invitation={mockInvitation} />
      </div>

    </div>
  );
}