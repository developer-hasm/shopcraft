"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { APP_URL } from "@/config/env";
import { LOGIN_PATH } from "@/config/auth";
import {
  STRIPE_CURRENCY,
  CHECKOUT_SUCCESS_PATH,
  CHECKOUT_CANCEL_PATH,
  ORDER_STATUS,
} from "@/config/stripe";

export interface CheckoutActionState {
  error?: string;
}

export async function createCheckoutSession(
  _prevState: CheckoutActionState | null,
  formData: FormData
): Promise<CheckoutActionState> {
  const productId = formData.get("productId");
  if (typeof productId !== "string" || !productId) {
    return { error: "Product ID is required." };
  }

  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(LOGIN_PATH);
  }

  // Fetch product
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, title, price, image_url")
    .eq("id", productId)
    .single<{ id: string; title: string; price: number; image_url: string | null }>();

  if (productError || !product) {
    return { error: "Product not found." };
  }

  // Create Stripe Checkout Session
  let checkoutUrl: string;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: STRIPE_CURRENCY,
      line_items: [
        {
          price_data: {
            currency: STRIPE_CURRENCY,
            product_data: {
              name: product.title,
            },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        product_id: product.id,
        buyer_id: user.id,
      },
      success_url: `${APP_URL}${CHECKOUT_SUCCESS_PATH}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}${CHECKOUT_CANCEL_PATH}`,
    });

    if (!session.url) {
      return { error: "Could not create checkout session." };
    }

    checkoutUrl = session.url;

    // Create pending order
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: orderError } = await (supabase.from("orders") as any).insert({
      buyer_id: user.id,
      product_id: product.id,
      stripe_session_id: session.id,
      amount: product.price,
      status: ORDER_STATUS.PENDING,
    });

    if (orderError) {
      console.error("Order insert error:", orderError);
      return { error: "Could not create order. Please try again." };
    }
  } catch (err) {
    console.error("Checkout error:", err);
    return { error: "Something went wrong. Please try again." };
  }

  // redirect() throws internally — must be outside try/catch
  redirect(checkoutUrl);
}
