export const PRODUCT_CATEGORIES = [
  "Templates",
  "Icons",
  "Fonts",
  "Graphics",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const FILTER_OPTIONS = ["All", ...PRODUCT_CATEGORIES] as const;

export interface Product {
  id: number;
  title: string;
  creator: string;
  price: number;
  category: ProductCategory;
  image?: string;
}

export const CATEGORY_EMOJI: Record<ProductCategory, string> = {
  Templates: "📄",
  Icons: "🎨",
  Fonts: "🔤",
  Graphics: "🖼️",
};
