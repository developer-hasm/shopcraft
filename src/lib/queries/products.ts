import { createClient } from "@/lib/supabase/server";
import { FEATURED_PRODUCTS_LIMIT } from "@/config/products";
import type { ProductListItem } from "@/types/product";

const PRODUCT_SELECT = `
  id, title, description, price, image_url, status, is_featured,
  created_at, seller_id, category_id,
  categories(name, slug),
  profiles(nickname)
` as const;

interface ProductQueryRaw {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
  status: string;
  is_featured: boolean;
  created_at: string;
  seller_id: string;
  category_id: string;
  categories: { name: string; slug: string } | null;
  profiles: { nickname: string } | null;
}

function flattenProduct(raw: ProductQueryRaw): ProductListItem {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    price: raw.price,
    image_url: raw.image_url,
    status: raw.status,
    is_featured: raw.is_featured,
    created_at: raw.created_at,
    seller_id: raw.seller_id,
    category_id: raw.category_id,
    category_name: raw.categories?.name ?? "Unknown",
    category_slug: raw.categories?.slug ?? "unknown",
    seller_nickname: raw.profiles?.nickname ?? "Unknown",
  };
}

interface GetProductsOptions {
  category?: string;
  search?: string;
}

export async function getProducts(
  options: GetProductsOptions = {}
): Promise<ProductListItem[]> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .is("deleted_at", null);

  if (options.category) {
    // First get the category ID by slug, then filter
    const { data: catData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", options.category)
      .single<{ id: string }>();

    if (catData) {
      query = query.eq("category_id", catData.id);
    }
  }

  if (options.search) {
    query = query.ilike("title", `%${options.search}%`);
  }

  const { data, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error || !data) return [];

  return (data as unknown as ProductQueryRaw[]).map(flattenProduct);
}

export async function getFeaturedProducts(): Promise<ProductListItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(FEATURED_PRODUCTS_LIMIT);

  if (error || !data) return [];

  return (data as unknown as ProductQueryRaw[]).map(flattenProduct);
}

export async function getProductsBySeller(
  userId: string
): Promise<ProductListItem[]> {
  const supabase = await createClient();

  // Seller can see all their products including draft/inactive
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("seller_id", userId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return (data as unknown as ProductQueryRaw[]).map(flattenProduct);
}

export async function getProductById(
  id: string
): Promise<ProductListItem | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error || !data) return null;

  return flattenProduct(data as unknown as ProductQueryRaw);
}
