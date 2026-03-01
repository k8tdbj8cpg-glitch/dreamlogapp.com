import { NextResponse } from "next/server";
import { pricingPlans } from "@/lib/pricing";

export async function POST(request: Request) {
  const apiKey = process.env.COINBASE_COMMERCE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Coinbase Commerce is not configured" },
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

  const response = await fetch("https://api.commerce.coinbase.com/charges", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CC-Api-Key": apiKey,
      "X-CC-Version": "2018-03-22",
    },
    body: JSON.stringify({
      name: `DreamLog ${plan.name}`,
      description: plan.description,
      pricing_type: "fixed_price",
      local_price: {
        amount: plan.price.toFixed(2),
        currency: plan.currency,
      },
      metadata: {
        plan_id: plan.id,
      },
      redirect_url: `${origin}/pricing?success=true`,
      cancel_url: `${origin}/pricing?canceled=true`,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Coinbase Commerce error:", errorText);
    return NextResponse.json(
      { error: "Failed to create crypto payment. Please try again." },
      { status: response.status }
    );
  }

  const data = await response.json();
  const hostedUrl = data.data?.hosted_url;
  if (!hostedUrl) {
    console.error("Coinbase Commerce: missing hosted_url in response", data);
    return NextResponse.json(
      { error: "Failed to retrieve checkout URL from Coinbase Commerce." },
      { status: 502 }
    );
  }
  return NextResponse.json({ url: hostedUrl });
}
