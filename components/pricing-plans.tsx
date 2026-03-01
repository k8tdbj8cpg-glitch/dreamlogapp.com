"use client";

import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

type Plan = {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  badge?: string;
  highlight?: boolean;
};

const individualPlans: Plan[] = [
  {
    id: "monthly",
    name: "Monthly",
    price: "$9.99",
    period: "per month",
    description: "Perfect for getting started with AI-powered dream journaling.",
    features: [
      "Unlimited dream entries",
      "AI dream analysis",
      "Pattern recognition",
      "Export your dreams",
      "Priority support",
    ],
  },
  {
    id: "annual",
    name: "Annual",
    price: "$30",
    period: "per year",
    description: "Save over 75% compared to monthly billing.",
    badge: "Best Value",
    highlight: true,
    features: [
      "Everything in Monthly",
      "Advanced AI insights",
      "Dream trend analysis",
      "Yearly dream report",
      "Priority support",
    ],
  },
  {
    id: "two-year",
    name: "Two-Year",
    price: "$50",
    period: "for 2 years",
    description: "Lock in the best price and save even more.",
    features: [
      "Everything in Annual",
      "Extended history access",
      "Early access to new features",
      "Dedicated support",
    ],
  },
];

type PaymentMethod = "stripe" | "bitcoin" | "ethereum" | "usdc";

const paymentMethods: { id: PaymentMethod; label: string; icon: string }[] = [
  { id: "stripe", label: "Credit / Debit Card", icon: "💳" },
  { id: "bitcoin", label: "Bitcoin (BTC)", icon: "₿" },
  { id: "ethereum", label: "Ethereum (ETH)", icon: "Ξ" },
  { id: "usdc", label: "USD Coin (USDC)", icon: "🪙" },
];

function CheckoutDialog({ plan }: { plan: Plan }) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCrypto = paymentMethod !== "stripe";

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      if (isCrypto) {
        const res = await fetch("/api/checkout/coinbase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId: plan.id, currency: paymentMethod }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Failed to create crypto charge");
        }

        const { url } = await res.json();
        window.location.href = url;
      } else {
        const res = await fetch("/api/checkout/stripe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId: plan.id }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Failed to create checkout session");
        }

        const { url } = await res.json();
        window.location.href = url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="max-w-sm">
      <DialogHeader>
        <DialogTitle>
          Subscribe to {plan.name} – {plan.price}
        </DialogTitle>
        <DialogDescription>
          Choose your preferred payment method to continue.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-2 py-2">
        {paymentMethods.map((method) => (
          <button
            className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors hover:bg-muted ${
              paymentMethod === method.id
                ? "border-primary bg-primary/5 font-medium"
                : "border-border"
            }`}
            key={method.id}
            onClick={() => setPaymentMethod(method.id)}
            type="button"
          >
            <span className="text-lg leading-none">{method.icon}</span>
            <span>{method.label}</span>
            {paymentMethod === method.id && (
              <CheckIcon className="ml-auto size-4 text-primary" />
            )}
          </button>
        ))}
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-destructive text-sm">
          {error}
        </p>
      )}

      <Button disabled={loading} onClick={handleCheckout}>
        {loading
          ? "Redirecting…"
          : isCrypto
            ? `Pay ${plan.price} with Crypto`
            : `Pay ${plan.price} with Card`}
      </Button>
    </DialogContent>
  );
}

export function PricingPlans() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="font-bold text-4xl tracking-tight">
          Simple, Transparent Pricing
        </h1>
        <p className="mt-4 text-muted-foreground text-xl">
          Start journaling your dreams today. Cancel anytime.
        </p>
      </div>

      {/* Individual Plans */}
      <div className="mb-4">
        <h2 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">
          Individual Plans
        </h2>
      </div>
      <div className="mb-16 grid gap-6 sm:grid-cols-3">
        {individualPlans.map((plan) => (
          <Card
            className={`relative flex flex-col ${plan.highlight ? "border-primary shadow-md" : ""}`}
            key={plan.id}
          >
            {plan.badge && (
              <Badge className="-top-3 absolute left-1/2 -translate-x-1/2 text-xs">
                {plan.badge}
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <div className="flex items-end gap-1">
                <span className="font-bold text-3xl">{plan.price}</span>
                <span className="mb-1 text-muted-foreground text-sm">
                  {plan.period}
                </span>
              </div>
              <CardDescription>{plan.description}</CardDescription>
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
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="w-full"
                    variant={plan.highlight ? "default" : "outline"}
                  >
                    Get Started
                  </Button>
                </DialogTrigger>
                <CheckoutDialog plan={plan} />
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Separator className="mb-16" />

      {/* Organization Pricing */}
      <div className="rounded-2xl bg-muted/50 px-8 py-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-bold text-2xl">Organization Pricing</h2>
          <p className="mt-3 text-muted-foreground">
            Custom plans for hospitals, daycares, nursing homes, and other
            organizations. Pricing is tied to your growth rate—you only pay more
            as your organization expands.
          </p>
          <ul className="mt-6 grid gap-2 text-left sm:grid-cols-2">
            {[
              "Volume seat discounts",
              "Dedicated account manager",
              "Custom onboarding",
              "SSO / SAML integration",
              "SLA & uptime guarantee",
              "Invoice billing available",
            ].map((feature) => (
              <li className="flex items-center gap-2 text-sm" key={feature}>
                <CheckIcon className="size-4 shrink-0 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="mailto:sales@dreamlogapp.com">Contact Sales</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/">Back to App</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Payment methods footer */}
      <p className="mt-10 text-center text-muted-foreground text-sm">
        We accept credit/debit cards via{" "}
        <span className="font-medium text-foreground">Stripe</span> and
        cryptocurrency (Bitcoin, Ethereum, USD Coin) via{" "}
        <span className="font-medium text-foreground">Coinbase Commerce</span>.
        All transactions are encrypted and secure.
      </p>
    </div>
  );
}
