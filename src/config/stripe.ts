export const STRIPE_CURRENCY = "krw" as const;

export const CHECKOUT_SUCCESS_PATH = "/checkout/success";
export const CHECKOUT_CANCEL_PATH = "/checkout/cancel";

export const ORDER_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
