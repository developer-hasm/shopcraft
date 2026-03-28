import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/container";
import { ProductCard } from "@/components/product-card";
import { CategoryFilter } from "@/components/category-filter";
import { ProductSearch } from "@/components/product-search";
import { getProducts } from "@/lib/queries/products";
import { getCategories } from "@/lib/queries/categories";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse our collection of premium digital products — templates, icons, fonts, and more.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const category =
    typeof params.category === "string" ? params.category : undefined;
  const search = typeof params.q === "string" ? params.q : undefined;

  const [products, categories] = await Promise.all([
    getProducts({ category, search }),
    getCategories(),
  ]);

  return (
    <Container className="py-12">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground">
          Browse our collection of premium digital products
        </p>
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CategoryFilter
          categories={categories}
          activeSlug={category}
          currentSearch={search}
        />
        <Suspense>
          <ProductSearch />
        </Suspense>
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No products found
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </Container>
  );
}
