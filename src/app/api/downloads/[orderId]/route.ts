import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSignedDownloadUrl } from "@/lib/storage";
import { ORDER_STATUS } from "@/config/stripe";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify order ownership and status
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, buyer_id, product_id, status")
    .eq("id", orderId)
    .single<{
      id: string;
      buyer_id: string;
      product_id: string;
      status: string;
    }>();

  if (orderError || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.buyer_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (order.status !== ORDER_STATUS.COMPLETED) {
    return NextResponse.json(
      { error: "Order is not completed" },
      { status: 400 }
    );
  }

  // Get product file
  const { data: productFile } = await supabase
    .from("product_files")
    .select("file_path, file_name")
    .eq("product_id", order.product_id)
    .limit(1)
    .single<{ file_path: string; file_name: string }>();

  if (!productFile) {
    return NextResponse.json(
      { error: "No downloadable file found" },
      { status: 404 }
    );
  }

  // Generate signed URL
  const signedUrl = await getSignedDownloadUrl(productFile.file_path);

  if (!signedUrl) {
    return NextResponse.json(
      { error: "Failed to generate download URL" },
      { status: 500 }
    );
  }

  // Record download
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from("downloads") as any).insert({
    order_id: orderId,
    user_id: user.id,
  });

  return NextResponse.json({
    downloadUrl: signedUrl,
    fileName: productFile.file_name,
  });
}
