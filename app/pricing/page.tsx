"use client";

import { CheckIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { pricingPlans } from "@/lib/pricing";
import { cn } from "@/lib/utils";

function PricingContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");
  const router = useRouter();

  const individualPlans = pricingPlans.filter(
    (p) => p.category === "individual"
  );
  const institutionPlans = pricingPlans.filter(
    (p) => p.category === "institution"
  );

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <button
            className="mb-4 cursor-pointer text-sm text-muted-foreground hover:underline"
            onClick={() => router.push("/")}
            type="button"
          >
            ← Back to DreamLog
          </button>
          <h1 className="mb-4 font-bold text-4xl tracking-tight md:text-5xl">
            DreamLog Premium
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Unlock the full potential of AI-powered dream journaling. Understand
            your subconscious, discover patterns, and gain insights that
            transform your waking life.
          </p>
        </div>

        {/* Status banners */}
        {success && (
          <div className="mb-8 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-center text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
            🎉 Payment successful! Welcome to DreamLog Premium.
          </div>
        )}
        {canceled && (
          <div className="mb-8 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-center text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
            Payment canceled. Your plan has not been changed.
          </div>
        )}

        {/* Individual Plans */}
        <section className="mb-16">
          <h2 className="mb-2 font-semibold text-2xl">Individual Plans</h2>
          <p className="mb-8 text-muted-foreground">
            Personal dream analysis for curious minds
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {individualPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </section>

        <Separator className="mb-16" />

        {/* Institution Plans */}
        <section>
          <h2 className="mb-2 font-semibold text-2xl">Institution Plans</h2>
          <p className="mb-8 text-muted-foreground">
            Empower your organization with group dream analytics and
            professional-grade tools
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {institutionPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </section>

        {/* Payment methods footer */}
        <div className="mt-16 text-center text-muted-foreground text-sm">
          <p className="mb-2">Secure payments powered by</p>
          <div className="flex items-center justify-center gap-4">
            <span className="rounded-md border px-3 py-1 font-medium">
              💳 Stripe
            </span>
            <span className="rounded-md border px-3 py-1 font-medium">
              ₿ Coinbase Commerce
            </span>
          </div>
          <p className="mt-3 text-xs">
            We accept all major credit cards, Bitcoin (BTC), Ethereum (ETH), and
            USD Coin (USDC).
          </p>
        </div>
      </div>
    </div>
  );
}

function PlanCard({ plan }: { plan: (typeof pricingPlans)[number] }) {
  const [loadingStripe, setLoadingStripe] = useState(false);
  const [loadingCoinbase, setLoadingCoinbase] = useState(false);
  const isEnterprise = plan.id === "institution_enterprise";

  const handleStripeCheckout = async () => {
    setLoadingStripe(true);
    try {
      const res = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error ?? "Failed to start checkout");
      }
    } catch (error) {
      console.error("Stripe checkout error:", error);
      toast.error("Failed to connect to payment provider");
    } finally {
      setLoadingStripe(false);
    }
  };

  const handleCoinbaseCheckout = async () => {
    setLoadingCoinbase(true);
    try {
      const res = await fetch("/api/checkout/coinbase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error ?? "Failed to start checkout");
      }
    } catch (error) {
      console.error("Coinbase checkout error:", error);
      toast.error("Failed to connect to payment provider");
    } finally {
      setLoadingCoinbase(false);
    }
  };

  return (
    <Card
      className={cn(
        "flex flex-col",
        plan.badge === "Most Popular" && "border-primary shadow-md"
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl">{plan.name}</CardTitle>
          {plan.badge && (
            <Badge
              variant={plan.badge === "Contact Us" ? "outline" : "default"}
            >
              {plan.badge}
            </Badge>
          )}
        </div>
        <CardDescription>{plan.description}</CardDescription>
        <div className="pt-2">
          <span className="font-bold text-3xl">
            ${plan.price.toLocaleString()}
          </span>
          <span className="text-muted-foreground text-sm">{plan.interval}</span>
          {plan.highlight && (
            <p className="mt-1 font-medium text-primary text-sm">
              ✦ {plan.highlight}
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <ul className="space-y-2">
          {plan.features.map((feature) => (
            <li className="flex items-center gap-2 text-sm" key={feature}>
              <CheckIcon className="size-4 shrink-0 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-4">
        {isEnterprise ? (
          <Button
            className="w-full"
            onClick={() => {
              window.location.href = "mailto:enterprise@dreamlogapp.com";
            }}
            variant="default"
          >
            Contact Sales
          </Button>
        ) : (
          <>
            <Button
              className="w-full"
              disabled={loadingStripe}
              onClick={handleStripeCheckout}
              variant="default"
            >
              {loadingStripe ? "Redirecting…" : "Pay with Card"}
            </Button>
            <Button
              className="w-full"
              disabled={loadingCoinbase}
              onClick={handleCoinbaseCheckout}
              variant="outline"
            >
              {loadingCoinbase ? "Redirecting…" : "Pay with Crypto"}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh items-center justify-center">Loading…</div>
      }
    >
      <PricingContent />
    </Suspense>
  );
}
