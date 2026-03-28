import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import {
  STRIPE_WEBHOOK_SECRET,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} from "@/config/env";
import { ORDER_STATUS } from "@/config/stripe";

// Service role client bypasses RLS — used only for webhook processing
function createServiceClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const { error } = await supabase
      .from("orders")
      .update({
        status: ORDER_STATUS.COMPLETED,
        stripe_payment_intent_id:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : null,
      })
      .eq("stripe_session_id", session.id);

    if (error) {
      console.error("Failed to update order status:", error);
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object;

    const { error } = await supabase
      .from("orders")
      .update({ status: ORDER_STATUS.FAILED })
      .eq("stripe_session_id", session.id);

    if (error) {
      console.error("Failed to update expired order:", error);
    }
  }

  return NextResponse.json({ received: true });
}
