/**
 * Stripe client singleton.
 *
 * Initialises the Stripe SDK with the secret key supplied via the
 * STRIPE_SECRET_KEY environment variable.  The key is never hard-coded.
 *
 * The client is created lazily so that routes that do not use Stripe
 * (the majority of the app) are unaffected when the env var is absent.
 */

import Stripe from "stripe";

let _stripe: Stripe | undefined;

export function getStripeClient(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY environment variable is not set");
    }
    _stripe = new Stripe(key, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }
  return _stripe;
}

/** Convenience singleton alias – only access this inside Stripe-specific routes. */
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripeClient() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

