import Stripe from "stripe";

export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    return Response.json(
      { error: "Stripe webhook not configured" },
      { status: 503 }
    );
  }

  const stripe = new Stripe(stripeKey);
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return Response.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const rawBody = await request.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return Response.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      // TODO: Provision the user's subscription in the database using
      // session.metadata.userId and session.metadata.planId
      console.info("[stripe] checkout.session.completed", {
        userId: session.metadata?.userId,
        planId: session.metadata?.planId,
        sessionId: session.id,
      });
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      // TODO: Revoke the user's subscription in the database
      console.info("[stripe] customer.subscription.deleted", {
        subscriptionId: subscription.id,
      });
      break;
    }
    default:
      break;
  }

  return Response.json({ received: true });
}
