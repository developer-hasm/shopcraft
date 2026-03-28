import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ProductForm } from "@/components/product-form";
import { getProductById } from "@/lib/queries/products";
import { getCategories } from "@/lib/queries/categories";
import { createClient } from "@/lib/supabase/server";
import { LOGIN_PATH } from "@/config/auth";

export const metadata: Metadata = {
  title: "Edit Product",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories, supabase] = await Promise.all([
    getProductById(id),
    getCategories(),
    createClient(),
  ]);

  if (!product) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(LOGIN_PATH);

  // Ownership check: only the seller can edit their product
  if (product.seller_id !== user.id) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
        <p className="text-muted-foreground">Update your product details</p>
      </div>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
