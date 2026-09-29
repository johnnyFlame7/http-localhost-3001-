import Link from "next/link";

export const metadata = { title: "Shipping Policy — TheFlame" };

export default function ShippingPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-16">
      <h1 className="font-display text-4xl mb-8">Shipping Policy</h1>
      <div className="text-neutral-300 leading-relaxed space-y-5 text-sm">
        <h2 className="text-fg font-bold text-base">Shipping charges</h2>
        <p>
          Standard shipping is $8 USD. Shipping is free on orders of $100 USD or more. The applicable
          charge is included in the order total shown before you continue to payment.
        </p>
        <h2 className="text-fg font-bold text-base mt-6">Destinations and delivery estimates</h2>
        <p>
          Available delivery destinations and any applicable delivery estimate must be confirmed
          with the store before placing an order. Delivery times depend on the destination and
          carrier; no specific delivery timeframe is promised on this page.
        </p>
        <h2 className="text-fg font-bold text-base mt-6">Order questions</h2>
        <p>
          For shipping questions, email{" "}
          <a href="mailto:keepingmusic1@gmail.com" className="underline">keepingmusic1@gmail.com</a>{" "}
          with your order number. For return requests, see our <Link href="/legal/returns" className="underline">Returns & Refunds Policy</Link>.
        </p>
      </div>
    </div>
  );
}
