export const PRODUCT_CATEGORIES = [
  "Templates",
  "Icons",
  "Graphics",
  "UI Components",
  "Wallpapers",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const FILTER_OPTIONS = ["All", ...PRODUCT_CATEGORIES] as const;

export const CATEGORY_EMOJI: Record<ProductCategory, string> = {
  Templates: "📄",
  Icons: "🎨",
  Graphics: "🖼️",
  "UI Components": "🧩",
  Wallpapers: "🌄",
};

/** Product list item returned from Supabase join queries */
export interface ProductListItem {
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
  category_name: string;
  category_slug: string;
  seller_nickname: string;
}

/** Category from the database */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
}
