import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/container";
import { BuyButton } from "@/components/buy-button";
import { formatPrice } from "@/lib/format";
import { getProductById } from "@/lib/queries/products";
import { createClient } from "@/lib/supabase/server";
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
  const [product, supabase] = await Promise.all([
    getProductById(id),
    createClient(),
  ]);

  if (!product) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

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
        <div className="aspect-[4/3] rounded-xl bg-muted flex items-center justify-center relative overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              className="object-cover rounded-xl"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <span
              className="text-8xl text-muted-foreground/30"
              role="img"
              aria-hidden="true"
            >
              {emoji}
            </span>
          )}
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
            <div className="mt-4">
              <BuyButton productId={product.id} isLoggedIn={!!user} />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
