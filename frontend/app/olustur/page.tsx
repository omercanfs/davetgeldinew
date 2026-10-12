import InvitationForm from "@/components/InvitationForm";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Davetiye Oluştur | DavetGeldi',
  description: 'Saniyeler içinde kendi dijital davetiyenizi tasarlayın.',
};

export default function OlusturPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      
      {/* 1. SADELEŞTİRİLMİŞ NAVBAR (Dikkat dağıtmamak için menüler yok) */}
      <nav className="w-full bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-3xl font-black tracking-tighter text-slate-900">
              DavetGeldi<span className="text-indigo-600">.</span>
            </span>
          </Link>
          <Link href="/" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </nav>

      {/* 2. FORM ALANI */}
      <main className="flex-1 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
              Davetiyenizi Oluşturun
            </h1>
            <p className="text-slate-600">
              Etkinlik türünü seçin, bilgilerinizi girin ve harika bir davetiye taslağı oluşturun.
            </p>
          </div>

          {/* DAHA ÖNCE YAZDIĞIMIZ FORM BİLEŞENİNİ BURADA ÇAĞIRIYORUZ */}
          <InvitationForm />
          
        </div>
      </main>

      {/* 3. MİNİ FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 font-medium">
          © 2026 DavetGeldi. Güvenli Ödeme ve Veri Koruması.
        </div>
      </footer>

    </div>
  );
}