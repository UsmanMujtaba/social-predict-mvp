import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Premium Articles Subscription',
            },
            unit_amount: 499,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/account?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?canceled=true`,
    });
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 