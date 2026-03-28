import type { Metadata } from "next";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { ProductCard } from "@/components/product-card";
import { ALL_PRODUCTS } from "@/data/products";
import { FILTER_OPTIONS } from "@/types/product";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: `Products | ${SITE_NAME}`,
  description: "Browse our collection of premium digital products — templates, icons, fonts, and more.",
};

export default function ProductsPage() {
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
        <div className="flex gap-2 overflow-x-auto" role="group" aria-label="Filter by category">
          {FILTER_OPTIONS.map((category) => (
            <Button
              key={category}
              variant={category === "All" ? "default" : "outline"}
              size="sm"
              aria-pressed={category === "All"}
            >
              {category}
            </Button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-9"
            aria-label="Search products"
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ALL_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </Container>
  );
}
