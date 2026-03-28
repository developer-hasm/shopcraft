import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Payment Cancelled",
};

export default function CheckoutCancelPage() {
  return (
    <Container className="py-24 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <XCircle className="h-8 w-8 text-muted-foreground" />
      </div>
      <h1 className="mt-6 text-3xl font-bold">Payment Cancelled</h1>
      <p className="mt-4 text-muted-foreground">
        Your payment was cancelled. No charges were made.
      </p>
      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </Container>
  );
}
