import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

let stripeClient: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
      apiVersion: '2026-02-25.clover',
    });
  }
  return stripeClient;
}

export async function POST(request: Request) {
  try {
    const stripe = getStripe();
    const _body = await request.json().catch(() => ({}));
    const priceId = process.env.STRIPE_FLAT_RATE_PRICE_ID;
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?upgraded=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard`,
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Failed to start checkout' }, { status: 500 });
  }
}
