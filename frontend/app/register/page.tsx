"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isCheckout = searchParams.get("checkout") === "true"; 

  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("davetgeldi_user")) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // 1. KULLANICIYI KAYDET
      const res = await fetch("http://127.0.0.1:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          passwordHash: formData.password, 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "Kayıt olurken bir hata oluştu.");
        setIsSubmitting(false);
        return;
      }

      const data = await res.json();
      
      // Kayıt Başarılı -> Tarayıcıya kaydet
      localStorage.setItem("davetgeldi_token", data.access_token);
      localStorage.setItem("davetgeldi_user", JSON.stringify(data.user));

      // 2. BEKLEYEN SİPARİŞİ KULLANICIYA AKTAR
      const pendingStr = localStorage.getItem("pending_invitation");
      if (pendingStr) {
        const pendingInvitation = JSON.parse(pendingStr);
        pendingInvitation.userId = data.user.id;

        const invRes = await fetch("http://127.0.0.1:3000/invitations", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${data.access_token}` // TOKEN BURADA GİDİYOR!
          },
          body: JSON.stringify(pendingInvitation)
        });

        if (invRes.ok) {
          localStorage.removeItem("pending_invitation"); 
        } else {
          console.error("Davetiye kaydedilirken yetki hatası oluştu.");
        }
      }

      router.push("/dashboard");
    } catch (err) {
      setError("Sunucuya bağlanılamadı. Lütfen tekrar deneyin.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="text-4xl font-black tracking-tighter text-slate-900 inline-block mb-4">
          DavetGeldi<span className="text-indigo-600">.</span>
        </Link>
        
        {isCheckout ? (
          <>
            <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mb-4 shadow-sm animate-bounce">✨</div>
            <h2 className="text-2xl font-bold text-slate-900">Tasarımınız Harika Oldu!</h2>
            <p className="mt-2 text-sm text-slate-600 font-medium">Davetiyenizi güvenle kaydetmek ve ödeme adımına geçmek için hesabınızı oluşturalım.</p>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-slate-900">Hesap Oluştur</h2>
            <p className="mt-2 text-sm text-slate-600">Hemen ücretsiz üye olun ve davetiyelerinizi yönetin.</p>
          </>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl shadow-indigo-100/50 sm:rounded-3xl sm:px-10 border border-slate-100">
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-bold text-center">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Ad Soyad</label>
              <input type="text" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="Örn: Levent Yılmaz" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">E-Posta Adresi</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="ornek@mail.com" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Şifre Belirleyin</label>
              <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="••••••••" />
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-600/30 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 transition-all hover:-translate-y-0.5">
              {isSubmitting ? "İşleniyor..." : (isCheckout ? "Kaydı Tamamla & Ödemeye Geç →" : "Ücretsiz Kayıt Ol")}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-slate-600">
            Zaten hesabınız var mı? <Link href={isCheckout ? "/login?checkout=true" : "/login"} className="text-indigo-600 hover:text-indigo-500 font-bold hover:underline">Giriş Yapın</Link>
          </div>
        </div>
      </div>
    </div>
  );
}