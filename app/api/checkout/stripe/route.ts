import { NextResponse } from "next/server";
import Stripe from "stripe";
import { pricingPlans } from "@/lib/pricing";

let stripeClient: Stripe | null = null;

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return null;
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 }
    );
  }

  let planId: string;
  try {
    const body = await request.json();
    planId = body.planId;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const plan = pricingPlans.find((p) => p.id === planId);
  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: plan.currency.toLowerCase(),
          product_data: {
            name: `DreamLog ${plan.name}`,
            description: plan.description,
          },
          unit_amount: Math.round(plan.price * 100),
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/pricing?success=true`,
    cancel_url: `${origin}/pricing?canceled=true`,
    metadata: {
      planId: plan.id,
    },
  });

  return NextResponse.json({ url: session.url });
}
