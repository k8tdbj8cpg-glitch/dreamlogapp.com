import { z } from "zod";
import { auth } from "@/app/(auth)/auth";

const PLAN_PRICES: Record<string, { amount: string; name: string; description: string }> = {
  monthly: {
    amount: "9.99",
    name: "DreamLog Monthly Plan",
    description: "One month of DreamLog individual subscription",
  },
  annual: {
    amount: "30.00",
    name: "DreamLog Annual Plan",
    description: "One year of DreamLog individual subscription",
  },
  "two-year": {
    amount: "50.00",
    name: "DreamLog Two-Year Plan",
    description: "Two years of DreamLog individual subscription",
  },
};

const COINBASE_API = "https://api.commerce.coinbase.com";
const COINBASE_API_VERSION = "2018-03-22";

const checkoutSchema = z.object({
  planId: z.enum(["monthly", "annual", "two-year"]),
  currency: z.string().optional(),
});

export async function POST(request: Request) {
  const apiKey = process.env.COINBASE_COMMERCE_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "Crypto payments are not configured" },
      { status: 503 }
    );
  }

  const session = await auth();

  const parsed = checkoutSchema.safeParse(await request.json().catch(() => ({})));

  if (!parsed.success) {
    return Response.json({ error: "Invalid plan" }, { status: 400 });
  }

  const { planId, currency } = parsed.data;
  const plan = PLAN_PRICES[planId];

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const res = await fetch(`${COINBASE_API}/charges`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CC-Api-Key": apiKey,
      "X-CC-Version": COINBASE_API_VERSION,
    },
    body: JSON.stringify({
      name: plan.name,
      description: plan.description,
      pricing_type: "fixed_price",
      local_price: { amount: plan.amount, currency: "USD" },
      metadata: {
        planId,
        userId: session?.user?.id ?? "",
        email: session?.user?.email ?? "",
        requestedCurrency: currency ?? "bitcoin",
      },
      redirect_url: `${appUrl}/?payment=success`,
      cancel_url: `${appUrl}/pricing?payment=cancelled`,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const message = data?.error?.message ?? "Failed to create crypto charge";
    return Response.json({ error: message }, { status: res.status });
  }

  const { data } = await res.json();
  return Response.json({ url: data.hosted_url });
}
