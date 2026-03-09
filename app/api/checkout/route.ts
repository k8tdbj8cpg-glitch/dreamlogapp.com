import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const priceId = process.env.STRIPE_FLAT_RATE_PRICE_ID!;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?upgraded=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard`,
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}