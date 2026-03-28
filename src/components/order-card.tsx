import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { ORDER_STATUS } from "@/config/stripe";
import type { OrderListItem } from "@/lib/queries/orders";

interface OrderCardProps {
  order: OrderListItem;
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="font-medium">{order.product_title}</p>
          <p className="text-sm text-muted-foreground">
            {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant={
              order.status === ORDER_STATUS.COMPLETED ? "default" : "secondary"
            }
          >
            {order.status}
          </Badge>
          <p className="font-semibold">{formatPrice(order.amount)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
