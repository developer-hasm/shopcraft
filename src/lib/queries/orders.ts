import { createClient } from "@/lib/supabase/server";

export interface OrderListItem {
  id: string;
  product_id: string;
  product_title: string;
  amount: number;
  status: string;
  created_at: string;
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

  return (data as unknown as Array<{
    id: string;
    product_id: string;
    amount: number;
    status: string;
    created_at: string;
    products: { title: string } | null;
  }>).map((order) => ({
    id: order.id,
    product_id: order.product_id,
    product_title: order.products?.title ?? "Unknown Product",
    amount: order.amount,
    status: order.status,
    created_at: order.created_at,
  }));
}
