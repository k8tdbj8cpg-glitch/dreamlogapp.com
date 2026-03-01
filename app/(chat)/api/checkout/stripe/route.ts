import Stripe from "stripe";
import { z } from "zod";
import { auth } from "@/app/(auth)/auth";

const PLAN_PRICES: Record<string, { amount: number; name: string; interval?: "month" | "year" }> = {
  monthly: { amount: 999, name: "DreamLog Monthly Plan", interval: "month" },
  annual: { amount: 3000, name: "DreamLog Annual Plan", interval: "year" },
  "two-year": { amount: 5000, name: "DreamLog Two-Year Plan" },
};

const checkoutSchema = z.object({
  planId: z.enum(["monthly", "annual", "two-year"]),
});

export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey) {
    return Response.json(
      { error: "Stripe is not configured" },
      { status: 503 }
    );
  }

  const session = await auth();

  const parsed = checkoutSchema.safeParse(await request.json().catch(() => ({})));

  if (!parsed.success) {
    return Response.json({ error: "Invalid plan" }, { status: 400 });
  }

  const { planId } = parsed.data;
  const plan = PLAN_PRICES[planId];

  const stripe = new Stripe(stripeKey);

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: plan.name },
          unit_amount: plan.amount,
          ...(plan.interval
            ? { recurring: { interval: plan.interval } }
            : {}),
        },
        quantity: 1,
      },
    ],
    mode: plan.interval ? "subscription" : "payment",
    customer_email: session?.user?.email ?? undefined,
    success_url: `${appUrl}/?payment=success`,
    cancel_url: `${appUrl}/pricing?payment=cancelled`,
    metadata: {
      planId,
      userId: session?.user?.id ?? "",
    },
  });

  return Response.json({ url: checkoutSession.url });
}
