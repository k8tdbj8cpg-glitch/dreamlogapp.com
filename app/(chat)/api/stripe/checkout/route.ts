import { auth } from "@/app/(auth)/auth";
import { stripe } from "@/lib/payments/stripe";
import { flatRatePlan, usageBasedPlan } from "@/lib/payments/pricing-config";
import { ChatbotError } from "@/lib/errors";

type BillingPlanType = "flat_rate" | "usage_based";

/**
 * POST /api/stripe/checkout
 *
 * Creates a Stripe Checkout Session and returns the session URL.
 * The client should redirect the user to that URL to complete payment.
 *
 * Body: { planType: "flat_rate" | "usage_based", successUrl: string, cancelUrl: string }
 */
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:api").toResponse();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch (_) {
    return new ChatbotError("bad_request:api").toResponse();
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("planType" in body) ||
    !("successUrl" in body) ||
    !("cancelUrl" in body)
  ) {
    return new ChatbotError(
      "bad_request:api",
      "planType, successUrl, and cancelUrl are required"
    ).toResponse();
  }

  const { planType, successUrl, cancelUrl } = body as {
    planType: BillingPlanType;
    successUrl: string;
    cancelUrl: string;
  };

  if (planType !== "flat_rate" && planType !== "usage_based") {
    return new ChatbotError(
      "bad_request:api",
      "planType must be 'flat_rate' or 'usage_based'"
    ).toResponse();
  }

  const priceId =
    planType === "flat_rate"
      ? flatRatePlan.stripePriceId
      : usageBasedPlan.stripePriceId;

  if (!priceId) {
    return new ChatbotError(
      "bad_request:api",
      "Billing plan is not configured"
    ).toResponse();
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: session.user.email ?? undefined,
    // For metered (usage-based) prices, quantity must be omitted.
    line_items: [{ price: priceId, quantity: planType === "flat_rate" ? 1 : undefined }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId: session.user.id,
      planType,
    },
  });

  return Response.json({ url: checkoutSession.url }, { status: 201 });
}
