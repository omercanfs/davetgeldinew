"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm("Bu davetiyeyi silmek istediğinize emin misiniz?");
    if (!confirmed) return;

    await fetch(`http://localhost:3000/invitations/${id}`, {
      method: "DELETE",
    });
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:text-red-800 text-sm font-bold bg-red-50 hover:bg-red-100 px-4 py-2 rounded-md transition-colors whitespace-nowrap"
    >
      Sil
    </button>
  );
}