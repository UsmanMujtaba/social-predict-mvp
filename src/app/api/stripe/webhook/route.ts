import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '../../../../supabaseClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;
    const status = subscription.status;
    const stripeSubscriptionId = subscription.id;

    // Find user by Stripe customer ID
    const { data: userData } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (userData) {
      // Update subscription status
      await supabase
        .from('subscriptions')
        .update({ status, stripe_subscription_id: stripeSubscriptionId })
        .eq('user_id', userData.user_id);
    }
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerId = session.customer as string;
    const email = session.customer_email;
    // Find user by email
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    if (user) {
      // Insert or update subscription record
      await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          stripe_customer_id: customerId,
          status: 'active',
        });
    }
  }

  return NextResponse.json({ received: true });
} 