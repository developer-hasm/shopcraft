"use client";

import { useActionState } from "react";
import { ImageIcon, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MIN_PRODUCT_PRICE,
  MAX_IMAGES_PER_PRODUCT,
  ALLOWED_IMAGE_TYPES,
} from "@/config/products";
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
    <form action={formAction} className="space-y-6 max-w-xl" encType="multipart/form-data">
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

      {/* Product Images */}
      <div className="space-y-2">
        <Label htmlFor="images">
          <span className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Product Images
          </span>
        </Label>
        <Input
          id="images"
          name="images"
          type="file"
          multiple
          accept={ALLOWED_IMAGE_TYPES.join(",")}
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">
          Upload up to {MAX_IMAGES_PER_PRODUCT} images (JPEG, PNG, WebP). Max 5MB each.
          {isEdit && " New images will be added to existing ones."}
        </p>
      </div>

      {/* Product File */}
      <div className="space-y-2">
        <Label htmlFor="productFile">
          <span className="flex items-center gap-2">
            <FileUp className="h-4 w-4" />
            Product File
          </span>
        </Label>
        <Input
          id="productFile"
          name="productFile"
          type="file"
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">
          Upload the digital product file (ZIP, PDF, etc.). Max 50MB.
          {isEdit && " Uploading a new file will add to existing files."}
        </p>
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
