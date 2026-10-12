"use client";

import React from 'react';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  icon: string;
  slug: string;
}

interface CategoryCardProps {
  category: Category;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  href?: string; 
}

export default function CategoryCard({ category, isSelected, onSelect, href }: CategoryCardProps) {
  const content = (
    <>
      <span className="text-4xl mb-3 block">{category.icon}</span>
      <span className="font-bold text-slate-800 text-lg">{category.name}</span>
    </>
  );

  const baseClasses = `p-6 rounded-3xl border-2 transition-all flex flex-col justify-center items-center text-center h-40 shadow-sm hover:shadow-md
    ${isSelected ? 'border-indigo-600 bg-indigo-50/50 scale-105' : 'border-slate-100 bg-white hover:border-indigo-300'}`;

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={() => onSelect && onSelect(category.id.toString())}
      className={`${baseClasses} w-full`}
    >
      {content}
    </button>
  );
}