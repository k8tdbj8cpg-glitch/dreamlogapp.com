import { createHmac, timingSafeEqual } from "node:crypto";

export async function POST(request: Request) {
  const webhookSecret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return Response.json(
      { error: "Coinbase Commerce webhook not configured" },
      { status: 503 }
    );
  }

  const signature = request.headers.get("x-cc-webhook-signature");

  if (!signature) {
    return Response.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await request.text();

  const expectedSig = createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  const sigBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expectedSig, "hex");

  const isValid =
    sigBuffer.length === expectedBuffer.length &&
    timingSafeEqual(sigBuffer, expectedBuffer);

  if (!isValid) {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: { type: string; data: { object: { metadata?: Record<string, string>; code?: string } } };

  try {
    event = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  switch (event.type) {
    case "charge:confirmed": {
      const charge = event.data.object;
      // TODO: Provision the user's subscription in the database using
      // charge.metadata.userId and charge.metadata.planId
      console.info("[coinbase] charge:confirmed", {
        userId: charge.metadata?.userId,
        planId: charge.metadata?.planId,
        chargeCode: charge.code,
      });
      break;
    }
    case "charge:failed": {
      const charge = event.data.object;
      console.info("[coinbase] charge:failed", {
        chargeCode: charge.code,
      });
      break;
    }
    default:
      break;
  }

  return Response.json({ received: true });
}
