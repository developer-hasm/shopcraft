"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DASHBOARD_PATH } from "@/config/auth";
import { MIN_PRODUCT_PRICE, PRODUCT_STATUS } from "@/config/products";

export interface ProductActionState {
  error?: string;
}

function validateString(
  value: FormDataEntryValue | null,
  fieldName: string
): string | ProductActionState {
  if (typeof value !== "string" || !value.trim()) {
    return { error: `${fieldName} is required.` };
  }
  return value.trim();
}

const PRODUCTS_DASHBOARD_PATH = `${DASHBOARD_PATH}/products`;

export async function createProduct(
  _prevState: ProductActionState | null,
  formData: FormData
): Promise<ProductActionState> {
  const title = validateString(formData.get("title"), "Title");
  if (typeof title !== "string") return title;

  const rawDescription = formData.get("description");
  const description =
    typeof rawDescription === "string" ? rawDescription.trim() || null : null;
  const priceStr = formData.get("price");
  const categoryId = validateString(formData.get("category_id"), "Category");
  if (typeof categoryId !== "string") return categoryId;

  if (typeof priceStr !== "string" || !priceStr) {
    return { error: "Price is required." };
  }

  const price = parseInt(priceStr, 10);
  if (isNaN(price) || price < MIN_PRODUCT_PRICE) {
    return { error: `Price must be at least ${MIN_PRODUCT_PRICE} KRW.` };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("products") as any).insert({
    title,
    description,
    price,
    category_id: categoryId,
    seller_id: user.id,
    status: PRODUCT_STATUS.ACTIVE,
  });

  if (error) {
    console.error("Create product error:", error);
    return { error: "Failed to create product. Please try again." };
  }

  revalidatePath(PRODUCTS_DASHBOARD_PATH);
  revalidatePath("/products");
  redirect(PRODUCTS_DASHBOARD_PATH);
}

export async function updateProduct(
  _prevState: ProductActionState | null,
  formData: FormData
): Promise<ProductActionState> {
  const productId = validateString(formData.get("productId"), "Product ID");
  if (typeof productId !== "string") return productId;

  const title = validateString(formData.get("title"), "Title");
  if (typeof title !== "string") return title;

  const rawDescription = formData.get("description");
  const description =
    typeof rawDescription === "string" ? rawDescription.trim() || null : null;
  const priceStr = formData.get("price");
  const categoryId = validateString(formData.get("category_id"), "Category");
  if (typeof categoryId !== "string") return categoryId;

  if (typeof priceStr !== "string" || !priceStr) {
    return { error: "Price is required." };
  }

  const price = parseInt(priceStr, 10);
  if (isNaN(price) || price < MIN_PRODUCT_PRICE) {
    return { error: `Price must be at least ${MIN_PRODUCT_PRICE} KRW.` };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: updated, error } = await (supabase.from("products") as any)
    .update({ title, description, price, category_id: categoryId })
    .eq("id", productId)
    .eq("seller_id", user.id)
    .select("id");

  if (error) {
    console.error("Update product error:", error);
    return { error: "Failed to update product. Please try again." };
  }

  if (!updated || updated.length === 0) {
    return { error: "Product not found or you don't have permission to edit it." };
  }

  revalidatePath(PRODUCTS_DASHBOARD_PATH);
  revalidatePath("/products");
  revalidatePath(`/products/${productId}`);
  redirect(PRODUCTS_DASHBOARD_PATH);
}

export async function deleteProduct(
  _prevState: ProductActionState | null,
  formData: FormData
): Promise<ProductActionState> {
  const productId = formData.get("productId");
  if (typeof productId !== "string" || !productId) {
    return { error: "Product ID is required." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  // Soft delete
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: deleted, error } = await (supabase.from("products") as any)
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", productId)
    .eq("seller_id", user.id)
    .select("id");

  if (error) {
    console.error("Delete product error:", error);
    return { error: "Failed to delete product. Please try again." };
  }

  if (!deleted || deleted.length === 0) {
    return { error: "Product not found or you don't have permission to delete it." };
  }

  revalidatePath(PRODUCTS_DASHBOARD_PATH);
  revalidatePath("/products");
  return {};
}
