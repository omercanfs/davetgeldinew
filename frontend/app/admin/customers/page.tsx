"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Backend'den tüm kullanıcıları ve onlara ait davetiyeleri çeken istek
    fetch("http://127.0.0.1:3000/users")
      .then(res => res.json())
      .then(data => {
        setCustomers(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Müşteriler çekilemedi:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Müşteri Yönetimi</h1>
        <p className="text-slate-500 mt-2">Sisteme kayıtlı tüm müşterileri ve hesap hareketlerini görüntüleyin.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-widest text-slate-400 font-bold">
                <th className="p-6">Müşteri Bilgisi</th>
                <th className="p-6">Kayıt Tarihi</th>
                <th className="p-6">Rol</th>
                <th className="p-6 text-center">Davetiye Sayısı</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-500 font-bold">Yükleniyor...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-500 font-bold">Henüz müşteri bulunmuyor.</td></tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                          {customer.fullName ? customer.fullName.charAt(0).toUpperCase() : "M"}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{customer.fullName}</div>
                          <div className="text-sm text-slate-500">{customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-sm text-slate-600">
                      {new Date(customer.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${customer.role === 'ADMIN' ? 'bg-slate-900 text-white' : 'bg-blue-50 text-blue-600'}`}>
                        {customer.role === 'ADMIN' ? 'Yönetici' : 'Müşteri'}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      {customer.invitations && customer.invitations.length > 0 ? (
                        <Link 
                          href={`/admin/invitations?kullanici=${customer.id}`} 
                          className="bg-indigo-100 hover:bg-indigo-600 text-indigo-700 hover:text-white px-4 py-1.5 rounded-full font-bold text-sm transition-colors inline-block shadow-sm"
                        >
                          {customer.invitations.length} Davetiye →
                        </Link>
                      ) : (
                        <span className="bg-slate-100 text-slate-400 px-4 py-1.5 rounded-full font-bold text-sm inline-block">
                          0 Davetiye
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}