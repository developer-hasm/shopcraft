"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProduct, type ProductActionState } from "@/app/actions/products";

interface DeleteProductButtonProps {
  productId: string;
}

export function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const [, formAction, isPending] = useActionState<
    ProductActionState | null,
    FormData
  >(deleteProduct, null);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!confirm("Are you sure you want to delete this product?")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="productId" value={productId} />
      <Button
        type="submit"
        variant="outline"
        size="sm"
        disabled={isPending}
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Delete product</span>
      </Button>
    </form>
  );
}
