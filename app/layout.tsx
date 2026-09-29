import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";

export const metadata: Metadata = {
  title: "KBRANDMUSIC — Wear The Sound",
  description:
    "KBRANDMUSIC — streetwear where music, identity and culture meet. Discover the signature tee and the latest drops.",
  metadataBase: new URL("https://kbrandmusisc.com"),
  openGraph: {
    type: "website",
    siteName: "KBRANDMUSIC",
    title: "KBRANDMUSIC — Wear The Sound",
    description: "Streetwear where music, identity and culture meet.",
    images: ["/images/hero.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "KBRANDMUSIC — Wear The Sound",
    description: "Streetwear where music, identity and culture meet.",
    images: ["/images/hero.jpg"],
  },
  icons: {
    icon: "/images/logo.jpg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <CartProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
