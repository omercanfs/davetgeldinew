"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RsvpModal({ invitationId, isRsvpClosed }: { invitationId: number, isRsvpClosed?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [attendance, setAttendance] = useState("ATTENDING");
  const [guestCount, setGuestCount] = useState(0);
  const [message, setMessage] = useState("");
  const [mealPreference, setMealPreference] = useState("STANDART");
  const [hasChildren, setHasChildren] = useState(false);
  const [kvkkApproved, setKvkkApproved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kvkkApproved) return alert("Lütfen KVKK metnini onaylayın.");
    setIsSubmitting(true);
    try {
      await fetch("http://localhost:3000/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName, lastName, email, attendance, guestCount: Number(guestCount), message,
          mealPreference, hasChildren, kvkkApproved, invitationId,
        }),
      });
      setIsSuccess(true);
      router.refresh();
      setTimeout(() => { setIsOpen(false); setIsSuccess(false); }, 4000);
    } catch (error) {
      alert("Bir hata oluştu.");
    } finally { setIsSubmitting(false); }
  };

  if (isRsvpClosed) return <div className="bg-slate-100 text-slate-500 px-8 py-3 rounded-full font-bold text-sm inline-block">Kapasite Doldu / LCV Alımı Kapalı</div>;

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="bg-[#3b4033] text-[#fdfaf5] px-12 py-4 rounded-full font-bold tracking-widest text-sm hover:bg-[#2d3326] transition-colors uppercase">
        Katılımı Bildir
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-[#2d3326]/80 backdrop-blur-sm flex items-center justify-center p-4 z-[999] overflow-y-auto">
          <div className="bg-[#fdfaf5] rounded-none p-8 md:p-12 max-w-2xl w-full relative my-8">
            <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-[#8a9182] hover:text-[#3b4033] text-3xl font-light">×</button>
            
            {isSuccess ? (
              <div className="text-center py-16">
                <h3 className="text-4xl font-light text-[#3b4033] mb-4">Teşekkürler</h3>
                <p className="text-[#5c6356]">Yanıtınız bize ulaştı, sizi aramızda görmekten mutluluk duyacağız.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="text-left font-sans text-[#3b4033] space-y-6">
                <div className="text-center mb-8 border-b border-[#eae0d5] pb-6">
                  <p className="text-xs tracking-[0.3em] text-[#8a9182] mb-2 uppercase">Lütfen Doldurun</p>
                  <h2 className="text-3xl font-serif font-light">Katılım Durumu</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2">Adınız Soyadınız *</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-full bg-[#f4eee5] p-4 outline-none focus:ring-1 ring-[#3b4033]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2">E-Posta (Opsiyonel)</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#f4eee5] p-4 outline-none focus:ring-1 ring-[#3b4033]" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-2">Katılım Durumu</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button type="button" onClick={() => setAttendance("ATTENDING")} className={`p-4 border text-sm flex justify-center items-center gap-2 ${attendance === "ATTENDING" ? "bg-[#3b4033] text-white border-[#3b4033]" : "border-[#eae0d5]"}`}>
                      <div className={`w-3 h-3 rounded-full border ${attendance === "ATTENDING" ? "bg-white" : "border-[#8a9182]"}`}></div> Katılacağım
                    </button>
                    <button type="button" onClick={() => setAttendance("DECLINED")} className={`p-4 border text-sm flex justify-center items-center gap-2 ${attendance === "DECLINED" ? "bg-[#3b4033] text-white border-[#3b4033]" : "border-[#eae0d5]"}`}>
                      <div className={`w-3 h-3 rounded-full border ${attendance === "DECLINED" ? "bg-white" : "border-[#8a9182]"}`}></div> Katılamayacağım
                    </button>
                    <button type="button" onClick={() => setAttendance("PENDING")} className={`p-4 border text-sm flex justify-center items-center gap-2 ${attendance === "PENDING" ? "bg-[#3b4033] text-white border-[#3b4033]" : "border-[#eae0d5]"}`}>
                      <div className={`w-3 h-3 rounded-full border ${attendance === "PENDING" ? "bg-white" : "border-[#8a9182]"}`}></div> Belki
                    </button>
                  </div>
                </div>

                {attendance !== "DECLINED" && (
                  <>
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase mb-2">Yanınızda Gelecek Kişi Sayısı</label>
                      <select value={guestCount} onChange={(e) => setGuestCount(Number(e.target.value))} className="w-full bg-[#f4eee5] p-4 outline-none">
                        <option value={0}>0 (Sadece ben)</option>
                        <option value={1}>1 Kişi</option>
                        <option value={2}>2 Kişi</option>
                        <option value={3}>3+ Kişi</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase mb-2">Yemek Tercihiniz Var Mı?</label>
                      <select value={mealPreference} onChange={(e) => setMealPreference(e.target.value)} className="w-full bg-[#f4eee5] p-4 outline-none">
                        <option value="STANDART">Standart Menü</option>
                        <option value="VEJETARYEN">Vejetaryen Menü</option>
                        <option value="GLUTENSIZ">Glutensiz Menü</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase mb-2">Çocukla Katılacak Mısınız?</label>
                      <select value={hasChildren ? "EVET" : "HAYIR"} onChange={(e) => setHasChildren(e.target.value === "EVET")} className="w-full bg-[#f4eee5] p-4 outline-none">
                        <option value="HAYIR">Hayır</option>
                        <option value="EVET">Evet</option>
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-2">Mesajınız</label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Çifte küçük bir not bırakın" className="w-full bg-[#f4eee5] p-4 outline-none h-24 resize-none"></textarea>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={kvkkApproved} onChange={(e) => setKvkkApproved(e.target.checked)} className="w-5 h-5 accent-[#3b4033]" />
                  <span className="text-sm underline text-[#8a9182]">KVKK aydınlatma metnini okudum ve onaylıyorum.</span>
                </label>

                <button type="submit" disabled={isSubmitting} className="w-full bg-[#3b4033] hover:bg-[#2d3326] text-white p-5 font-bold tracking-widest uppercase mt-4 transition-colors">
                  {isSubmitting ? "GÖNDERİLİYOR..." : "GÖNDER"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}