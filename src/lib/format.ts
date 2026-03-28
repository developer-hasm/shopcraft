import { LOCALE, CURRENCY } from "@/config/site";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY,
  }).format(price);
}
