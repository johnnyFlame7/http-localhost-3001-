import Link from "next/link";

export const metadata = { title: "Cookie & Storage Policy — TheFlame" };

export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-16">
      <h1 className="font-display text-4xl mb-2">Cookie & Storage Policy</h1>
      <p className="text-muted text-sm mb-8">Last updated: 27 September 2026</p>
      <div className="text-neutral-300 leading-relaxed space-y-5 text-sm">
        <p>
          The storefront uses browser local storage to remember the items in your shopping cart.
          This is necessary for the cart to work between pages and is not an advertising tracker.
        </p>
        <h2 className="text-fg font-bold text-base mt-6">Owner login</h2>
        <p>
          When the store owner signs in, Supabase authentication uses session cookies to protect
          access to the private owner dashboard. These are not used to track storefront visitors.
        </p>
        <h2 className="text-fg font-bold text-base mt-6">Checkout and external services</h2>
        <p>
          Checkout redirects to Stripe, which may use its own cookies and similar technologies
          under its policies. The site loads display fonts from Google Fonts. No analytics or
          advertising pixels are currently included in the storefront.
        </p>
        <h2 className="text-fg font-bold text-base mt-6">Your choices</h2>
        <p>
          You can clear local storage and cookies in your browser settings. Clearing the saved cart
          removes its contents. Blocking essential storage or authentication cookies may prevent
          cart persistence or owner login from working.
        </p>
        <p>
          This store operates from Portugal. For questions about personal information or your
          applicable privacy rights, see the <Link href="/legal/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
