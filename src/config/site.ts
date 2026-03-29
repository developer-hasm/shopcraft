export const SITE_NAME = "ShopCraft";
export const SITE_DESCRIPTION =
  "Buy and sell digital products — templates, icons, graphics, and more.";

export const LOCALE = "ko-KR" as const;
export const CURRENCY = "KRW" as const;

export interface NavLink {
  href: string;
  label: string;
}

export const NAV_LINKS: readonly NavLink[] = [
  { href: "/products", label: "Products" },
  { href: "/products?category=templates", label: "Templates" },
  { href: "/products?category=icons", label: "Icons" },
  { href: "/products?category=graphics", label: "Graphics" },
  { href: "/products?category=ui-components", label: "UI Components" },
] as const;

export const FOOTER_PRODUCT_LINKS: readonly NavLink[] = [
  { href: "/products?category=templates", label: "Templates" },
  { href: "/products?category=icons", label: "Icons" },
  { href: "/products?category=graphics", label: "Graphics" },
  { href: "/products?category=ui-components", label: "UI Components" },
  { href: "/products?category=wallpapers", label: "Wallpapers" },
] as const;

export const FOOTER_COMPANY_LINKS: readonly NavLink[] = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_LEGAL_LINKS: readonly NavLink[] = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
] as const;
