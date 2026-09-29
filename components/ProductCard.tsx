"use client";
import Link from "next/link";

export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  images?: string[];
  sizes: string;
  stock: boolean;
  tag: string | null;
};

export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link
      href={`/product/${p.id}`}
      className="block bg-card border border-line hover:border-neutral-500 transition group"
      aria-label={`View ${p.name} details`}
    >
        <div className="aspect-[3/4] overflow-hidden bg-black relative">
          {p.tag === "new" && (
            <span className="absolute top-2 left-2 bg-fg text-bg text-[10px] font-extrabold px-2 py-1 uppercase z-10">New</span>
          )}
          <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          {!p.stock && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs font-bold uppercase tracking-widest">
              Sold Out
            </span>
          )}
        </div>
      <div className="p-3.5">
        <div className="text-[11px] uppercase tracking-wide text-muted">{p.category}</div>
        <p className="font-bold text-sm mt-1 mb-1">{p.name}</p>
        <div className="text-[11px] text-muted">Sizes: {p.sizes.split(",").join(" / ")}</div>
        <div className="flex justify-between items-center mt-2.5">
          <span className="font-extrabold">${p.price.toFixed(2)}</span>
          <span className="text-[11px] uppercase font-bold border border-line px-2.5 py-2 group-hover:bg-fg group-hover:text-bg transition">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
}
