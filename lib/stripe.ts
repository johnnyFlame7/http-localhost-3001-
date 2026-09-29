import Stripe from "stripe";

// Reads your Stripe secret key from the environment. Nothing here is
// hard-coded — connect your own Stripe account via .env / hosting env vars.
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add your own Stripe secret key to .env to enable checkout."
    );
  }
  return new Stripe(key, { apiVersion: "2024-06-20" });
}
