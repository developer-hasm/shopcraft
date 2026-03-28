"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MIN_PRODUCT_PRICE } from "@/config/products";
import {
  createProduct,
  updateProduct,
  type ProductActionState,
} from "@/app/actions/products";
import type { Category, ProductListItem } from "@/types/product";

interface ProductFormProps {
  categories: Category[];
  product?: ProductListItem;
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const isEdit = !!product;
  const action = isEdit ? updateProduct : createProduct;
  const [state, formAction, isPending] = useActionState<
    ProductActionState | null,
    FormData
  >(action, null);

  return (
    <form action={formAction} className="space-y-6 max-w-xl">
      {isEdit && (
        <input type="hidden" name="productId" value={product.id} />
      )}

      {state?.error && (
        <div
          role="alert"
          className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={product?.title}
          placeholder="Product title"
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={product?.description ?? ""}
          placeholder="Describe your product..."
          disabled={isPending}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price (KRW)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          required
          min={MIN_PRODUCT_PRICE}
          step={100}
          defaultValue={product?.price}
          placeholder="1000"
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category_id">Category</Label>
        <select
          id="category_id"
          name="category_id"
          required
          defaultValue={product?.category_id}
          disabled={isPending}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending
          ? "Saving..."
          : isEdit
            ? "Update Product"
            : "Create Product"}
      </Button>
    </form>
  );
}
