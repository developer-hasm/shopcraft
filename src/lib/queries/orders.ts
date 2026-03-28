import { createClient } from "@/lib/supabase/server";
import { ORDER_STATUS } from "@/config/stripe";

export interface OrderListItem {
  id: string;
  product_id: string;
  product_title: string;
  amount: number;
  status: string;
  created_at: string;
}

export interface SellerStats {
  totalSales: number;
  totalRevenue: number;
  totalPurchases: number;
}

type OrderQueryRaw = {
  id: string;
  product_id: string;
  amount: number;
  status: string;
  created_at: string;
  products: { title: string } | null;
};

function mapOrderRows(data: unknown): OrderListItem[] {
  return (data as OrderQueryRaw[]).map((order) => ({
    id: order.id,
    product_id: order.product_id,
    product_title: order.products?.title ?? "Unknown Product",
    amount: order.amount,
    status: order.status,
    created_at: order.created_at,
  }));
}

export async function getOrdersByBuyer(): Promise<OrderListItem[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("orders")
    .select("id, product_id, amount, status, created_at, products(title)")
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return mapOrderRows(data);
}

export async function getSellerOrders(
  userId: string
): Promise<OrderListItem[]> {
  const supabase = await createClient();

  // Get orders where the product's seller_id matches the user
  const { data: sellerProducts } = await supabase
    .from("products")
    .select("id")
    .eq("seller_id", userId);

  if (!sellerProducts || sellerProducts.length === 0) return [];

  const productIds = sellerProducts.map((p) => (p as { id: string }).id);

  const { data, error } = await supabase
    .from("orders")
    .select("id, product_id, amount, status, created_at, products(title)")
    .in("product_id", productIds)
    .eq("status", ORDER_STATUS.COMPLETED)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return mapOrderRows(data);
}

export async function getSellerStats(userId: string): Promise<SellerStats> {
  const supabase = await createClient();

  // Get seller's completed orders
  const { data: sellerProducts } = await supabase
    .from("products")
    .select("id")
    .eq("seller_id", userId);

  let totalSales = 0;
  let totalRevenue = 0;

  if (sellerProducts && sellerProducts.length > 0) {
    const productIds = sellerProducts.map((p) => (p as { id: string }).id);

    const { data: salesData } = await supabase
      .from("orders")
      .select("amount")
      .in("product_id", productIds)
      .eq("status", ORDER_STATUS.COMPLETED);

    if (salesData) {
      totalSales = salesData.length;
      totalRevenue = salesData.reduce(
        (sum, order) => sum + (order as { amount: number }).amount,
        0
      );
    }
  }

  // Get buyer's purchases count
  const { data: purchaseData } = await supabase
    .from("orders")
    .select("id")
    .eq("buyer_id", userId)
    .eq("status", ORDER_STATUS.COMPLETED);

  const totalPurchases = purchaseData?.length ?? 0;

  return { totalSales, totalRevenue, totalPurchases };
}
