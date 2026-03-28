export const PRODUCTS_PER_PAGE = 12;
export const FEATURED_PRODUCTS_LIMIT = 4;
export const SEARCH_DEBOUNCE_MS = 300;
export const MIN_PRODUCT_PRICE = 100;

export const PRODUCT_STATUS = {
  DRAFT: "draft",
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type ProductStatus = (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];
