import { DASHBOARD_PATH } from "@/config/auth";

export interface DashboardNavItem {
  href: string;
  label: string;
}

export const DASHBOARD_NAV: DashboardNavItem[] = [
  { href: DASHBOARD_PATH, label: "Overview" },
  { href: `${DASHBOARD_PATH}/purchases`, label: "My Purchases" },
  { href: `${DASHBOARD_PATH}/products`, label: "My Products" },
  { href: `${DASHBOARD_PATH}/settings`, label: "Settings" },
];
