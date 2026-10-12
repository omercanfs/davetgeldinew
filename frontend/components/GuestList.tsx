"use client";

import { useState } from "react";

export default function GuestList({ guests }: { guests: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  // Eğer hiç misafir yoksa pasif bir buton göster
  if (!guests || guests.length === 0) {
    return (
      <div className="mt-4 inline-flex items-center gap-2 bg-slate-50 text-slate-400 border border-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg">
        👥 Henüz LCV yanıtı yok
      </div>
    );
  }

  // Misafir varsa tıklanabilir ve açılabilir bir yapı kur
  return (
    <div className="mt-4 w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-sm font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-sm"
      >
        👥 {guests.length} LCV Yanıtı (Listeyi {isOpen ? "Gizle" : "Gör"})
      </button>

      {/* isOpen true ise (butona tıklandıysa) bu bölümü ekranda göster */}
      {isOpen && (
        <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <h4 className="text-sm font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">Katılım Bildirenler</h4>
          
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {guests.map((guest: any) => (
              <div key={guest.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-slate-800 text-lg">
                    {guest.firstName} {guest.lastName}
                  </div>
                  <div className="bg-emerald-100 text-emerald-700 text-xs font-black px-3 py-1.5 rounded-md">
                    {guest.guestCount} KİŞİ
                  </div>
                </div>
                
                {/* Eğer misafir mesaj yazdıysa göster, yazmadıysa bu kısmı gizle */}
                {guest.message && (
                  <div className="mt-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-md italic border-l-4 border-slate-300">
                    "{guest.message}"
                  </div>
                )}
              </div>
            ))}
          </div>
          
        </div>
      )}
    </div>
  );
}