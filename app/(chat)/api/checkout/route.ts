import Stripe from "stripe";
import { auth } from "@/app/(auth)/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-02-24.acacia",
});

const PREMIUM_PRICE_CENTS = 2999; // $29.99

export async function POST(request: Request) {
  const session = await auth();

  const origin = request.headers.get("origin") ?? "";
  const successUrl = `${origin}/payment/success`;
  const cancelUrl = origin ? origin : "/";

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "DreamLog Premium",
              description: "One-time purchase: unlock all premium features",
            },
            unit_amount: PREMIUM_PRICE_CENTS,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      ...(session?.user?.email
        ? { customer_email: session.user.email }
        : {}),
    });

    return Response.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout session creation failed:", error);
    return Response.json(
      { error: "Failed to create checkout session. Please try again later." },
      { status: 500 }
    );
  }
}
