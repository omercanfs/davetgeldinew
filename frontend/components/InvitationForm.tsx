"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CategoryCard from './CategoryCard';
import ThemeCard from './ThemeCard';

function FormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlCategory = searchParams.get("kategori");
  const urlTheme = searchParams.get("tema");
  const urlPaket = searchParams.get("paket");

  const [step, setStep] = useState(urlCategory ? 2 : 1); 
  const [categories, setCategories] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [themes, setThemes] = useState<any[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory || "");
  const [selectedTheme, setSelectedTheme] = useState<string>(urlTheme || "");

  const activeCategoryObj = categories.find(c => c.id.toString() === selectedCategory);
  const isWedding = activeCategoryObj?.slug?.includes('dugun') || activeCategoryObj?.slug?.includes('nisan');
  const isBirthday = activeCategoryObj?.slug?.includes('dogum');
  const isBabyShower = activeCategoryObj?.slug?.includes('baby');
  const isSunnet = activeCategoryObj?.slug?.includes('sunnet');
  const isCorporate = activeCategoryObj?.slug?.includes('kurumsal');
  const isParty = activeCategoryObj?.slug?.includes('parti') || activeCategoryObj?.slug?.includes('bekarliga') || activeCategoryObj?.slug?.includes('veda');

  const labelPerson1 = isWedding ? "Gelin Adı" : isBabyShower ? "Anne Adı" : isSunnet ? "Çocuğun Adı" : isBirthday ? "Doğum Günü Kişisi" : isCorporate ? "Kurum / Firma Adı" : isParty ? "Etkinlik Sahibi / Adınız" : "1. Kişi Adı";
  const labelPerson2 = isWedding ? "Damat Adı" : isBabyShower ? "Baba Adı (Opsiyonel)" : isCorporate ? "Yetkili Kişi (Opsiyonel)" : "2. Kişi (Opsiyonel)";
  const labelStory = isWedding ? "Aşk Hikayeniz" : isBirthday ? "Doğum Günü Hikayesi" : isBabyShower ? "Bebeğimizin Hikayesi" : isCorporate ? "Hakkımızda" : "Hikayeniz";

  const [formData, setFormData] = useState({
    brideName: "", groomName: "", date: "", time: "", 
    locationName: "", fullAddress: "", mapCoordinates: "",
    storyTitle: "", storyContent: "",
    bankAccountName: "", bankIban: "", bankMessage: "Hediyeniz bizim için çok değerli.", musicUrl: ""
  });
  
  const [milestones, setMilestones] = useState<any[]>([]);
  const [eventStops, setEventStops] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isWedding && eventStops.length === 0) {
      setEventStops([{ title: "Kına Gecesi", date: "", timeString: "", locationName: "", address: "", dressCode: "Yöresel / Şık", parkingInfo: "", valeInfo: "", accomodation: "" }]);
      setMilestones([{ title: "İlk Tanışma", date: "", description: "Göz göze geldiğimiz o ilk an..." }, { title: "Evlilik Teklifi", date: "", description: "Sonsuzluğa 'Evet' dedik." }]);
    } else if (isBirthday && eventStops.length === 0) {
      setEventStops([{ title: "Sürpriz Parti", date: "", timeString: "", locationName: "", address: "", dressCode: "Konsept", parkingInfo: "", valeInfo: "", accomodation: "" }]);
    } else if (isBabyShower && eventStops.length === 0) {
      setEventStops([{ title: "Cinsiyet Belirleme (Gender Reveal)", date: "", timeString: "", locationName: "", address: "", dressCode: "Pembe veya Mavi", parkingInfo: "", valeInfo: "", accomodation: "" }]);
    }
  }, [selectedCategory, isWedding, isBirthday, isBabyShower]);

  useEffect(() => {
    fetch("http://127.0.0.1:3000/store/categories").then(res => res.json()).then(data => setCategories(Array.isArray(data) ? data : []));
    fetch("http://127.0.0.1:3000/store/packages").then(res => res.json()).then(data => setPackages(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetch(`http://127.0.0.1:3000/store/themes/${selectedCategory}`).then(res => res.json()).then(data => {
          const themeData = Array.isArray(data) ? data : [];
          setThemes(themeData);
          if (urlTheme && themeData.some((t:any) => t.id.toString() === urlTheme)) setSelectedTheme(urlTheme);
          else if (themeData.length > 0 && !selectedTheme) setSelectedTheme(themeData[0].id.toString());
        });
    }
  }, [selectedCategory, urlTheme]);

  const addMilestone = () => setMilestones([...milestones, { title: "", date: "", description: "" }]);
  const updateMilestone = (idx: number, field: string, value: string) => { const arr = [...milestones]; arr[idx][field] = value; setMilestones(arr); };
  const removeMilestone = (idx: number) => setMilestones(milestones.filter((_, i) => i !== idx));

  const addEventStop = () => setEventStops([...eventStops, { title: "", date: "", timeString: "", locationName: "", address: "", dressCode: "", parkingInfo: "", valeInfo: "", accomodation: "" }]);
  const updateEventStop = (idx: number, field: string, value: string) => { const arr = [...eventStops]; arr[idx][field] = value; setEventStops(arr); };
  const removeEventStop = (idx: number) => setEventStops(eventStops.filter((_, i) => i !== idx));

  // PROFESYONEL SEPET VE PAKET MANTIĞI
  const [selectedMainPkg, setSelectedMainPkg] = useState<string>(urlPaket || 'standart');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const standartPkg = packages.find(p => p.addonKey === 'standart') || { id: 1, price: 499, name: "Standart Paket", description: "Dijital Davetiye" };
  const premiumPkg = packages.find(p => p.addonKey === 'premium') || { id: 2, price: 699, name: "Premium Paket", description: "Standart + LCV" };
  const vipPkg = packages.find(p => p.addonKey === 'vip') || { id: 3, price: 899, name: "VIP Elite", description: "Her Şey Dahil" };

  const lcvAddon = packages.find(p => p.addonKey === 'lcv') || { addonKey: 'lcv', price: 150, name: "LCV Özelliği", description: "Katılım takibi yapın." };
  const galleryAddon = packages.find(p => p.addonKey === 'gallery') || { addonKey: 'gallery', price: 200, name: "Fotoğraf Galerisi", description: "Anılarınızı paylaşın." };
  const musicAddon = packages.find(p => p.addonKey === 'music') || { addonKey: 'music', price: 50, name: "Arka Plan Müziği", description: "Davetiyeye ses katın." };

  const toggleAddon = (key: string) => {
    setSelectedAddons(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const calculateTotal = () => {
    let total = 0;
    if (selectedMainPkg === 'standart') total = standartPkg.price;
    if (selectedMainPkg === 'premium') total = premiumPkg.price;
    if (selectedMainPkg === 'vip') total = vipPkg.price;

    if (selectedMainPkg === 'standart' && selectedAddons.includes('lcv')) total += lcvAddon.price;
    if (selectedMainPkg !== 'vip' && selectedAddons.includes('gallery')) total += galleryAddon.price;
    if (selectedMainPkg !== 'vip' && selectedAddons.includes('music')) total += musicAddon.price;

    return total;
  };

  const getFinalPackageId = () => {
    if (selectedMainPkg === 'vip') return vipPkg.id;
    if (selectedMainPkg === 'premium') return premiumPkg.id;
    return standartPkg.id;
  };

  const handleSubmit = async () => {
    if (!formData.brideName || !formData.date || !selectedTheme) {
      alert("Lütfen temel alanları doldurun.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const isLcvActive = selectedMainPkg === 'premium' || selectedMainPkg === 'vip' || selectedAddons.includes('lcv');
      const isMusicActive = selectedMainPkg === 'vip' || selectedAddons.includes('music');

      const payload = {
        ...formData,
        eventDate: new Date(`${formData.date}T${formData.time || "12:00"}:00`).toISOString(),
        categoryId: Number(selectedCategory),
        themeId: Number(selectedTheme),
        milestones,
        eventStops,
        slug: `${formData.brideName}-${formData.groomName || 'davet'}-${Math.floor(Math.random() * 10000)}`.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        packageId: getFinalPackageId(),
        totalPrice: calculateTotal(),
        isPremium: selectedMainPkg === 'vip',
        isRsvpClosed: !isLcvActive,
        musicUrl: isMusicActive ? formData.musicUrl : null,
        addons: selectedMainPkg === 'vip' ? ['lcv', 'gallery', 'music'] : selectedAddons,

        // ====== BURASI ÇOK KRİTİK: PRİSMA ŞEMASIYLA BİREBİR EŞLEŞEN İSİMLER ======
        welcomeMessage: formData.storyTitle || "", // Hikaye Başlığı
        storyContent: formData.storyContent || "", // DİKKAT: Senin state'inde adı storyContent, storyText DEĞİL!
        locationName: formData.locationName || "", 
        fullAddress: formData.fullAddress || "",   
        mapCoordinates: formData.mapCoordinates || "", // DİKKAT: Senin state'inde adı mapCoordinates
        
        bankMessage: JSON.stringify({
          giftMessage: formData.bankMessage || "", // DİKKAT: Senin state'inde hediye mesajının adı bankMessage
          bankAccountName: formData.bankAccountName || "",
          bankIban: formData.bankIban || ""
        }),
      };

      const userDataStr = localStorage.getItem("davetgeldi_user");
      
      // KULLANICI GİRİŞ YAPMAMIŞSA
      if (!userDataStr) {
        localStorage.setItem("pending_invitation", JSON.stringify(payload));
        setIsSubmitting(false); // DÖNMEYİ DURDUR!
        router.push("/register?checkout=true"); // Kayıt sayfasına yolla
        return;
      }

      // KULLANICI GİRİŞ YAPMIŞSA
      const user = JSON.parse(userDataStr);
      const token = localStorage.getItem("davetgeldi_token"); // TOKEN'I AL
      const finalPayload = { ...payload, userId: user.id };

      const res = await fetch("http://127.0.0.1:3000/invitations", {
        method: "POST", 
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // TOKEN'I GÖNDER (Kritik!)
        }, 
        body: JSON.stringify(finalPayload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Hata: ${errorData.message}`); 
        setIsSubmitting(false); 
        return;
      }
      
      router.push(`/dashboard`);
    } catch (error) { 
      alert("Bağlantı hatası."); 
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
      
      {/* STEP 1: KATEGORİ SEÇİMİ */}
      {step === 1 && (
        <div className="p-8 md:p-12">
          <h2 className="text-3xl font-black text-slate-900 mb-2">Etkinlik Türünü Seçin</h2>
          <p className="text-slate-500 mb-8">Size özel soruları hazırlayabilmemiz için etkinliğinizi seçin.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map(cat => (
            <CategoryCard 
              key={cat.id} 
              category={cat} 
              isSelected={selectedCategory === cat.id.toString()} 
              onSelect={(id) => { setSelectedCategory(id); setStep(2); }} 
            />
          ))}
        </div>
        </div>
      )}

      {/* STEP 2: FORM VERİLERİ */}
      {step === 2 && (
        <div className="p-8 md:p-12 space-y-10 animate-in fade-in slide-in-from-right-4">
          {!urlCategory && (
            <button onClick={() => setStep(1)} className="text-sm font-bold text-indigo-600 hover:underline">
              ← Etkinlik Türünü Değiştir
            </button>
          )}
          
          <div>
            <h3 className="text-xl font-black text-slate-900 mb-4 pb-2 border-b border-slate-100">1. Temel Bilgiler</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">{labelPerson1}</label>
                <input type="text" value={formData.brideName} onChange={e => setFormData({...formData, brideName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 font-medium focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="İsim giriniz" />
              </div>
              <div>
                <label className="block text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">{labelPerson2}</label>
                <input type="text" value={formData.groomName} onChange={e => setFormData({...formData, groomName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 font-medium focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="İsim giriniz (Varsa)" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Ana Tarih</label>
                <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 font-medium outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Başlangıç Saati</label>
                <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 font-medium outline-none" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-900 mb-4 pb-2 border-b border-slate-100">2. Mekan ve Adres</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Ana Mekan Adı</label>
                <input type="text" value={formData.locationName} onChange={e => setFormData({...formData, locationName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 font-medium outline-none" placeholder="Örn: La Vie Jardin" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Açık Adres</label>
                <textarea value={formData.fullAddress} onChange={e => setFormData({...formData, fullAddress: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 font-medium outline-none" placeholder="Açık adres..." rows={2}></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Google Haritalar Linki</label>
                <textarea value={formData.mapCoordinates} onChange={e => setFormData({...formData, mapCoordinates: e.target.value})} className="w-full bg-indigo-50/50 border border-indigo-200 rounded-2xl px-4 py-3.5 font-medium outline-none focus:ring-2 focus:ring-indigo-500" placeholder="https://maps.app.goo.gl/..." rows={2}></textarea>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
              <h3 className="text-xl font-black text-slate-900">3. Program Akışı ve Duraklar</h3>
              <button onClick={addEventStop} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:scale-105 transition-all shadow-md">+ Yeni Durak Ekle</button>
            </div>
            <div className="space-y-6">
              {eventStops.map((stop, index) => (
                <div key={index} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative group">
                  <button onClick={() => removeEventStop(index)} className="absolute top-4 right-4 text-red-500 bg-red-50 px-3 py-1 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Kaldır</button>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div><label className="text-[10px] font-bold text-slate-400 uppercase">Durak Adı</label><input type="text" value={stop.title} onChange={e => updateEventStop(index, 'title', e.target.value)} className="w-full border p-3 rounded-xl mt-1 outline-none" placeholder="Örn: Kına Gecesi" /></div>
                    <div><label className="text-[10px] font-bold text-slate-400 uppercase">Tarih</label><input type="date" value={stop.date} onChange={e => updateEventStop(index, 'date', e.target.value)} className="w-full border p-3 rounded-xl mt-1 outline-none" /></div>
                    <div><label className="text-[10px] font-bold text-slate-400 uppercase">Saat</label><input type="time" value={stop.timeString} onChange={e => updateEventStop(index, 'timeString', e.target.value)} className="w-full border p-3 rounded-xl mt-1 outline-none" /></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div><label className="text-[10px] font-bold text-slate-400 uppercase">Mekan</label><input type="text" value={stop.locationName} onChange={e => updateEventStop(index, 'locationName', e.target.value)} className="w-full border p-3 rounded-xl mt-1 outline-none" placeholder="Mekan Adı" /></div>
                    <div><label className="text-[10px] font-bold text-slate-400 uppercase">Adres</label><input type="text" value={stop.address} onChange={e => updateEventStop(index, 'address', e.target.value)} className="w-full border p-3 rounded-xl mt-1 outline-none" placeholder="Mekan Adresi" /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
              <h3 className="text-xl font-black text-slate-900">4. {labelStory} & Dönüm Noktaları</h3>
              <button onClick={addMilestone} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:scale-105 transition-all shadow-md">+ Dönüm Noktası Ekle</button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Genel Hikaye Başlığı</label>
                <input type="text" value={formData.storyTitle} onChange={e => setFormData({...formData, storyTitle: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 font-medium outline-none" placeholder="Örn: Birlikte Büyüyen Hikayemiz" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Genel Hikaye Metni</label>
                <textarea value={formData.storyContent} onChange={e => setFormData({...formData, storyContent: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 font-medium outline-none" placeholder="Hikayemiz şöyle başladı..." rows={3}></textarea>
              </div>
            </div>

            <div className="space-y-4">
              {milestones.map((ms, index) => (
                <div key={index} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative group flex flex-col md:flex-row gap-4 items-start">
                  <button onClick={() => removeMilestone(index)} className="absolute top-4 right-4 text-red-500 bg-red-50 px-3 py-1 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Kaldır</button>
                  <div className="flex-1 w-full">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Dönüm Noktası (Başlık)</label>
                    <input type="text" value={ms.title} onChange={e => updateMilestone(index, 'title', e.target.value)} className="w-full border p-3 rounded-xl mt-1 outline-none" placeholder="Örn: İlk Tanışma" />
                  </div>
                  <div className="w-full md:w-48">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Tarih</label>
                    <input type="date" value={ms.date} onChange={e => updateMilestone(index, 'date', e.target.value)} className="w-full border p-3 rounded-xl mt-1 outline-none text-slate-600" />
                  </div>
                  <div className="flex-[2] w-full">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Kısa Açıklama</label>
                    <input type="text" value={ms.description} onChange={e => updateMilestone(index, 'description', e.target.value)} className="w-full border p-3 rounded-xl mt-1 outline-none" placeholder="Göz göze geldiğimiz o an..." />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-900 mb-4 pb-2 border-b border-slate-100">5. Hediye & Banka Bilgileri (Opsiyonel)</h3>
            <div className="grid md:grid-cols-2 gap-6 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Hediye / Banka Mesajınız</label>
                <input type="text" value={formData.bankMessage} onChange={e => setFormData({...formData, bankMessage: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Örn: Varlığınız en güzel hediye..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Hesap Sahibi Ad Soyad</label>
                <input type="text" value={formData.bankAccountName} onChange={e => setFormData({...formData, bankAccountName: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Örn: Levent Yılmaz" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">IBAN Numarası</label>
                <input type="text" value={formData.bankIban} onChange={e => setFormData({...formData, bankIban: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm" placeholder="TR..." />
              </div>
            </div>
          </div>

          {!urlTheme && (
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-4 pb-2 border-b border-slate-100">6. Tasarım Konsepti Seçin</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {themes.map(theme => (
                  <ThemeCard 
                    key={theme.id} 
                    theme={theme} 
                    isSelected={selectedTheme === theme.id.toString()} 
                    onSelect={setSelectedTheme} 
                  />
                ))}
              </div>
            </div>
          )}

          <div className="pt-8 border-t border-slate-200 flex justify-end">
            <button 
              onClick={() => {
                if (!formData.brideName || !formData.date || !selectedTheme) {
                  alert("Lütfen temel alanları (İsim, Tarih ve Tema) doldurun.");
                  return;
                }
                setStep(3);
              }} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/40 transition-all transform hover:-translate-y-1"
            >
              Sonraki Adım: Özellik Seçimi →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SEPET VE PAKETLER */}
      {step === 3 && (
        <div className="p-8 md:p-12 animate-in fade-in slide-in-from-right-4">
          <button onClick={() => setStep(2)} className="text-sm font-bold text-indigo-600 hover:underline mb-6 flex items-center gap-2">
            <span>←</span> Bilgilere Dön
          </button>
          
          <h2 className="text-3xl font-black text-slate-900 mb-8">Son Adım: Paket Seçimi</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
             <div className="md:col-span-2 space-y-8">
                
                {/* 3 ANA PAKET KARTI */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Standart Paket */}
                  <div 
                    onClick={() => setSelectedMainPkg('standart')}
                    className={`cursor-pointer rounded-2xl border-2 p-6 flex flex-col transition-all ${selectedMainPkg === 'standart' ? 'border-indigo-600 bg-indigo-50 shadow-md ring-2 ring-indigo-600/20' : 'border-slate-200 bg-white hover:border-indigo-300'}`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-black text-indigo-900">{standartPkg.name}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMainPkg === 'standart' ? 'border-indigo-600' : 'border-slate-300'}`}>
                        {selectedMainPkg === 'standart' && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-4 flex-1">{standartPkg.description}</p>
                    <p className="text-2xl font-black text-slate-800">{standartPkg.price} ₺</p>
                  </div>

                  {/* Premium Paket */}
                  <div 
                    onClick={() => setSelectedMainPkg('premium')}
                    className={`cursor-pointer rounded-2xl border-2 p-6 flex flex-col transition-all relative ${selectedMainPkg === 'premium' ? 'border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-500/20' : 'border-slate-200 bg-white hover:border-amber-300'}`}
                  >
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">En Çok Tercih Edilen</span>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-black text-amber-900">{premiumPkg.name}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMainPkg === 'premium' ? 'border-amber-500' : 'border-slate-300'}`}>
                        {selectedMainPkg === 'premium' && <div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>}
                      </div>
                    </div>
                    <p className="text-xs text-amber-700/70 mb-4 flex-1">{premiumPkg.description}</p>
                    <p className="text-2xl font-black text-slate-800">{premiumPkg.price} ₺</p>
                  </div>

                  {/* VIP Paket */}
                  <div 
                    onClick={() => setSelectedMainPkg('vip')}
                    className={`cursor-pointer rounded-2xl border-2 p-6 flex flex-col transition-all ${selectedMainPkg === 'vip' ? 'border-emerald-600 bg-emerald-50 shadow-md ring-2 ring-emerald-600/20' : 'border-slate-200 bg-white hover:border-emerald-300'}`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-black text-emerald-900">{vipPkg.name}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMainPkg === 'vip' ? 'border-emerald-600' : 'border-slate-300'}`}>
                        {selectedMainPkg === 'vip' && <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full"></div>}
                      </div>
                    </div>
                    <p className="text-xs text-emerald-700/70 mb-4 flex-1">{vipPkg.description}</p>
                    <p className="text-2xl font-black text-slate-800">{vipPkg.price} ₺</p>
                  </div>
                </div>

                <div className="bg-slate-100 h-px w-full my-8"></div>

                {/* EKLENTİ SEÇİMİ */}
                <h4 className="font-bold text-slate-800 text-lg mb-4">Ekstra Özellikler Ekle</h4>
                <div className="grid gap-4">
                  <label className={`flex items-center justify-between p-5 border-2 rounded-2xl cursor-pointer transition-all ${(selectedAddons.includes('lcv') || selectedMainPkg !== 'standart') ? 'border-indigo-600 bg-white shadow-sm' : 'border-slate-100 bg-slate-50 hover:border-indigo-300'} ${(selectedMainPkg !== 'standart') ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className="flex items-center gap-4">
                        <input type="checkbox" checked={selectedAddons.includes('lcv') || selectedMainPkg !== 'standart'} onChange={() => toggleAddon('lcv')} className="w-6 h-6 accent-indigo-600" disabled={selectedMainPkg !== 'standart'} />
                        <div>
                          <h4 className="font-bold text-slate-800">{lcvAddon.name}</h4>
                          <p className="text-xs text-slate-500">{lcvAddon.description}</p>
                        </div>
                    </div>
                    <span className="font-bold text-slate-700">{selectedMainPkg !== 'standart' ? 'Pakete Dahil' : `+${lcvAddon.price} ₺`}</span>
                  </label>

                  <label className={`flex items-center justify-between p-5 border-2 rounded-2xl cursor-pointer transition-all ${(selectedAddons.includes('gallery') || selectedMainPkg === 'vip') ? 'border-indigo-600 bg-white shadow-sm' : 'border-slate-100 bg-slate-50 hover:border-indigo-300'} ${(selectedMainPkg === 'vip') ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className="flex items-center gap-4">
                        <input type="checkbox" checked={selectedAddons.includes('gallery') || selectedMainPkg === 'vip'} onChange={() => toggleAddon('gallery')} className="w-6 h-6 accent-indigo-600" disabled={selectedMainPkg === 'vip'} />
                        <div>
                          <h4 className="font-bold text-slate-800">{galleryAddon.name}</h4>
                          <p className="text-xs text-slate-500">{galleryAddon.description}</p>
                        </div>
                    </div>
                    <span className="font-bold text-slate-700">{selectedMainPkg === 'vip' ? 'Pakete Dahil' : `+${galleryAddon.price} ₺`}</span>
                  </label>

                  <label className={`flex items-center justify-between p-5 border-2 rounded-2xl cursor-pointer transition-all ${(selectedAddons.includes('music') || selectedMainPkg === 'vip') ? 'border-indigo-600 bg-white shadow-sm' : 'border-slate-100 bg-slate-50 hover:border-indigo-300'} ${(selectedMainPkg === 'vip') ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className="flex items-center gap-4">
                        <input type="checkbox" checked={selectedAddons.includes('music') || selectedMainPkg === 'vip'} onChange={() => toggleAddon('music')} className="w-6 h-6 accent-indigo-600" disabled={selectedMainPkg === 'vip'} />
                        <div>
                          <h4 className="font-bold text-slate-800">{musicAddon.name}</h4>
                          <p className="text-xs text-slate-500">{musicAddon.description}</p>
                        </div>
                    </div>
                    <span className="font-bold text-slate-700">{selectedMainPkg === 'vip' ? 'Pakete Dahil' : `+${musicAddon.price} ₺`}</span>
                  </label>
                </div>
             </div>

             {/* SAĞ: SİPARİŞ ÖZETİ */}
             <div className="bg-slate-900 text-white p-8 rounded-3xl h-max sticky top-24 shadow-2xl">
                <h3 className="text-2xl font-bold mb-6 border-b border-slate-700 pb-4">Sipariş Özeti</h3>
                <div className="space-y-4 text-base font-medium text-slate-300">
                   
                   <div className="flex justify-between items-center text-white">
                      <span>{selectedMainPkg === 'vip' ? vipPkg.name : selectedMainPkg === 'premium' ? premiumPkg.name : standartPkg.name}</span>
                      <span className="font-bold">{selectedMainPkg === 'vip' ? vipPkg.price : selectedMainPkg === 'premium' ? premiumPkg.price : standartPkg.price} ₺</span>
                   </div>

                   {selectedMainPkg === 'standart' && selectedAddons.includes('lcv') && (
                     <div className="flex justify-between text-sm text-slate-400"><span>+ {lcvAddon.name}</span><span>+{lcvAddon.price} ₺</span></div>
                   )}
                   {selectedMainPkg !== 'vip' && selectedAddons.includes('gallery') && (
                     <div className="flex justify-between text-sm text-slate-400"><span>+ {galleryAddon.name}</span><span>+{galleryAddon.price} ₺</span></div>
                   )}
                   {selectedMainPkg !== 'vip' && selectedAddons.includes('music') && (
                     <div className="flex justify-between text-sm text-slate-400"><span>+ {musicAddon.name}</span><span>+{musicAddon.price} ₺</span></div>
                   )}

                </div>
                
                <div className="border-t border-slate-700 mt-8 pt-8 flex justify-between items-center">
                   <span className="text-xl text-slate-400">Toplam</span>
                   <span className="text-4xl font-black text-white">{calculateTotal()} ₺</span>
                </div>

                <button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-xl font-black mt-8 shadow-lg transition-colors text-lg flex justify-center items-center gap-2">
                   {isSubmitting ? (
                     <>Sistem Hazırlanıyor <span className="animate-spin text-xl">↻</span></>
                   ) : (
                     'Siparişi Tamamla →'
                   )}
                </button>
                <p className="text-center text-xs text-slate-500 mt-4">Güvenli ve şifreli altyapı.</p>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function InvitationFormWrapper() {
  return (
    <Suspense fallback={<div className="text-center p-10 font-bold text-slate-500">Form yükleniyor...</div>}>
      <FormContent />
    </Suspense>
  );
}