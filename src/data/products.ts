import type { Product } from "@/types/product";

export const FEATURED_PRODUCTS: readonly Product[] = [
  {
    id: 1,
    title: "Minimal Dashboard UI Kit",
    creator: "DesignStudio",
    price: 12000,
    category: "Templates",
  },
  {
    id: 2,
    title: "3D Icon Pack - 100 Icons",
    creator: "IconMaster",
    price: 8000,
    category: "Icons",
  },
  {
    id: 3,
    title: "Modern Sans-Serif Font",
    creator: "TypeFoundry",
    price: 5000,
    category: "Fonts",
  },
  {
    id: 4,
    title: "Notion Template Bundle",
    creator: "ProductivityPro",
    price: 3000,
    category: "Templates",
  },
];

export const ALL_PRODUCTS: readonly Product[] = [
  ...FEATURED_PRODUCTS,
  {
    id: 5,
    title: "Landing Page Kit",
    creator: "WebCraft",
    price: 15000,
    category: "Templates",
  },
  {
    id: 6,
    title: "Hand-drawn Icon Set",
    creator: "Sketcher",
    price: 6000,
    category: "Icons",
  },
];
