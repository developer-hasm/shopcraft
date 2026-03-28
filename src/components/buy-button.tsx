"use client";

import { useActionState } from "react";
import { buttonVariants } from "@/components/ui/button-variants";
import { Button } from "@/components/ui/button";
import { LOGIN_PATH } from "@/config/auth";
import {
  createCheckoutSession,
  type CheckoutActionState,
} from "@/app/actions/checkout";

interface BuyButtonProps {
  productId: string;
  isLoggedIn: boolean;
}

export function BuyButton({ productId, isLoggedIn }: BuyButtonProps) {
  const [state, formAction, isPending] = useActionState<
    CheckoutActionState | null,
    FormData
  >(createCheckoutSession, null);

  if (!isLoggedIn) {
    return (
      <div>
        <a
          href={LOGIN_PATH}
          className={buttonVariants({ size: "lg", className: "w-full sm:w-auto" })}
        >
          Sign in to Buy
        </a>
        <p className="mt-2 text-xs text-muted-foreground">
          You need to sign in before purchasing.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="productId" value={productId} />
      {state?.error && (
        <div
          role="alert"
          className="mb-3 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </div>
      )}
      <Button
        type="submit"
        size="lg"
        className="w-full sm:w-auto"
        disabled={isPending}
      >
        {isPending ? "Processing..." : "Buy Now"}
      </Button>
      <p className="mt-2 text-xs text-muted-foreground">
        Secure payment powered by Stripe. Instant digital delivery.
      </p>
    </form>
  );
}
