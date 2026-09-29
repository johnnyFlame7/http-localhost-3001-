"use client";
import { useEffect, useMemo, useState } from "react";
import ProductCard, { Product } from "@/components/ProductCard";
import Link from "next/link";
import { STARTER_PRODUCTS } from "@/lib/catalog";

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cat, setCat] = useState("All");

  useEffect(() => {
    fetch("/api/products")
      .then((response) => {
        if (!response.ok) throw new Error("Product catalogue is unavailable.");
        return response.json();
      })
      .then(setProducts)
      .catch((error) => {
        console.error("Unable to load products; showing the local starter catalogue.", error);
        setProducts(STARTER_PRODUCTS);
      });
  }, []);

  const cats = useMemo(() => ["All", ...Array.from(new Set(products.map((p) => p.category)))], [products]);
  const list = cat === "All" ? products : products.filter((p) => p.category === cat);

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <h1 className="font-display mb-8" style={{ fontSize: "clamp(34px,7vw,60px)" }}>Shop All</h1>
      <Link href="/cart" className="text-xs uppercase tracking-wider underline mb-6 inline-block">View Cart</Link>
      <div className="flex gap-2.5 flex-wrap mb-8">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-2 text-xs uppercase font-bold tracking-wide border ${c === cat ? "bg-fg text-bg border-fg" : "border-line text-muted"}`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 min-[390px]:grid-cols-2 md:grid-cols-4 gap-4">
        {list.map((p) => <ProductCard key={p.id} p={p} />)}
        {list.length === 0 && <p className="text-muted col-span-full">No products in this category yet.</p>}
      </div>
    </div>
  );
}
