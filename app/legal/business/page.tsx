export const metadata = { title: "Business Information — TheFlame" };

export default function BusinessPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-16">
      <h1 className="font-display text-4xl mb-8">Business Information</h1>
      <div className="text-neutral-300 leading-relaxed space-y-4 text-sm">
        <p><strong className="text-fg">Brand / trading name:</strong> TheFlame</p>
        <p><strong className="text-fg">Country of operation:</strong> Portugal</p>
        <p>
          <strong className="text-fg">Legal seller name:</strong>{" "}
          <span className="inline-block min-w-48 border-b border-line" aria-label="Not entered" />
        </p>
        <p>
          <strong className="text-fg">Customer contact:</strong>{" "}
          <a href="mailto:keepingmusic1@gmail.com" className="underline">keepingmusic1@gmail.com</a>
        </p>
        <p>
          <strong className="text-fg">Instagram:</strong>{" "}
          <a href="https://www.instagram.com/kbrandmusisc/" target="_blank" rel="noreferrer" className="underline">
            @kbrandmusisc
          </a>
        </p>
        <p>
          The legal seller name and any applicable registration or tax details must be entered by
          the store owner before accepting orders. Portugal is the stated country of operation;
          mandatory consumer protections applicable in Portugal and the European Union continue to apply.
        </p>
      </div>
    </div>
  );
}
