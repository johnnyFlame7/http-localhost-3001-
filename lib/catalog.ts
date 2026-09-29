import type { Product } from "@/components/ProductCard";

export const STARTER_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "KBRANDMUSIC Signature Tee",
    category: "T-Shirts",
    price: 38,
    description:
      "The signature KBRANDMUSIC mark on a clean white tee. Relaxed streetwear styling, made to wear on repeat.",
    image: "/images/hero.jpg",
    images: ["/images/hero.jpg", "/images/model_b.jpg", "/images/model_c.jpg"],
    sizes: "S,M,L,XL,XXL",
    stock: true,
    tag: "featured",
  },
];
