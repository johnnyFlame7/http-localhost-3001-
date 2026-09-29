"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setSettings).catch(() => {});
  }, []);

  return (
    <footer className="border-t border-line pt-12 pb-8 mt-10">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-9">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              {settings?.logoImg && <img src={settings.logoImg} alt="KBRANDMUSIC" className="h-6 invert" />}
              <span className="font-display text-base">KBRANDMUSIC</span>
            </div>
            <p className="text-muted text-sm leading-relaxed">Music, identity and streetwear. Wear the sound.</p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wide text-muted mb-3">Shop</h4>
            <ul className="flex flex-col text-sm">
              <li><Link className="flex min-h-11 items-center py-2" href="/shop">All Products</Link></li>
              <li><Link className="flex min-h-11 items-center py-2" href="/legal/shipping">Shipping</Link></li>
              <li><Link className="flex min-h-11 items-center py-2" href="/legal/returns">Returns</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wide text-muted mb-3">Company</h4>
            <ul className="flex flex-col text-sm">
              <li><Link className="flex min-h-11 items-center py-2" href="/about">About</Link></li>
              <li><Link className="flex min-h-11 items-center py-2" href="/contact">Contact</Link></li>
              <li><a className="flex min-h-11 items-center py-2" href="mailto:keepingmusic1@gmail.com">Email Us</a></li>
              <li><Link className="flex min-h-11 items-center py-2" href="/legal/business">Business Info</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wide text-muted mb-3">Legal</h4>
            <ul className="flex flex-col text-sm">
              <li><Link className="flex min-h-11 items-center py-2" href="/legal/privacy">Privacy Policy</Link></li>
              <li><Link className="flex min-h-11 items-center py-2" href="/legal/terms">Terms & Conditions</Link></li>
              <li><Link className="flex min-h-11 items-center py-2" href="/legal/cookies">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex justify-between items-center flex-wrap gap-3 pt-6 border-t border-line text-xs text-muted">
          <span className="flex flex-wrap items-center gap-x-1">© {new Date().getFullYear()} KBRANDMUSIC. All rights reserved. · <Link href="/admin/login" className="inline-flex min-h-11 items-center underline">Owner Login</Link></span>
          <a
            href="https://www.instagram.com/kbrandmusisc/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center underline"
          >
            Follow @kbrandmusisc on Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
