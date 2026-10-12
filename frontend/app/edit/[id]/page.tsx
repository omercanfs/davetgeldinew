"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemeCard from "@/components/ThemeCard";

export default function EditInvitationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [formData, setFormData] = useState<any>(null);
  const [themes, setThemes] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeCategoryObj, setActiveCategoryObj] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:3000/store/packages")
      .then(res => res.json())
      .then(data => setPackages(Array.isArray(data) ? data : []));

    fetch(`http://localhost:3000/invitations/${id}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.eventDate) {
          const dateObj = new Date(data.eventDate);
          data.date = dateObj.toISOString().split('T')[0];
          data.time = dateObj.toTimeString().slice(0, 5);
        }
        
        data.milestones = data.milestones || [];
        data.eventStops = data.eventStops || [];
        data.galleryUrls = data.galleryUrls || [];
        data.addons = data.addons || [];
        
        setFormData(data);

        if (data.categoryId) {
          fetch("http://localhost:3000/store/categories")
            .then(res => res.json())
            .then(cats => {
               const cat = cats.find((c:any) => c.id === data.categoryId);
               setActiveCategoryObj(cat);
            });
            
           fetch(`http://localhost:3000/store/themes/${data.categoryId}`)
            .then(res => res.json())
            .then(themeData => setThemes(themeData));
        }
      });
  }, [id]);

  const invPackage = packages.find(p => p.id === formData?.packageId);
  const isPremiumPkg = invPackage?.addonKey === 'premium';
  const isVipPkg = invPackage?.addonKey === 'vip' || formData?.isPremium;

  const hasLcv = isVipPkg || isPremiumPkg || formData?.addons?.includes('lcv');
  const hasGallery = isVipPkg || formData?.addons?.includes('gallery');
  const hasMusic = isVipPkg || formData?.addons?.includes('music');

  const isWedding = activeCategoryObj?.slug?.includes('dugun') || activeCategoryObj?.slug?.includes('nisan');
  const isBirthday = activeCategoryObj?.slug?.includes('dogum');
  const isBabyShower = activeCategoryObj?.slug?.includes('baby');
  const isSunnet = activeCategoryObj?.slug?.includes('sunnet');
  const isCorporate = activeCategoryObj?.slug?.includes('kurumsal');
  const isParty = activeCategoryObj?.slug?.includes('parti') || activeCategoryObj?.slug?.includes('bekarliga') || activeCategoryObj?.slug?.includes('veda');

  const labelPerson1 = isWedding ? "Gelin Adı" : isBabyShower ? "Anne Adı" : isSunnet ? "Çocuğun Adı" : isBirthday ? "Doğum Günü Kişisi" : isCorporate ? "Kurum / Firma Adı" : "1. Kişi Adı";
  const labelPerson2 = isWedding ? "Damat Adı" : isBabyShower ? "Baba Adı (Opsiyonel)" : isCorporate ? "Yetkili Kişi (Opsiyonel)" : "2. Kişi (Opsiyonel)";
  const labelStory = isWedding ? "Aşk Hikayeniz" : isBirthday ? "Doğum Günü Hikayesi" : isBabyShower ? "Bebeğimizin Hikayesi" : isCorporate ? "Hakkımızda" : "Hikayeniz";

  const addMilestone = () => setFormData({ ...formData, milestones: [...(formData.milestones || []), { title: "", date: "", description: "" }] });
  const updateMilestone = (index: number, field: string, value: string) => {
    const updated = [...(formData.milestones || [])];
    updated[index][field] = value;
    setFormData({ ...formData, milestones: updated });
  };
  const removeMilestone = (index: number) => setFormData({ ...formData, milestones: (formData.milestones || []).filter((_: any, i: number) => i !== index) });

  const addEventStop = () => setFormData({ ...formData, eventStops: [...(formData.eventStops || []), { title: "", date: "", timeString: "", locationName: "", address: "", dressCode: "", parkingInfo: "", valeInfo: "", accomodation: "" }] });
  const updateEventStop = (index: number, field: string, value: string) => {
    const updated = [...(formData.eventStops || [])];
    updated[index][field] = value;
    setFormData({ ...formData, eventStops: updated });
  };
  const removeEventStop = (index: number) => setFormData({ ...formData, eventStops: (formData.eventStops || []).filter((_: any, i: number) => i !== index) });

  const addGalleryImage = () => setFormData({ ...formData, galleryUrls: [...(formData.galleryUrls || []), ""] });
  const updateGalleryImage = (index: number, value: string) => {
    const updated = [...(formData.galleryUrls || [])];
    updated[index] = value;
    setFormData({ ...formData, galleryUrls: updated });
  };
  const removeGalleryImage = (index: number) => setFormData({ ...formData, galleryUrls: (formData.galleryUrls || []).filter((_: any, i: number) => i !== index) });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const eventDateIso = new Date(`${formData.date}T${formData.time || "12:00"}:00`).toISOString();

      await fetch(`http://localhost:3000/invitations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brideName: formData.brideName, 
          groomName: formData.groomName, 
          eventDate: eventDateIso,
          locationName: formData.locationName, 
          fullAddress: formData.fullAddress, 
          mapCoordinates: formData.mapCoordinates,
          themeId: formData.themeId,
          musicUrl: hasMusic ? formData.musicUrl : "", 
          galleryUrls: hasGallery ? formData.galleryUrls : [], 
          isRsvpClosed: hasLcv ? formData.isRsvpClosed : true, 
          storyTitle: formData.storyTitle || "", 
          storyContent: formData.storyContent || "", 
          bankAccountName: formData.bankAccountName || "", 
          bankIban: formData.bankIban || "", 
          bankMessage: formData.bankMessage || "",
          milestones: formData.milestones || [], 
          eventStops: formData.eventStops || [],
        }),
      });
      alert("✅ Değişiklikler başarıyla kaydedildi.");
      router.push("/dashboard");
      router.refresh();
    } catch (error) { alert("Bir hata oluştu."); } 
    finally { setIsSubmitting(false); }
  };

  if (!formData) return <div className="p-20 text-center text-slate-500 font-bold">Yükleniyor...</div>;

  return (
    <main className="p-6 md:p-8 max-w-4xl mx-auto min-h-screen bg-slate-50">
      <Link href="/dashboard" className="text-indigo-600 font-bold mb-6 inline-flex items-center gap-2 hover:underline">
        <span>←</span> Müşteri Paneline Dön
      </Link>
      
      <form onSubmit={handleSubmit} className="p-6 lg:p-10 bg-white rounded-3xl shadow-lg border border-slate-200 flex flex-col gap-10">
        
        <div className="flex justify-between items-center border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">Davetiyeyi Düzenle</h2>
            <p className="text-slate-500 text-sm mt-1">Etkinlik detaylarınızı buradan güncelleyebilirsiniz.</p>
          </div>
          <div className="text-right hidden md:block">
             <span className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest block mb-1">{formData.slug}</span>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{invPackage?.name || "Özel Paket"}</span>
          </div>
        </div>
        
        <div className="space-y-6">
           <h3 className="text-xl font-black text-slate-900 flex items-center gap-2"><span>1.</span> Temel Bilgiler</h3>
           <div className="grid md:grid-cols-2 gap-6">
             <div>
               <label className="block text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">{labelPerson1}</label>
               <input type="text" value={formData.brideName} onChange={(e) => setFormData({...formData, brideName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-indigo-500" required />
             </div>
             <div>
               <label className="block text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">{labelPerson2}</label>
               <input type="text" value={formData.groomName || ""} onChange={(e) => setFormData({...formData, groomName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-indigo-500" />
             </div>
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tarih</label>
               <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none" required />
             </div>
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Saat</label>
               <input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none" required />
             </div>
           </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2"><span>2.</span> Mekan ve Adres</h3>
          <div className="grid md:grid-cols-2 gap-6">
             <div className="md:col-span-2">
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Ana Mekan Adı</label>
               <input type="text" value={formData.locationName} onChange={(e) => setFormData({...formData, locationName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none" required />
             </div>
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Açık Adres</label>
               <textarea value={formData.fullAddress} onChange={(e) => setFormData({...formData, fullAddress: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none" rows={2} required></textarea>
             </div>
             <div>
               <label className="block text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Google Haritalar Linki</label>
               <textarea value={formData.mapCoordinates || ""} onChange={(e) => setFormData({...formData, mapCoordinates: e.target.value})} className="w-full bg-indigo-50/50 border border-indigo-200 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-indigo-500" rows={2}></textarea>
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2"><span>3.</span> Program Akışı</h3>
            <button type="button" onClick={addEventStop} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:scale-105 transition-all shadow-md">+ Yeni Durak Ekle</button>
          </div>
          <div className="space-y-6">
            {formData.eventStops.map((stop: any, index: number) => (
              <div key={index} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative group">
                <button type="button" onClick={() => removeEventStop(index)} className="absolute top-4 right-4 text-red-500 bg-red-50 px-3 py-1 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Kaldır</button>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div><label className="text-[10px] font-bold text-slate-400 uppercase">Durak Adı</label><input type="text" value={stop.title} onChange={e => updateEventStop(index, 'title', e.target.value)} className="w-full border p-3 rounded-xl mt-1 outline-none" placeholder="Örn: Kına Gecesi" /></div>
                  <div><label className="text-[10px] font-bold text-slate-400 uppercase">Tarih</label><input type="date" value={stop.date ? stop.date.split('T')[0] : ''} onChange={e => updateEventStop(index, 'date', e.target.value)} className="w-full border p-3 rounded-xl mt-1 outline-none" /></div>
                  <div><label className="text-[10px] font-bold text-slate-400 uppercase">Saat</label><input type="time" value={stop.timeString || ""} onChange={e => updateEventStop(index, 'timeString', e.target.value)} className="w-full border p-3 rounded-xl mt-1 outline-none" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="text-[10px] font-bold text-slate-400 uppercase">Mekan Adı</label><input type="text" value={stop.locationName} onChange={e => updateEventStop(index, 'locationName', e.target.value)} className="w-full border p-3 rounded-xl mt-1 outline-none" /></div>
                  <div><label className="text-[10px] font-bold text-slate-400 uppercase">Açık Adres</label><input type="text" value={stop.address || ""} onChange={e => updateEventStop(index, 'address', e.target.value)} className="w-full border p-3 rounded-xl mt-1 outline-none" /></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2"><span>4.</span> {labelStory}</h3>
            <button type="button" onClick={addMilestone} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:scale-105 transition-all shadow-md">+ Dönüm Noktası</button>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Genel Hikaye Başlığı</label>
              <input type="text" value={formData.storyTitle || ""} onChange={e => setFormData({...formData, storyTitle: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Genel Hikaye Metni</label>
              <textarea value={formData.storyContent || ""} onChange={e => setFormData({...formData, storyContent: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none" rows={3}></textarea>
            </div>
          </div>
          <div className="space-y-4">
            {formData.milestones.map((ms: any, index: number) => (
              <div key={index} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative group flex flex-col md:flex-row gap-4 items-start">
                <button type="button" onClick={() => removeMilestone(index)} className="absolute top-4 right-4 text-red-500 bg-red-50 px-3 py-1 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Kaldır</button>
                <div className="flex-1 w-full"><label className="text-[10px] font-bold text-slate-400 uppercase">Başlık</label><input type="text" value={ms.title} onChange={e => updateMilestone(index, 'title', e.target.value)} className="w-full border p-3 rounded-xl mt-1 outline-none" /></div>
                <div className="w-full md:w-48"><label className="text-[10px] font-bold text-slate-400 uppercase">Tarih</label><input type="date" value={ms.date ? ms.date.split('T')[0] : ''} onChange={e => updateMilestone(index, 'date', e.target.value)} className="w-full border p-3 rounded-xl mt-1 outline-none" /></div>
                <div className="flex-[2] w-full"><label className="text-[10px] font-bold text-slate-400 uppercase">Kısa Açıklama</label><input type="text" value={ms.description || ""} onChange={e => updateMilestone(index, 'description', e.target.value)} className="w-full border p-3 rounded-xl mt-1 outline-none" /></div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-8 bg-slate-50 -mx-6 lg:-mx-10 px-6 lg:px-10 py-8 border-y border-slate-200">
          <div className="mb-4">
            <h3 className="text-xl font-black text-slate-900 mb-1">Özel Modüller ve Eklentiler</h3>
            <p className="text-sm text-slate-500">Satın aldığınız pakete dahil olan özellikleri buradan yönetebilirsiniz.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-2xl border ${hasLcv ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-100 border-dashed border-slate-300 opacity-70'}`}>
              <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">{hasLcv ? '💌' : '🔒'} LCV Katılım Formu</h4>
              {hasLcv ? (
                <label className="flex items-center gap-4 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors">
                  <input type="checkbox" checked={formData.isRsvpClosed || false} onChange={(e) => setFormData({...formData, isRsvpClosed: e.target.checked})} className="w-6 h-6 accent-slate-900" />
                  <div>
                    <p className="font-bold text-slate-800 text-sm">Katılım Alımını Kapat</p>
                    <p className="text-xs text-slate-500">Bunu seçerseniz davetiyenizdeki form gizlenir.</p>
                  </div>
                </label>
              ) : (
                <p className="text-xs text-slate-500">Bu özellik paketinizde bulunmuyor.</p>
              )}
            </div>

            <div className={`p-6 rounded-2xl border ${hasMusic ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-100 border-dashed border-slate-300 opacity-70'}`}>
              <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">{hasMusic ? '🎵' : '🔒'} Arka Plan Müziği</h4>
              {hasMusic ? (
                <div>
                  <p className="text-xs text-slate-500 mb-2">Müzik çalması için MP3 uzantılı link yapıştırın.</p>
                  <input type="url" value={formData.musicUrl || ""} onChange={(e) => setFormData({...formData, musicUrl: e.target.value})} className="w-full border border-slate-200 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-400" placeholder="https://.../sarki.mp3" />
                </div>
              ) : (
                <p className="text-xs text-slate-500">Bu özellik paketinizde bulunmuyor.</p>
              )}
            </div>

            <div className={`md:col-span-2 p-6 rounded-2xl border ${hasGallery ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-100 border-dashed border-slate-300 opacity-70'}`}>
              <div className="flex justify-between items-center mb-4">
                 <h4 className="font-bold text-slate-800 flex items-center gap-2">{hasGallery ? '🖼️' : '🔒'} Fotoğraf Galerisi</h4>
                 {hasGallery && <button type="button" onClick={addGalleryImage} className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100">+ Fotoğraf Ekle</button>}
              </div>
              {hasGallery ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 mb-4">Geçici olarak direkt fotoğraf URL'lerini buraya yapıştırabilirsiniz.</p>
                  {formData.galleryUrls.map((img: string, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-400">{index + 1}.</span>
                      <input type="url" value={img} onChange={(e) => updateGalleryImage(index, e.target.value)} className="flex-1 border border-slate-200 p-3 rounded-xl text-sm outline-none" placeholder="https://resimlinki.com/foto.jpg" />
                      <button type="button" onClick={() => removeGalleryImage(index)} className="text-red-500 bg-red-50 px-3 py-3 rounded-xl text-xs font-bold">Sil</button>
                    </div>
                  ))}
                  {formData.galleryUrls.length === 0 && <p className="text-sm text-slate-400 italic text-center py-4">Henüz fotoğraf eklemediniz.</p>}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Bu özellik paketinizde bulunmuyor.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2"><span>6.</span> Hediye & Banka Bilgileri (Opsiyonel)</h3>
          <div className="grid md:grid-cols-2 gap-6 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="md:col-span-2"><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Hediye / Banka Mesajınız</label><input type="text" value={formData.bankMessage || ""} onChange={e => setFormData({...formData, bankMessage: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none" /></div>
            <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Hesap Sahibi Ad Soyad</label><input type="text" value={formData.bankAccountName || ""} onChange={e => setFormData({...formData, bankAccountName: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none" /></div>
            <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">IBAN Numarası</label><input type="text" value={formData.bankIban || ""} onChange={e => setFormData({...formData, bankIban: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none font-mono text-sm" /></div>
          </div>
        </div>
        
        {themes.length > 0 && (
          <div className="space-y-6 pt-4 border-t border-slate-100">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2"><span>🎨</span> Temayı Değiştir</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {themes.map(theme => (
                <ThemeCard 
                  key={theme.id} 
                  theme={theme} 
                  isSelected={formData.themeId === theme.id.toString()} 
                  onSelect={(id) => setFormData({...formData, themeId: id})} 
                />
              ))}
            </div>
          </div>
        )}

        <div className="pt-8 border-t border-slate-200">
          <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white p-5 rounded-2xl font-black transition-all shadow-xl hover:shadow-indigo-600/40 text-lg">
            {isSubmitting ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
          </button>
        </div>

      </form>
    </main>
  );
}