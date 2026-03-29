"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { ORDER_STATUS } from "@/config/stripe";
import type { OrderListItem } from "@/lib/queries/orders";

interface OrderCardProps {
  order: OrderListItem;
  showDownload?: boolean;
}

export function OrderCard({ order, showDownload = false }: OrderCardProps) {
  async function handleDownload() {
    try {
      const res = await fetch(`/api/downloads/${order.id}`);
      const data = await res.json();
      if (data.downloadUrl) {
        window.open(data.downloadUrl, "_blank");
      } else {
        alert(data.error || "Download failed");
      }
    } catch {
      alert("Download failed. Please try again.");
    }
  }

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
          {showDownload && order.status === ORDER_STATUS.COMPLETED && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={handleDownload}
            >
              <Download className="h-3 w-3" />
              Download
            </Button>
          )}
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
