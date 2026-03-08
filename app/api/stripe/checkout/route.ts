import Stripe from "stripe";

export async function POST() {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_FLAT_RATE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url:
        "https://dreamlogappcom.vercel.app/dashboard?upgraded=true",
      cancel_url: "https://dreamlogappcom.vercel.app",
    });

    return Response.json({ url: session.url });
  } catch (_) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
