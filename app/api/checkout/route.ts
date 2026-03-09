import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({ plan: 'monthly' }));
    const { plan = 'monthly' } = body;

    const priceId = plan === 'yearly'
      ? process.env.STRIPE_YEARLY_PRICE_ID!
      : process.env.STRIPE_MONTHLY_PRICE_ID!;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.dreamlogapp.com'}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.dreamlogapp.com'}/?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
