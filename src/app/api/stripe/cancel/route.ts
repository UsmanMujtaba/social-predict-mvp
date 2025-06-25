import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '../../../../supabaseClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  // Find user in users table
  const { data: user } = await supabase.from('users').select('id').eq('email', email).single();
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  // Find active subscription
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_subscription_id, status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();
  if (!sub || !sub.stripe_subscription_id) {
    return NextResponse.json({ error: 'Active subscription not found' }, { status: 404 });
  }
  // Cancel subscription in Stripe
  try {
    const canceled = await stripe.subscriptions.update(sub.stripe_subscription_id, { cancel_at_period_end: true });
    // Update status in Supabase
    await supabase
      .from('subscriptions')
      .update({ status: canceled.status })
      .eq('stripe_subscription_id', sub.stripe_subscription_id);
    return NextResponse.json({ status: canceled.status, cancel_at_period_end: canceled.cancel_at_period_end });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 