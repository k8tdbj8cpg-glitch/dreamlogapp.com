"use client";

import { useCallback, useState } from "react";
import { toast } from "@/components/toast";

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "monthly" }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Failed to start checkout");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        type: "error",
        description: "Failed to start checkout. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex min-h-dvh w-screen flex-col items-center justify-center bg-background px-4 py-16">
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <div aria-hidden="true" className="text-5xl">
          🌙
        </div>
        <h1 className="font-bold text-3xl text-primary">DreamLog Pricing</h1>
        <p className="max-w-sm text-muted-foreground text-sm">
          Unlock the full power of your dream life with a single plan.
        </p>
      </div>

      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-lg">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold text-card-foreground text-xl">
              DreamLog Premium
            </h2>
            <p className="text-muted-foreground text-sm">
              Unlimited dream journaling, AI analysis, sleep tracking, and smart
              home integration.
            </p>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="font-bold text-4xl text-primary">$29.99</span>
            <span className="text-muted-foreground text-sm">/month</span>
          </div>

          <ul className="flex flex-col gap-2 text-card-foreground text-sm">
            {[
              "Unlimited dream journal entries",
              "AI-powered dream analysis",
              "Sleep tracking & insights",
              "Smart home integration",
            ].map((feature) => (
              <li className="flex items-center gap-2" key={feature}>
                <span aria-hidden="true" className="text-primary">
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>

          <button
            className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground text-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoading}
            onClick={handleSubscribe}
            type="button"
          >
            {isLoading ? "Redirecting…" : "Subscribe Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
