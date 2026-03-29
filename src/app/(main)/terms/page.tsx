import type { Metadata } from "next";
import { Container } from "@/components/container";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <Container className="py-24 max-w-2xl">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="mt-4 text-muted-foreground">
        By using {SITE_NAME}, you agree to these terms. All digital products are
        sold as-is. Refunds are handled on a case-by-case basis.
      </p>
      <p className="mt-4 text-muted-foreground">
        Sellers are responsible for ensuring they have the rights to sell their
        digital products.
      </p>
    </Container>
  );
}
