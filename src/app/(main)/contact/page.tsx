import type { Metadata } from "next";
import { Container } from "@/components/container";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <Container className="py-24 max-w-2xl">
      <h1 className="text-3xl font-bold">Contact</h1>
      <p className="mt-4 text-muted-foreground">
        Have questions or feedback? Reach out to us at{" "}
        <a href="mailto:developer.hasm@gmail.com" className="text-primary hover:underline">
          developer.hasm@gmail.com
        </a>
      </p>
    </Container>
  );
}
