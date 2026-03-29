import type { Metadata } from "next";
import { Container } from "@/components/container";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <Container className="py-24 max-w-2xl">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-4 text-muted-foreground">
        {SITE_NAME} respects your privacy. We collect only the information
        necessary to provide our services, including your email address and
        payment details processed securely through Stripe.
      </p>
      <p className="mt-4 text-muted-foreground">
        We do not sell or share your personal information with third parties.
      </p>
    </Container>
  );
}
