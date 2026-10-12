"use client";

import React from 'react';
import Link from 'next/link';

interface Theme {
  id: number;
  name: string;
  coverImage?: string;
  primaryColor?: string;
  icon?: string;
  categories?: { name: string }[];
}

interface ThemeCardProps {
  theme: Theme;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  showActions?: boolean; 
}

export default function ThemeCard({ theme, isSelected, onSelect, showActions = false }: ThemeCardProps) {
  const bgStyle = {
    backgroundColor: theme.primaryColor || '#ddd',
    backgroundImage: theme.coverImage ? `url(${theme.coverImage})` : `url('https://picsum.photos/seed/tema${theme.id}/600/400')`,
  };

  return (
    <div
      onClick={() => onSelect && onSelect(theme.id.toString())}
      className={`relative rounded-3xl overflow-hidden border-2 transition-all flex flex-col bg-white shadow-sm hover:shadow-md 
        ${onSelect ? 'cursor-pointer' : ''} 
        ${isSelected ? 'border-indigo-600 ring-4 ring-indigo-600/20 scale-[1.02]' : 'border-slate-200 hover:border-slate-300'}`}
    >
      <div className="h-48 w-full bg-cover bg-center relative" style={bgStyle}>
        <div className="absolute inset-0 bg-black/20"></div>
        {theme.categories && theme.categories.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[80%]">
            {theme.categories.map((cat, idx) => (
              <span key={idx} className="bg-white/90 backdrop-blur text-slate-800 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm truncate">
                {cat.name}
              </span>
            ))}
          </div>
        )}
        <span className="absolute top-3 right-3 text-xl bg-white/90 backdrop-blur p-2 rounded-2xl shadow-sm">
          {theme.icon || '✨'}
        </span>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-slate-800 text-lg">{theme.name}</h3>
          {onSelect && (
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors
              ${isSelected ? 'bg-indigo-600 text-white' : 'border border-slate-300 text-transparent'}`}>
              ✓
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 mb-4 line-clamp-2">Mükemmel tasarım çizgisi.</p>

        {showActions && (
          <div className="mt-auto grid grid-cols-2 gap-2">
            <Link href={`/olustur?tema=${theme.id}`} className="bg-indigo-50 text-indigo-600 text-center py-2 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors">
              Kullan
            </Link>
            <button onClick={(e) => { e.stopPropagation(); alert("Ön izleme eklenecek"); }} className="bg-slate-50 border border-slate-200 text-slate-600 text-center py-2 rounded-xl text-sm font-bold hover:bg-slate-100 transition-colors">
              Önizle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}