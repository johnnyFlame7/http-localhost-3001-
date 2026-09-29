"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard, { Product } from "@/components/ProductCard";
import { STARTER_PRODUCTS } from "@/lib/catalog";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<any>(null);

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
    fetch("/api/settings").then((r) => r.json()).then(setSettings).catch(() => {});
  }, []);

  const featured = products.filter((p) => p.tag === "featured");
  const fresh = products.filter((p) => p.tag === "new");
  const galleryProductId = products[0]?.id ?? STARTER_PRODUCTS[0].id;
  const gallery = [
    { src: "/images/model_b.jpg", alt: "Model styling the KBRANDMUSIC signature tee", label: "Made To Move" },
    { src: "/images/model_c.jpg", alt: "Close-up of the KBRANDMUSIC signature tee", label: "Wear The Sound" },
  ];

  return (
    <div>
      <div className="relative min-h-[88vh] flex items-end bg-black">
        <img
          src={settings?.heroImg || "/images/hero.jpg"}
          alt="KBRANDMUSIC model wearing the signature logo tee"
          className="absolute inset-0 w-full h-full object-cover object-top opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-bg" />
        <div className="relative z-10 max-w-6xl mx-auto px-5 pb-14 pt-16 w-full">
          <h1 className="font-display leading-none mb-3" style={{ fontSize: "clamp(48px,13vw,120px)" }}>
            {(settings?.heroTitle || "KBRAND\\nMUSIC").split("\\n").map((l: string, i: number) => (
              <span key={i} className="block">{l}</span>
            ))}
          </h1>
          <p className="text-muted uppercase tracking-widest text-sm mb-6">{settings?.heroTagline}</p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/shop" className="btn btn-solid">Shop Now</Link>
            <Link href="/shop" className="btn btn-outline">Explore Collection</Link>
            <a
              href="https://www.instagram.com/kbrandmusisc/"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-5 py-16">
        <div className="flex justify-between items-baseline mb-7 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-muted font-bold">Selected</span>
            <h2 className="text-3xl md:text-4xl font-display mt-1">Featured Products</h2>
          </div>
          <Link href="/shop" className="text-xs font-bold uppercase border-b border-fg">View All →</Link>
        </div>
        <div className="grid grid-cols-1 min-[390px]:grid-cols-2 md:grid-cols-4 gap-4">
          {featured.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {fresh.length > 0 && <section className="max-w-6xl mx-auto px-5 pb-16">
        <div className="mb-7">
          <span className="text-xs uppercase tracking-widest text-muted font-bold">Just Dropped</span>
          <h2 className="text-3xl md:text-4xl font-display mt-1">New Collection</h2>
        </div>
        <div className="grid grid-cols-1 min-[390px]:grid-cols-2 md:grid-cols-4 gap-4">
          {fresh.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>}

      <section className="max-w-6xl mx-auto px-5 pb-16">
        <div className="flex justify-between items-baseline mb-7 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-muted font-bold">The Look</span>
            <h2 className="text-3xl md:text-4xl font-display mt-1">KBRANDMUSIC In Focus</h2>
          </div>
          <Link href="/shop" className="text-xs font-bold uppercase border-b border-fg">Shop Collection →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {gallery.map((image) => (
            <Link
              key={image.src}
              href={`/product/${galleryProductId}`}
              className="group block"
            >
              <div className="overflow-hidden bg-bg2">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full aspect-square object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <span className="mt-2 block text-xs uppercase tracking-widest text-muted">{image.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {settings?.storyImg && <img src={settings.storyImg} alt="Brand story" className="w-full aspect-[4/5] object-cover" />}
          <div>
            <span className="text-xs uppercase tracking-widest text-muted font-bold">Our Story</span>
            <h2 className="font-display mt-2 mb-4" style={{ fontSize: "clamp(30px,6vw,52px)" }}>MUSIC. IDENTITY.<br />STREETWEAR.</h2>
            <p className="text-neutral-300 leading-relaxed">
              {settings?.storyText || "KBRANDMUSIC brings music, identity, and streetwear together. Made to wear the sound and move in your own way."}
            </p>
            <Link href="/about" className="btn btn-outline mt-5 inline-flex">Read Our Story</Link>
          </div>
        </div>
      </section>

      {settings?.promoImg && (
        <div className="relative min-h-[55vh] flex items-center justify-center text-center bg-black">
          <img src={settings.promoImg} alt="Promo" className="absolute inset-0 w-full h-full object-cover object-top opacity-40" />
          <div className="relative z-10 px-5">
            <span className="text-xs uppercase tracking-widest text-muted font-bold">Signature Mark</span>
            <h2 className="font-display my-4" style={{ fontSize: "clamp(32px,7vw,64px)" }}>BUILT FOR THE CULTURE</h2>
            <Link href="/shop" className="btn btn-solid">Shop The Look</Link>
          </div>
        </div>
      )}

      <div className="bg-bg2 border-y border-line">
        <div className="max-w-6xl mx-auto px-5 py-14 flex flex-col items-center text-center gap-4">
          <h3 className="font-display text-3xl">Join The Movement</h3>
          <p className="text-muted">Discover the signature KBRANDMUSIC tee and wear the sound.</p>
          <Link href="/shop" className="btn btn-solid">Shop The Collection</Link>
        </div>
      </div>
    </div>
  );
}
