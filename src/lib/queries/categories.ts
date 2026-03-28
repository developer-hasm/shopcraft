import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/types/product";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, description, sort_order")
    .order("sort_order");

  if (error || !data) return [];

  return data;
}
