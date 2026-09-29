"use client";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { calculateShipping } from "@/lib/pricing";

export default function Cart() {
  const { items, updateQty, remove } = useCart();
  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <h1 className="font-display mb-8" style={{ fontSize: "clamp(34px,7vw,60px)" }}>Your Cart</h1>
      {items.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <p>Your cart is empty.</p>
          <Link href="/shop" className="btn btn-solid mt-4 inline-flex">Shop Now</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-[1.6fr_1fr] gap-9 items-start">
          <div>
            {items.map((c) => (
              <div key={c.productId + c.size} className="grid grid-cols-[72px_minmax(0,1fr)] sm:grid-cols-[88px_minmax(0,1fr)_auto] gap-3 sm:gap-4 items-center py-4 border-b border-line">
                <Link href={`/product/${c.productId}`} aria-label={`View ${c.name}`}>
                  <img src={c.image} alt={c.name} className="w-[72px] h-24 sm:w-[88px] sm:h-[110px] object-cover" />
                </Link>
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/product/${c.productId}`} className="min-w-0 break-words font-bold text-sm hover:underline">{c.name}</Link>
                    <div className="shrink-0 font-extrabold sm:hidden">${(c.price * c.qty).toFixed(2)}</div>
                  </div>
                  <div className="text-muted text-xs">Size: {c.size} · ${c.price.toFixed(2)}</div>
                  <div className="flex items-center border border-line w-fit mt-2">
                    <button aria-label={`Decrease ${c.name} quantity`} className="w-11 h-11" onClick={() => updateQty(c.productId, c.size, c.qty - 1)}>−</button>
                    <span className="w-8 text-center text-sm">{c.qty}</span>
                    <button aria-label={`Increase ${c.name} quantity`} className="w-11 h-11" onClick={() => updateQty(c.productId, c.size, c.qty + 1)}>+</button>
                  </div>
                  <button className="text-muted text-xs underline mt-2" onClick={() => remove(c.productId, c.size)}>Remove item</button>
                </div>
                <div className="hidden font-extrabold sm:block">${(c.price * c.qty).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="bg-card border border-line p-6">
            <div className="flex justify-between text-sm text-neutral-300 mb-3"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm text-neutral-300 mb-3"><span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
            <div className="flex justify-between text-lg font-extrabold pt-3.5 border-t border-line mb-5"><span>Total</span><span>${total.toFixed(2)}</span></div>
            <Link href="/checkout" className="btn btn-solid w-full">Proceed to Checkout</Link>
            <Link href="/shop" className="flex min-h-11 items-center justify-center text-xs uppercase underline mt-4">Continue Shopping</Link>
          </div>
        </div>
      )}
    </div>
  );
}
