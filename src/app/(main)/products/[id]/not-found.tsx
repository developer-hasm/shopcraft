import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";

export default function ProductNotFound() {
  return (
    <Container className="py-24 text-center">
      <h1 className="text-4xl font-bold">Product Not Found</h1>
      <p className="mt-4 text-muted-foreground">
        The product you&apos;re looking for doesn&apos;t exist or has been
        removed.
      </p>
      <Link href="/products" className="mt-8 inline-block">
        <Button>Browse Products</Button>
      </Link>
    </Container>
  );
}
