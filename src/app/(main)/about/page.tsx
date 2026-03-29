import type { Metadata } from "next";
import { Container } from "@/components/container";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <Container className="py-24 max-w-2xl">
      <h1 className="text-3xl font-bold">About {SITE_NAME}</h1>
      <p className="mt-4 text-muted-foreground">
        {SITE_NAME} is a digital product marketplace where creators can sell
        templates, icons, fonts, and other digital assets. Built as a portfolio
        project with Next.js, Supabase, and Stripe.
      </p>
    </Container>
  );
}
