"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";

export default function Nav() {
  const { count } = useCart();
  const [logo, setLogo] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => setLogo(s?.logoImg))
      .catch(() => {});
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-bg/90 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          {logo && <img src={logo} alt="KBRANDMUSIC logo" className="h-7 invert" />}
          <span className="font-display text-lg">KBRANDMUSIC</span>
        </Link>
        <div className="hidden md:flex gap-7 text-xs uppercase tracking-wider font-semibold">
          <Link href="/shop" className="opacity-85 hover:opacity-100">Shop</Link>
          <Link href="/about" className="opacity-85 hover:opacity-100">About</Link>
          <Link href="/contact" className="opacity-85 hover:opacity-100">Contact</Link>
        </div>
        <div className="flex items-center gap-1">
          <Link href="/cart" className="relative flex h-11 w-11 items-center justify-center" aria-label="Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6h15l-1.5 9h-12z" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /><path d="M6 6L4 2H2" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-fg text-bg text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button
            className="md:hidden flex h-11 w-11 items-center justify-center"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>
      <div id="mobile-navigation" className={`${open ? "flex" : "hidden"} md:hidden flex-col px-5 pb-3 border-b border-line text-sm uppercase font-semibold`}>
        <Link className="flex min-h-11 items-center py-2" href="/shop" onClick={() => setOpen(false)}>Shop</Link>
        <Link className="flex min-h-11 items-center py-2" href="/about" onClick={() => setOpen(false)}>About</Link>
        <Link className="flex min-h-11 items-center py-2" href="/contact" onClick={() => setOpen(false)}>Contact</Link>
      </div>
    </nav>
  );
}
