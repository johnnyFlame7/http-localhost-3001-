"use client";
import { useEffect, useState } from "react";

const STORE_EMAIL = "keepingmusic1@gmail.com";

export default function Contact() {
  const [contactEmail, setContactEmail] = useState(STORE_EMAIL);
  useEffect(() => {
    fetch("/api/settings")
      .then((response) => {
        if (!response.ok) throw new Error("Contact settings are unavailable.");
        return response.json();
      })
      .then((settings) => setContactEmail(settings?.contactEmail || STORE_EMAIL))
      .catch((error) => console.error("Unable to load contact email.", error));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <h1 className="font-display mb-8" style={{ fontSize: "clamp(34px,7vw,60px)" }}>Contact Us</h1>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="text-muted leading-loose">
          <p><strong className="text-fg">Email</strong><br />
            {contactEmail ? (
              <a href={`mailto:${contactEmail}`} className="font-bold text-fg">{contactEmail}</a>
            ) : (
              <a href={`mailto:${STORE_EMAIL}`} className="font-bold text-fg">{STORE_EMAIL}</a>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
