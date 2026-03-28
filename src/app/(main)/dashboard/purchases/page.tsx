import type { Metadata } from "next";
import { getOrdersByBuyer } from "@/lib/queries/orders";
import { OrderCard } from "@/components/order-card";

export const metadata: Metadata = {
  title: "My Purchases",
};

export default async function PurchasesPage() {
  const orders = await getOrdersByBuyer();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Purchases</h1>
        <p className="text-muted-foreground">Your purchase history</p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          You haven&apos;t purchased anything yet.
        </p>
      )}
    </div>
  );
}
