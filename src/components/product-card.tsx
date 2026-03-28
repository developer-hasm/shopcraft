import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { CATEGORY_EMOJI } from "@/types/product";
import type { ProductListItem, ProductCategory } from "@/types/product";

interface ProductCardProps {
  product: ProductListItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const emoji =
    CATEGORY_EMOJI[product.category_name as ProductCategory] ?? "📦";

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
        <div className="aspect-[4/3] bg-muted flex items-center justify-center">
          <span
            className="text-5xl text-muted-foreground/30"
            role="img"
            aria-hidden="true"
          >
            {emoji}
          </span>
        </div>
        <CardContent className="p-4">
          <Badge variant="secondary" className="mb-2 text-xs">
            {product.category_name}
          </Badge>
          <h3 className="font-semibold leading-tight group-hover:text-primary/80 transition-colors">
            {product.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {product.seller_nickname}
          </p>
          <p className="mt-2 text-lg font-bold">{formatPrice(product.price)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
