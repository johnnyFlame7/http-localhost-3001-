"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  image: string;
  size: string;
  qty: number;
};

const MAX_QUANTITY = 99;

function readStoredItems(): CartItem[] {
  const stored = localStorage.getItem("kb_cart");
  if (!stored) return [];

  const parsed: unknown = JSON.parse(stored);
  if (!Array.isArray(parsed)) throw new Error("Saved cart data is invalid.");

  return parsed.filter((item): item is CartItem =>
    item !== null &&
    typeof item === "object" &&
    Number.isInteger(item.productId) &&
    typeof item.name === "string" &&
    Number.isFinite(item.price) &&
    typeof item.image === "string" &&
    typeof item.size === "string" &&
    Number.isInteger(item.qty) &&
    item.qty > 0 &&
    item.qty <= MAX_QUANTITY
  );
}

type CartCtx = {
  items: CartItem[];
  add: (item: CartItem) => void;
  updateQty: (productId: number, size: string, qty: number) => void;
  remove: (productId: number, size: string) => void;
  clear: () => void;
  count: number;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      setItems(readStoredItems());
    } catch (error) {
      console.error("Unable to restore the saved cart.", error);
      try {
        localStorage.removeItem("kb_cart");
      } catch (storageError) {
        console.error("Unable to clear invalid saved cart data.", storageError);
      }
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem("kb_cart", JSON.stringify(items));
    } catch (error) {
      console.error("Unable to save the cart in this browser.", error);
    }
  }, [items, loaded]);

  function add(item: CartItem) {
    if (!item.size) throw new Error("Choose a size before adding this item to your cart.");
    if (!Number.isInteger(item.qty) || item.qty < 1 || item.qty > MAX_QUANTITY) {
      throw new Error(`Choose a quantity between 1 and ${MAX_QUANTITY}.`);
    }
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId && i.size === item.size);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId && i.size === item.size
            ? { ...i, qty: Math.min(MAX_QUANTITY, i.qty + item.qty) }
            : i
        );
      }
      return [...prev, item];
    });
  }
  function updateQty(productId: number, size: string, qty: number) {
    if (!Number.isInteger(qty)) return;
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.size === size
          ? { ...i, qty: Math.min(MAX_QUANTITY, Math.max(1, qty)) }
          : i
      )
    );
  }
  function remove(productId: number, size: string) {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.size === size)));
  }
  const clear = useCallback(() => setItems([]), []);
  const count = items.reduce((a, i) => a + i.qty, 0);

  return <Ctx.Provider value={{ items, add, updateQty, remove, clear, count }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
