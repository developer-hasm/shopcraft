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

// Upload constraints
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_IMAGES_PER_PRODUCT = 5;
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
export const SIGNED_URL_EXPIRY_SECONDS = 3600; // 60 minutes

// Storage bucket names
export const STORAGE_BUCKET_IMAGES = "product-images";
export const STORAGE_BUCKET_FILES = "product-files";
