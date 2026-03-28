import type { Metadata } from "next";
import { ProductForm } from "@/components/product-form";
import { getCategories } from "@/lib/queries/categories";

export const metadata: Metadata = {
  title: "New Product",
};

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New Product</h1>
        <p className="text-muted-foreground">
          Create a new digital product to sell
        </p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
