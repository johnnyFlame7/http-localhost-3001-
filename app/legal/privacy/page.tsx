import Link from "next/link";

export const metadata = { title: "Privacy Policy — TheFlame" };

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-16">
      <h1 className="font-display text-4xl mb-2">Privacy Policy</h1>
      <p className="text-muted text-sm mb-8">Last updated: 27 September 2026</p>
      <div className="text-neutral-300 leading-relaxed space-y-5 text-sm">
        <p>
          This policy describes how TheFlame handles information when you browse this website,
          place an order, or contact the store. The legal person or entity acting as the data
          controller must be entered in the <Link href="/legal/business" className="underline">Business Information</Link> page before orders are accepted.
        </p>
        <h2 className="text-fg font-bold text-base mt-6">Information used for orders</h2>
        <p>
          If you begin checkout, the store uses your name, email address, and delivery address to create and
          manage the order. Order items, selected sizes, quantities, prices, shipping, payment status,
          and Stripe checkout reference are recorded to administer the transaction and respond to
          order enquiries.
        </p>
        <h2 className="text-fg font-bold text-base mt-6">Payments</h2>
        <p>
          Card details are entered on Stripe&apos;s hosted checkout. The store does not receive or
          store full payment card numbers. Stripe processes payment under its own privacy terms.
        </p>
        <h2 className="text-fg font-bold text-base mt-6">Cart and account data</h2>
        <p>
          Your cart is stored in your browser&apos;s local storage so it remains available when you
          navigate the store. The owner dashboard uses Supabase authentication. The site currently
          has no newsletter signup or advertising-tracking feature.
        </p>
        <h2 className="text-fg font-bold text-base mt-6">Service providers and retention</h2>
        <p>
          The store relies on its configured hosting, database, authentication, and payment providers
          to operate. Order information is retained as needed to administer purchases, meet record
          keeping duties, and resolve disputes. Provider locations and any applicable transfer
          safeguards depend on the services and regions selected by the store operator.
        </p>
        <h2 className="text-fg font-bold text-base mt-6">Your privacy requests</h2>
        <p>
          To ask about, correct, or request deletion of personal information, email{" "}
          <a href="mailto:keepingmusic1@gmail.com" className="underline">keepingmusic1@gmail.com</a>.
          The store operates from Portugal and must handle personal data in accordance with
          applicable Portuguese and European Union data-protection requirements, including the
          GDPR. You may also contact the competent data-protection supervisory authority. This
          notice should be checked against the controller&apos;s final identity and actual service configuration.
        </p>
      </div>
    </div>
  );
}
