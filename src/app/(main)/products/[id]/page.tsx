import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/container";
import { formatPrice } from "@/lib/format";
import { getProductById } from "@/lib/queries/products";
import { CATEGORY_EMOJI } from "@/types/product";
import type { ProductCategory } from "@/types/product";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.title,
    description:
      product.description ?? `${product.title} by ${product.seller_nickname}`,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const emoji =
    CATEGORY_EMOJI[product.category_name as ProductCategory] ?? "📦";

  return (
    <Container className="py-12">
      {/* Back link */}
      <Link
        href="/products"
        className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Image / Preview */}
        <div className="aspect-[4/3] rounded-xl bg-muted flex items-center justify-center">
          <span
            className="text-8xl text-muted-foreground/30"
            role="img"
            aria-hidden="true"
          >
            {emoji}
          </span>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <Badge variant="secondary" className="w-fit mb-3">
            {product.category_name}
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">
            {product.title}
          </h1>

          {/* Seller */}
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{product.seller_nickname}</span>
          </div>

          <Separator className="my-6" />

          {/* Description */}
          {product.description && (
            <div className="prose prose-sm text-muted-foreground">
              <p>{product.description}</p>
            </div>
          )}

          {/* Price + Buy */}
          <div className="mt-auto pt-8">
            <p className="text-3xl font-bold">{formatPrice(product.price)}</p>
            <Button size="lg" className="mt-4 w-full sm:w-auto" disabled>
              Buy Now (Coming Soon)
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">
              Secure payment powered by Stripe. Instant digital delivery.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
