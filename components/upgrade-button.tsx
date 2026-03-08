"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

export function UpgradeButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
        return;
      }

      // Fallback: use Stripe.js redirectToCheckout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to load");
      }
    } catch (error) {
      console.error("Upgrade error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="gap-2"
      disabled={isLoading}
      onClick={handleUpgrade}
      type="button"
    >
      {isLoading ? "Redirecting…" : "⭐ Upgrade to Premium"}
    </Button>
  );
}
