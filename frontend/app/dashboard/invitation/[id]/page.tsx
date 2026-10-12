"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function InvitationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id; 

  const [invitation, setInvitation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [addonConfirm, setAddonConfirm] = useState<{ type: string; price: number; name: string } | null>(null);
  
  const [editForm, setEditForm] = useState({ 
    brideName: "", groomName: "", eventDate: "", eventTime: "",
    eventLocationName: "", eventAddress: "", eventMapsUrl: "",
    storyTitle: "", storyText: "",
    giftMessage: "", bankAccountName: "", bankIban: "",
    milestones: [] as any[], 
    eventStops: [] as any[]
  });
  
  const [musicUrl, setMusicUrl] = useState("");

  const showNotification = (message: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const formatDateForInput = (isoString: string) => {
    if (!isoString) return "";
    try { return new Date(isoString).toISOString().split('T')[0]; } 
    catch(e) { return ""; }
  };

  const fetchInvitation = () => {
    const token = localStorage.getItem("davetgeldi_token");
    if (!token) return router.push("/login");

    fetch(`http://127.0.0.1:3000/invitations/${id}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setInvitation(data);
        
        let parsedBank: any = {};
        if (data.bankMessage) {
          try { parsedBank = JSON.parse(data.bankMessage); } catch(e) {}
        }
        
        setEditForm({ 
          brideName: data.brideName || "", 
          groomName: data.groomName || "", 
          eventDate: formatDateForInput(data.eventDate),
          eventTime: data.eventDate && data.eventDate.includes('T') ? new Date(data.eventDate).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'}) : "",
          
          eventLocationName: data.locationName || "", 
          eventAddress: data.fullAddress || "", 
          eventMapsUrl: data.mapCoordinates || "", 
          
          storyTitle: data.welcomeMessage || "",
          storyText: data.storyContent || "",
          
          giftMessage: parsedBank.giftMessage || "", 
          bankAccountName: parsedBank.bankAccountName || "", 
          bankIban: parsedBank.bankIban || "", 
          
          milestones: (data.milestones || []).map((m: any) => ({ ...m, date: formatDateForInput(m.date) })), 
          eventStops: (data.eventStops || []).map((s: any) => ({
            ...s,
            date: formatDateForInput(s.date),
            time: s.timeString || s.time || "",
            location: s.locationName || s.location || ""
          }))
        });
        setMusicUrl(data.musicUrl || "");
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Detaylar çekilemedi", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (id) fetchInvitation();
  }, [id, router]);

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">Davetiye Detayları Yükleniyor...</div>;
  if (!invitation) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-red-500">Davetiye bulunamadı.</div>;

  const addons = invitation.addons || [];
  const packageName = (invitation.package?.name || "").toLowerCase();
  
  const isVipElite = invitation.isPremium === true || packageName.includes("vip") || packageName.includes("elite") || packageName.includes("premium");
  const isPremium = packageName.includes("premium");

  const hasLcv = isVipElite || isPremium || addons.includes("lcv");
  const hasGallery = isVipElite || addons.includes("gallery");
  const hasMusic = isVipElite || addons.includes("music");

  const categoryName = (invitation.category?.name || "Düğün").toLowerCase();
  let labelPerson1 = "Gelin / 1. Kişi Adı";
  let labelPerson2 = "Damat / 2. Kişi Adı (Opsiyonel)";
  let isPerson2Optional = true;

  if (categoryName.includes("doğum") || categoryName.includes("dogum")) {
    labelPerson1 = "Doğum Günü Kişisi";
    labelPerson2 = "İkinci Kişi (İkizler Vb. Opsiyonel)";
  } else if (categoryName.includes("sünnet") || categoryName.includes("sunnet")) {
    labelPerson1 = "Çocuğun Adı Soyadı";
    labelPerson2 = "Aile Adı (Örn: Yılmaz Ailesi)";
  } else if (categoryName.includes("kurumsal") || categoryName.includes("toplantı") || categoryName.includes("parti")) {
    labelPerson1 = "Kurum / Etkinlik Sahibi";
    labelPerson2 = "İkinci Düzenleyici (Opsiyonel)";
  } else if (categoryName.includes("düğün") || categoryName.includes("nişan") || categoryName.includes("kına")) {
    labelPerson1 = "Gelin Adı";
    labelPerson2 = "Damat Adı";
    isPerson2Optional = false;
  }

  const addStop = () => setEditForm({ ...editForm, eventStops: [...editForm.eventStops, { title: "", date: "", time: "", location: "", address: "" }] });
  const updateStop = (index: number, field: string, value: string) => {
    const newStops = [...editForm.eventStops];
    newStops[index][field] = value;
    setEditForm({ ...editForm, eventStops: newStops });
  };
  const removeStop = (index: number) => setEditForm({ ...editForm, eventStops: editForm.eventStops.filter((_, i) => i !== index) });

  const addMilestone = () => setEditForm({ ...editForm, milestones: [...editForm.milestones, { title: "", date: "", description: "" }] });
  const updateMilestone = (index: number, field: string, value: string) => {
    const newM = [...editForm.milestones];
    newM[index][field] = value;
    setEditForm({ ...editForm, milestones: newM });
  };
  const removeMilestone = (index: number) => setEditForm({ ...editForm, milestones: editForm.milestones.filter((_, i) => i !== index) });

  const handleUpdateInfo = async () => {
    if (!editForm.brideName || !editForm.eventDate) {
      showNotification("Lütfen temel alanları (Kişi Adı ve Tarih) doldurun.", "error");
      return;
    }

    const token = localStorage.getItem("davetgeldi_token");
    try {
      const res = await fetch(`http://127.0.0.1:3000/invitations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          brideName: editForm.brideName,
          groomName: editForm.groomName,
          eventDate: new Date(`${editForm.eventDate}T${editForm.eventTime || "12:00"}:00`).toISOString(),
          
          locationName: editForm.eventLocationName, 
          fullAddress: editForm.eventAddress, 
          mapCoordinates: editForm.eventMapsUrl, 
          
          welcomeMessage: editForm.storyTitle, 
          storyContent: editForm.storyText, 
          
          bankMessage: JSON.stringify({
            giftMessage: editForm.giftMessage,
            bankAccountName: editForm.bankAccountName,
            bankIban: editForm.bankIban
          }),
          
          milestones: editForm.milestones,
          eventStops: editForm.eventStops,
        })
      });

      if (res.ok) {
        setIsEditing(false);
        fetchInvitation();
        showNotification("Davetiye bilgileri başarıyla güncellendi!", "success");
      } else {
        const errorData = await res.json();
        showNotification(`Güncelleme başarısız: ${errorData.message || "Bilinmeyen Hata"}`, "error");
      }
    } catch (e) { showNotification("Sunucu bağlantı hatası.", "error"); }
  };

  const handleConfirmAddon = async () => {
    if (!addonConfirm) return;
    const token = localStorage.getItem("davetgeldi_token");
    const newAddons = [...addons, addonConfirm.type];
    const newPrice = (invitation.totalPrice || 0) + addonConfirm.price;

    try {
      const res = await fetch(`http://127.0.0.1:3000/invitations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ addons: newAddons, totalPrice: newPrice, status: "PENDING_PAYMENT" })
      });
      if (res.ok) {
        setAddonConfirm(null);
        showNotification(`${addonConfirm.name} eklentisi başarıyla eklendi!`, "success");
        fetchInvitation(); 
        setShowPaymentModal(true); 
      } else {
        showNotification("Eklenti satın alınırken bir hata oluştu.", "error");
        setAddonConfirm(null);
      }
    } catch (e) { showNotification("Sunucu hatası oluştu.", "error"); setAddonConfirm(null); }
  };

  const handleSaveMusic = async () => {
    const token = localStorage.getItem("davetgeldi_token");
    try {
      const res = await fetch(`http://127.0.0.1:3000/invitations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ musicUrl })
      });
      if (res.ok) showNotification("Arka plan müziği başarıyla kaydedildi!", "success");
    } catch (e) { showNotification("Sunucu bağlantı hatası.", "error"); }
  };

  // --- GERÇEK RESİM YÜKLEME VE SİLME FONKSİYONLARI ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    const token = localStorage.getItem("davetgeldi_token");
    try {
      showNotification("Fotoğraflar yükleniyor, lütfen bekleyin...", "info");
      const res = await fetch(`http://127.0.0.1:3000/invitations/${id}/gallery`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }, // Form-Data'da Content-Type eklenmez!
        body: formData
      });

      if (res.ok) {
        showNotification("Fotoğraflar başarıyla yüklendi!", "success");
        fetchInvitation(); 
      } else {
        showNotification("Fotoğraf yükleme başarısız oldu.", "error");
      }
    } catch (err) {
      showNotification("Sunucu bağlantı hatası.", "error");
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm("Bu fotoğrafı galeriden silmek istediğinize emin misiniz?")) return;
    const token = localStorage.getItem("davetgeldi_token");
    try {
      const res = await fetch(`http://127.0.0.1:3000/invitations/gallery/${imageId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        showNotification("Fotoğraf başarıyla silindi.", "success");
        fetchInvitation();
      }
    } catch (err) {
      showNotification("Silme işlemi başarısız.", "error");
    }
  };

  const handlePaymentNotify = () => {
    showNotification("Ödeme bildiriminiz alındı! Yöneticilerimiz en kısa sürede onaylayacaktır.", "success");
    setShowPaymentModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 relative">
      
      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-down">
          <div className={`px-6 py-3 rounded-full shadow-lg font-bold text-sm flex items-center gap-2 ${notification.type === 'success' ? 'bg-emerald-500 text-white' : notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>
            {notification.message}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8 pb-32">
        
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-slate-500 hover:text-slate-900 font-bold flex items-center gap-2 transition-colors">
            ← Panele Dön
          </Link>
          {!isEditing && (
            <a href={`/${invitation.slug}`} target="_blank" className="bg-white border border-slate-200 text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
              Davetiyeyi Görüntüle ↗
            </a>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-8 animate-fade-in-up">
            
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40">
              <h2 className="text-2xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4">1. Temel Bilgiler</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    {labelPerson1} <span className="text-red-500">*</span>
                  </label>
                  <input type="text" value={editForm.brideName} onChange={e => setEditForm({...editForm, brideName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    {labelPerson2} {!isPerson2Optional && <span className="text-red-500">*</span>}
                  </label>
                  <input type="text" value={editForm.groomName} onChange={e => setEditForm({...editForm, groomName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Ana Tarih <span className="text-red-500">*</span></label>
                  <input type="date" value={editForm.eventDate} onChange={e => setEditForm({...editForm, eventDate: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Başlangıç Saati</label>
                  <input type="time" value={editForm.eventTime} onChange={e => setEditForm({...editForm, eventTime: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40">
              <h2 className="text-2xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4">2. Mekan ve Adres</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Ana Mekan Adı</label>
                  <input type="text" value={editForm.eventLocationName} onChange={e => setEditForm({...editForm, eventLocationName: e.target.value})} placeholder="Örn: La Vie Jardin" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Açık Adres</label>
                    <textarea value={editForm.eventAddress} onChange={e => setEditForm({...editForm, eventAddress: e.target.value})} placeholder="Açık adres..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-24 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Google Haritalar Linki</label>
                    <textarea value={editForm.eventMapsUrl} onChange={e => setEditForm({...editForm, eventMapsUrl: e.target.value})} placeholder="https://maps.app.goo.gl/..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-24 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40">
              <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-black text-slate-900">3. Program Akışı ve Duraklar</h2>
                <button onClick={addStop} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">+ Yeni Durak Ekle</button>
              </div>
              <div className="space-y-6">
                {editForm.eventStops.map((stop, idx) => (
                  <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative group">
                    <button onClick={() => removeStop(idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 font-bold text-sm bg-white px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">Sil</button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Durak Adı</label>
                        <input type="text" value={stop.title} onChange={e => updateStop(idx, "title", e.target.value)} placeholder="Örn: Kına Gecesi" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tarih</label>
                        <input type="date" value={stop.date} onChange={e => updateStop(idx, "date", e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Saat</label>
                        <input type="time" value={stop.time} onChange={e => updateStop(idx, "time", e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Mekan</label>
                        <input type="text" value={stop.location} onChange={e => updateStop(idx, "location", e.target.value)} placeholder="Mekan Adı" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Adres</label>
                        <input type="text" value={stop.address} onChange={e => updateStop(idx, "address", e.target.value)} placeholder="Açık Adres" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                    </div>
                  </div>
                ))}
                {editForm.eventStops.length === 0 && <p className="text-slate-400 text-center italic text-sm">Henüz bir durak eklenmedi.</p>}
              </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40">
              <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-black text-slate-900">4. Hikaye & Dönüm Noktaları</h2>
                <button onClick={addMilestone} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">+ Dönüm Noktası Ekle</button>
              </div>
              <div className="space-y-6 mb-8">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Genel Hikaye Başlığı</label>
                    <input type="text" value={editForm.storyTitle} onChange={e => setEditForm({...editForm, storyTitle: e.target.value})} placeholder="Örn: Birlikte Büyüyen Hikayemiz" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Genel Hikaye Metni</label>
                    <textarea value={editForm.storyText} onChange={e => setEditForm({...editForm, storyText: e.target.value})} placeholder="Hikayemiz şöyle başladı..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-24 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"></textarea>
                  </div>
              </div>
              <div className="space-y-4">
                {editForm.milestones.map((ms, idx) => (
                  <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative group flex flex-col md:flex-row gap-4">
                     <button onClick={() => removeMilestone(idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 font-bold text-sm bg-white px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10">Sil</button>
                     <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Dönüm Noktası (Başlık)</label>
                        <input type="text" value={ms.title} onChange={e => updateMilestone(idx, "title", e.target.value)} placeholder="İlk Tanışma" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                     </div>
                     <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tarih</label>
                        <input type="date" value={ms.date} onChange={e => updateMilestone(idx, "date", e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                     </div>
                     <div className="flex-[2]">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Kısa Açıklama</label>
                        <input type="text" value={ms.description} onChange={e => updateMilestone(idx, "description", e.target.value)} placeholder="Göz göze geldiğimiz o ilk an..." className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                     </div>
                  </div>
                ))}
                 {editForm.milestones.length === 0 && <p className="text-slate-400 text-center italic text-sm">Henüz bir dönüm noktası eklenmedi.</p>}
              </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40">
              <h2 className="text-2xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4">5. Hediye & Banka Bilgileri (Opsiyonel)</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Hediye / Banka Mesajınız</label>
                  <input type="text" value={editForm.giftMessage} onChange={e => setEditForm({...editForm, giftMessage: e.target.value})} placeholder="Hediyeniz bizim için çok değerli." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Hesap Sahibi Ad Soyad</label>
                    <input type="text" value={editForm.bankAccountName} onChange={e => setEditForm({...editForm, bankAccountName: e.target.value})} placeholder="Örn: Levent Yılmaz" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">IBAN Numarası</label>
                    <input type="text" value={editForm.bankIban} onChange={e => setEditForm({...editForm, bankIban: e.target.value})} placeholder="TR..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          
          <>
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-md text-xs font-bold border border-indigo-100 flex items-center gap-1.5">
                    🏷️ {invitation.category?.name || "Kategori Yok"}
                  </span>
                  <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider">{invitation.package?.name || "Özel Paket"}</span>
                  {invitation.status === 'PENDING_PAYMENT' && <span className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-md text-xs font-bold">Ödeme Bekleniyor</span>}
                  {invitation.status === 'ACTIVE' && <span className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-md text-xs font-bold">Yayında</span>}
                </div>
                
                <h1 className="text-4xl font-black text-slate-900">{invitation.brideName} {invitation.groomName ? `& ${invitation.groomName}` : ""}</h1>
                <p className="text-slate-500 mt-2 font-medium">Tarih: {invitation.eventDate ? new Date(invitation.eventDate).toLocaleDateString('tr-TR') : "Tarih Yok"}</p>
              </div>

              <div className="flex flex-col gap-3">
                {invitation.status === 'PENDING_PAYMENT' && (
                  <button onClick={() => setShowPaymentModal(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-all hover:-translate-y-1 animate-pulse">
                    💳 Ödemeyi Tamamla ({invitation.totalPrice} ₺)
                  </button>
                )}
                <button onClick={() => setIsEditing(true)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-colors shadow-lg">
                  ✏️ Tüm Bilgileri Düzenle
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">📋 LCV Katılımcı Listesi</h2>
                    {hasLcv && <button onClick={() => showNotification("Excel aktarımı yakında aktif edilecek.", "info")} className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors">Excel'e Aktar</button>}
                  </div>

                  {hasLcv ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-xs text-slate-500 uppercase font-bold border-b border-slate-100">
                            <th className="p-4 rounded-tl-xl">Misafir Adı</th>
                            <th className="p-4">Kişi Sayısı</th>
                            <th className="p-4">Durum</th>
                            <th className="p-4 rounded-tr-xl">Not / İstek</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          <tr><td colSpan={4} className="p-8 text-center text-slate-400 font-medium">Henüz kayıt bırakan misafiriniz yok.</td></tr>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-2xl p-8 text-center border border-dashed border-slate-300">
                      <div className="text-4xl mb-3">🔒</div>
                      <h3 className="text-lg font-bold text-slate-800">LCV Modülü Aktif Değil</h3>
                      <p className="text-sm text-slate-500 mt-2 mb-6 max-w-md mx-auto">Misafirlerinizin katılımlarını takip etmek için bu eklentiyi aktifleştirin.</p>
                      <button onClick={() => setAddonConfirm({ type: 'lcv', price: 150, name: 'LCV Katılım Modülü' })} className="bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-slate-800 transition-colors">
                        + LCV Ekle (150 ₺)
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">🖼️ Fotoğraf Galerisi</h2>
                  {hasGallery ? (
                    <div className="space-y-4">
                      {/* DOSYA SEÇME ALANI - YENİ ONCHANGE EKLENDİ */}
                      <label className="bg-slate-50 rounded-xl p-6 text-center border border-dashed border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer block">
                        <span className="text-2xl block mb-2">📸</span>
                        <span className="text-sm font-bold text-indigo-600">Fotoğraf Seç (Yükle)</span>
                        <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </label>

                      {/* YÜKLENEN FOTOĞRAFLARIN LİSTELENMESİ */}
                      {invitation.gallery && invitation.gallery.length > 0 && (
                        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                          {invitation.gallery.map((img: any) => (
                            <div key={img.id} className="relative aspect-square bg-slate-200 rounded-xl overflow-hidden group shadow-sm">
                              <img src={img.imageUrl} alt="Galeri" className="w-full h-full object-cover" />
                              <button 
                                onClick={() => handleDeleteImage(img.id)} 
                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                title="Fotoğrafı Sil"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-xs text-slate-500 mb-4">Davetiyenize en güzel anılarınızı ekleyin.</p>
                      <button onClick={() => setAddonConfirm({ type: 'gallery', price: 200, name: 'Fotoğraf Galerisi' })} className="w-full bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">+ Galeri Ekle (200 ₺)</button>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">🎵 Arka Plan Müziği</h2>
                  {hasMusic ? (
                    <div>
                      <input type="text" placeholder="YouTube Linki Yapıştır" value={musicUrl} onChange={(e) => setMusicUrl(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-all mb-3" />
                      <button onClick={handleSaveMusic} className="w-full bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors">Müziği Kaydet</button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-xs text-slate-500 mb-4">Davetiyeniz açıldığında favori şarkınız çalsın.</p>
                      <button onClick={() => setAddonConfirm({ type: 'music', price: 50, name: 'Özel Arka Plan Müziği' })} className="w-full bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">+ Müzik Ekle (50 ₺)</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {isEditing && (
        <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] animate-fade-in-up">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <p className="hidden md:block text-sm font-bold text-slate-500">Değişiklikleri yaptıktan sonra kaydetmeyi unutmayın.</p>
            <div className="flex gap-4 w-full md:w-auto">
              <button onClick={() => setIsEditing(false)} className="flex-1 md:flex-none px-8 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">İptal Et</button>
              <button onClick={handleUpdateInfo} className="flex-1 md:flex-none px-10 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-1">Değişiklikleri Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {addonConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative animate-fade-in-up">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto">✨</div>
            <h3 className="text-xl font-black text-slate-900 mb-2 text-center">Özelliği Aktifleştir</h3>
            <p className="text-slate-600 text-sm mb-6 text-center">
              <strong>{addonConfirm.name}</strong> özelliğini {addonConfirm.price} ₺ karşılığında davetiyenize eklemek istiyor musunuz? Davetiyeniz kısa süreliğine tekrar ödeme onayına düşecektir.
            </p>
            <div className="flex flex-col gap-2">
              <button onClick={handleConfirmAddon} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                Onayla ve Ödemeye Geç
              </button>
              <button onClick={() => setAddonConfirm(null)} className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                İptal Et
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl relative animate-fade-in-up">
            <button onClick={() => setShowPaymentModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 text-xl">✕</button>
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl mb-6">💸</div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Ödemeyi Tamamla</h3>
            <p className="text-slate-600 text-sm mb-6">Siparişinizin yayına alınması için aşağıdaki IBAN hesabına <strong>{invitation.totalPrice} ₺</strong> tutarında ödeme yapmanız gerekmektedir.</p>
            
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
              <p className="text-xs text-slate-500 font-bold uppercase mb-1">Banka Bilgileri</p>
              <p className="font-bold text-slate-800 text-lg">TR12 3456 7890 1234 5678 9012 34</p>
              <p className="text-sm text-slate-600 mt-1">Alıcı: FUSWO Yazılım ve E-Ticaret Ltd. Şti.</p>
              <p className="text-xs text-amber-600 mt-2 font-medium">Açıklama: {invitation.slug}</p>
            </div>

            <button onClick={handlePaymentNotify} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
              Ödemeyi Yaptım, Onaya Gönder
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-down { 0% { opacity: 0; transform: translate(-50%, -20px); } 100% { opacity: 1; transform: translate(-50%, 0); } }
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-down { animation: fade-in-down 0.3s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
      `}} />
    </div>
  );
}