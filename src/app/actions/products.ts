"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { uploadProductImage, uploadProductFile } from "@/lib/storage";
import { DASHBOARD_PATH } from "@/config/auth";
import {
  MIN_PRODUCT_PRICE,
  PRODUCT_STATUS,
  MAX_IMAGES_PER_PRODUCT,
} from "@/config/products";

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

  // Extract files from FormData
  const imageFiles = formData.getAll("images").filter(
    (f): f is File => f instanceof File && f.size > 0
  );
  const productFile = formData.get("productFile");
  const hasProductFile = productFile instanceof File && productFile.size > 0;

  if (imageFiles.length > MAX_IMAGES_PER_PRODUCT) {
    return { error: `Maximum ${MAX_IMAGES_PER_PRODUCT} images allowed.` };
  }

  // Create product first
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: newProduct, error } = await (supabase.from("products") as any)
    .insert({
      title,
      description,
      price,
      category_id: categoryId,
      seller_id: user.id,
      status: PRODUCT_STATUS.ACTIVE,
    })
    .select("id")
    .single();

  if (error || !newProduct) {
    console.error("Create product error:", error);
    return { error: "Failed to create product. Please try again." };
  }

  const productId = (newProduct as { id: string }).id;

  // Upload images
  for (let i = 0; i < imageFiles.length; i++) {
    try {
      const result = await uploadProductImage(imageFiles[i], user.id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("product_images") as any).insert({
        product_id: productId,
        url: result.url,
        sort_order: i,
      });
      // Update products.image_url with first image for backward compatibility
      if (i === 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("products") as any)
          .update({ image_url: result.url })
          .eq("id", productId);
      }
    } catch (err) {
      console.error("Image upload error:", err);
    }
  }

  // Upload product file
  if (hasProductFile) {
    try {
      const result = await uploadProductFile(productFile, user.id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("product_files") as any).insert({
        product_id: productId,
        file_name: result.fileName,
        file_path: result.path,
        file_size: result.fileSize,
        mime_type: result.mimeType,
      });
      // Update products.file_url for backward compatibility
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("products") as any)
        .update({ file_url: result.path })
        .eq("id", productId);
    } catch (err) {
      console.error("File upload error:", err);
      return { error: "Failed to upload product file. Please try again." };
    }
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

  // Handle new image uploads
  const imageFiles = formData.getAll("images").filter(
    (f): f is File => f instanceof File && f.size > 0
  );

  if (imageFiles.length > 0) {
    for (let i = 0; i < imageFiles.length; i++) {
      try {
        const result = await uploadProductImage(imageFiles[i], user.id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("product_images") as any).insert({
          product_id: productId,
          url: result.url,
          sort_order: i,
        });
        if (i === 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase.from("products") as any)
            .update({ image_url: result.url })
            .eq("id", productId);
        }
      } catch (err) {
        console.error("Image upload error:", err);
      }
    }
  }

  // Handle new product file
  const productFile = formData.get("productFile");
  if (productFile instanceof File && productFile.size > 0) {
    try {
      const result = await uploadProductFile(productFile, user.id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("product_files") as any).insert({
        product_id: productId,
        file_name: result.fileName,
        file_path: result.path,
        file_size: result.fileSize,
        mime_type: result.mimeType,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("products") as any)
        .update({ file_url: result.path })
        .eq("id", productId);
    } catch (err) {
      console.error("File upload error:", err);
    }
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
