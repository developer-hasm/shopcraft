import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { Container } from "@/components/container";
import { POST_LOGIN_REDIRECT } from "@/config/auth";

const PRODUCTS_PATH = "/products";

export const metadata: Metadata = {
  title: "Payment Successful",
};

export default function CheckoutSuccessPage() {
  return (
    <Container className="py-24 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="h-8 w-8 text-green-600" aria-hidden="true" />
      </div>
      <h1 className="mt-6 text-3xl font-bold">Payment Successful!</h1>
      <p className="mt-4 text-muted-foreground">
        Thank you for your purchase. Your digital product is ready.
      </p>
      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Link
          href={PRODUCTS_PATH}
          className={buttonVariants()}
        >
          Browse More Products
        </Link>
        <Link
          href={POST_LOGIN_REDIRECT}
          className={buttonVariants({ variant: "outline" })}
        >
          Back to Home
        </Link>
      </div>
    </Container>
  );
}
