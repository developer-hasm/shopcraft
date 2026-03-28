import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { createClient } from "@/lib/supabase/server";
import { getProductsBySeller } from "@/lib/queries/products";
import { formatPrice } from "@/lib/format";
import { LOGIN_PATH, DASHBOARD_PATH } from "@/config/auth";
import { PRODUCT_STATUS } from "@/config/products";
import { DeleteProductButton } from "@/components/delete-product-button";

export const metadata: Metadata = {
  title: "My Products",
};

export default async function MyProductsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(LOGIN_PATH);

  const products = await getProductsBySeller(user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Products</h1>
          <p className="text-muted-foreground">Manage your digital products</p>
        </div>
        <Link
          href={`${DASHBOARD_PATH}/products/new`}
          className={buttonVariants({ className: "gap-2" })}
        >
          <Plus className="h-4 w-4" />
          New Product
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="space-y-3">
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{product.title}</p>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {product.category_name}
                    </Badge>
                    <Badge
                      variant={
                        product.status === PRODUCT_STATUS.ACTIVE ? "default" : "secondary"
                      }
                      className="text-xs shrink-0"
                    >
                      {product.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatPrice(product.price)}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Link
                    href={`${DASHBOARD_PATH}/products/${product.id}/edit`}
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                  >
                    Edit
                  </Link>
                  <DeleteProductButton productId={product.id} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            You haven&apos;t created any products yet.
          </p>
          <Link
            href={`${DASHBOARD_PATH}/products/new`}
            className={buttonVariants({ className: "mt-4 gap-2" })}
          >
            <Plus className="h-4 w-4" />
            Create Your First Product
          </Link>
        </div>
      )}
    </div>
  );
}
