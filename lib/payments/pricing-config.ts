/**
 * Stripe billing configuration.
 *
 * Flat-rate and usage-based billing plans derived from the Saltcatcharters
 * pricing-config reference. Prices are expressed in the smallest currency
 * unit (cents for USD).
 */

export interface FlatRatePlan {
  /** Stripe Price ID for flat-rate subscription */
  stripePriceId: string;
  /** Display amount in cents */
  amountCents: number;
  currency: string;
  interval: "month" | "year";
}

export interface UsageBasedPlan {
  /** Stripe Price ID for metered billing */
  stripePriceId: string;
  /** Price per unit in cents */
  pricePerUnitCents: number;
  currency: string;
  /** Human-readable unit label, e.g. "message" */
  unitLabel: string;
}

/**
 * Flat-rate billing plan.
 * Set STRIPE_FLAT_RATE_PRICE_ID to your Stripe Price ID for this plan.
 */
export const flatRatePlan: FlatRatePlan = {
  stripePriceId: process.env.STRIPE_FLAT_RATE_PRICE_ID ?? "",
  amountCents: 999, // $9.99 / month placeholder
  currency: "usd",
  interval: "month",
};

/**
 * Usage-based (metered) billing plan.
 * Set STRIPE_USAGE_PRICE_ID to your Stripe metered Price ID.
 */
export const usageBasedPlan: UsageBasedPlan = {
  stripePriceId: process.env.STRIPE_USAGE_PRICE_ID ?? "",
  pricePerUnitCents: 1, // $0.01 per unit placeholder
  currency: "usd",
  unitLabel: "message",
};
