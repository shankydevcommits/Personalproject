import Stripe from "stripe";

let client: Stripe | null = null;

export function stripeClient(): Stripe {
  if (client) return client;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("Stripe is not configured. Set STRIPE_SECRET_KEY.");
  }
  client = new Stripe(key, { apiVersion: "2025-02-24.acacia" });
  return client;
}
