import Stripe from "stripe";
import { auth } from "@/app/(auth)/auth";
import { ChatbotError } from "@/lib/errors";

export async function POST() {
  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:checkout").toResponse();
  }

  if (session.user.type === "premium") {
    return new ChatbotError(
      "bad_request:checkout",
      "You are already a premium member."
    ).toResponse();
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripePriceId = process.env.STRIPE_PRICE_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!stripeSecretKey || !stripePriceId || !appUrl) {
    return new ChatbotError(
      "bad_request:checkout",
      "Stripe is not configured. Please contact support."
    ).toResponse();
  }

  const stripe = new Stripe(stripeSecretKey);

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: stripePriceId,
        quantity: 1,
      },
    ],
    customer_email: session.user.email ?? undefined,
    metadata: {
      userId: session.user.id,
    },
    success_url: `${appUrl}/?checkout=success`,
    cancel_url: `${appUrl}/?checkout=cancelled`,
  });

  return Response.json({ url: checkoutSession.url });
}
