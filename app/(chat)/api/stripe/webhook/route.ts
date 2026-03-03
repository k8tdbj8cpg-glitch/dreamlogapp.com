import { stripe } from "@/lib/payments/stripe";

/**
 * POST /api/stripe/webhook
 *
 * Handles incoming Stripe webhook events.
 * Stripe signs each request with the STRIPE_WEBHOOK_SECRET to allow
 * verification that the payload came from Stripe.
 *
 * Supported events:
 *  - checkout.session.completed
 *  - customer.subscription.deleted
 */
export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event: import("stripe").Stripe.Event;
  const body = await request.text();

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe webhook signature verification failed:", message);
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as import("stripe").Stripe.Checkout.Session;
      console.info("Stripe checkout completed", {
        sessionId: session.id,
        userId: session.metadata?.userId,
        planType: session.metadata?.planType,
      });
      // TODO: provision subscription access for session.metadata?.userId
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as import("stripe").Stripe.Subscription;
      console.info("Stripe subscription cancelled", {
        subscriptionId: subscription.id,
      });
      // TODO: revoke subscription access for the affected customer
      break;
    }

    default:
      break;
  }

  return Response.json({ received: true });
}
