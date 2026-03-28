import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShoppingCart, DollarSign, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderCard } from "@/components/order-card";
import { createClient } from "@/lib/supabase/server";
import { getSellerStats, getOrdersByBuyer } from "@/lib/queries/orders";
import { formatPrice } from "@/lib/format";
import { LOGIN_PATH } from "@/config/auth";
import { ORDER_STATUS } from "@/config/stripe";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(LOGIN_PATH);

  const [stats, recentPurchases] = await Promise.all([
    getSellerStats(user.id),
    getOrdersByBuyer(),
  ]);

  const RECENT_LIMIT = 5;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your sales and purchases
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalSales}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatPrice(stats.totalRevenue)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Purchases</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalPurchases}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Purchases */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Purchases</h2>
        {recentPurchases.length > 0 ? (
          <div className="space-y-3">
            {recentPurchases.slice(0, RECENT_LIMIT).map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No purchases yet.</p>
        )}
      </div>
    </div>
  );
}
