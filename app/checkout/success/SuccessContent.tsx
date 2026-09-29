"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";

type Verification = { orderId: number; email: string };

export default function SuccessContent({ sessionId }: { sessionId: string }) {
  const { clear } = useCart();
  const [order, setOrder] = useState<Verification | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setError("There is no checkout session to confirm.");
      return;
    }
    let active = true;
    fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (response) => {
        const result: Verification | { error: string } = await response.json();
        if (!response.ok) throw new Error("error" in result ? result.error : "Order verification failed.");
        return result as Verification;
      })
      .then((verifiedOrder) => {
        if (!active) return;
        setOrder(verifiedOrder);
        clear();
      })
      .catch((verificationError) => {
        if (active) setError(verificationError instanceof Error ? verificationError.message : "Order verification failed.");
      });
    return () => {
      active = false;
    };
  }, [clear, sessionId]);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-24 text-center">
        <h1 className="font-display text-4xl mb-4">Order Not Confirmed</h1>
        <p role="alert" className="text-muted mb-8">{error}</p>
        <Link href="/cart" className="btn btn-outline mr-3">Return to Cart</Link>
        <Link href="/shop" className="btn btn-solid">Continue Shopping</Link>
      </div>
    );
  }

  if (!order) {
    return <div className="max-w-2xl mx-auto px-5 py-24 text-center text-muted" role="status">Verifying your payment…</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-24 text-center">
      <h1 className="font-display text-4xl mb-4">Order Confirmed</h1>
      <p className="text-muted mb-2">Your KBRANDMUSIC order #{order.orderId} has been paid.</p>
      <p className="text-muted mb-8">Your order is recorded for {order.email}.</p>
      <Link href="/shop" className="btn btn-solid">Continue Shopping</Link>
    </div>
  );
}
