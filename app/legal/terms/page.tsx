import Link from "next/link";

export const metadata = { title: "Terms & Conditions — TheFlame" };

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-16">
      <h1 className="font-display text-4xl mb-2">Terms & Conditions</h1>
      <p className="text-muted text-sm mb-8">Last updated: 27 September 2026</p>
      <div className="text-neutral-300 leading-relaxed space-y-5 text-sm">
        <p>
          These terms apply to use of TheFlame and orders placed through this store. The stated
          country of operation is Portugal. These terms do not limit consumer rights that cannot
          legally be excluded under applicable Portuguese or European Union law. The store owner
          must enter the official legal seller name in the <Link href="/legal/business" className="underline">Business Information</Link> before accepting orders.
        </p>
        <h2 className="text-fg font-bold text-base mt-6">Products and prices</h2>
        <p>
          Product descriptions, images, sizes, availability, and prices are displayed on each
          product page. Prices and checkout totals are shown in US dollars (USD). The total includes
          shipping where applicable and is presented before payment. A product is not reserved until
          checkout is completed and payment is confirmed.
        </p>
        <h2 className="text-fg font-bold text-base mt-6">Orders and payment</h2>
        <p>
          Orders are subject to product availability and successful payment. Payment is processed
          through Stripe&apos;s hosted checkout. The order confirmation page is shown only after the
          payment session is verified. If an order cannot be fulfilled, contact the store using the
          details on the Contact page.
        </p>
        <h2 className="text-fg font-bold text-base mt-6">Shipping and returns</h2>
        <p>
          Current shipping charges are described in the <Link href="/legal/shipping" className="underline">Shipping Policy</Link>. Please
          contact us before returning an item so we can confirm the applicable return instructions.
          Nothing in these terms removes rights provided by applicable consumer law.
        </p>
        <h2 className="text-fg font-bold text-base mt-6">Website content</h2>
        <p>
          TheFlame branding and original store content may not be copied or used commercially
          without permission, except where applicable law permits. Product images are illustrative;
          contact us if you need clarification about an item before ordering.
        </p>
        <h2 className="text-fg font-bold text-base mt-6">Contact</h2>
        <p>
          Questions about these terms can be sent to{" "}
          <a href="mailto:keepingmusic1@gmail.com" className="underline">keepingmusic1@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}
