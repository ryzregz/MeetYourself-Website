import Link from "next/link";
import type { Delivery, Order } from "@prisma/client";
import { Badge, Button } from "@/components/ui";
import { adminStyles } from "@/components/admin/adminStyles";
import { formatKes } from "@/lib/format";

type OrderWithRelations = Order & { delivery: Delivery | null; book: { title: string; coverUrl: string } };

const PAYMENT_TONE: Record<string, "success" | "neutral" | "error" | "warning"> = {
  paid: "success",
  pending: "warning",
  failed: "error",
  cancelled: "neutral",
};

export function OrdersManager({ orders }: { orders: OrderWithRelations[] }) {
  return (
    <div>
      <div style={adminStyles.header}>
        <h1 style={adminStyles.title}>Orders</h1>
      </div>

      <div style={adminStyles.tableWrap}>
        <table style={adminStyles.table}>
          <thead>
            <tr>
              <th style={adminStyles.th}>Book</th>
              <th style={adminStyles.th}>Buyer</th>
              <th style={adminStyles.th}>Price</th>
              <th style={adminStyles.th}>Payment</th>
              <th style={adminStyles.th}>Requires delivery</th>
              <th style={adminStyles.th}>Placed</th>
              <th style={adminStyles.th} />
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td style={adminStyles.td}>
                  <div style={{ fontWeight: 600, color: "var(--text-strong)" }}>{order.bookTitleSnapshot}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{order.format}</div>
                </td>
                <td style={adminStyles.td}>
                  <div>{order.buyerName ?? order.delivery?.recipientName ?? "—"}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{order.buyerEmail ?? order.buyerPhone ?? ""}</div>
                </td>
                <td style={adminStyles.td}>{formatKes(order.priceKes)}</td>
                <td style={adminStyles.td}>
                  <Badge tone={PAYMENT_TONE[order.paymentStatus] ?? "neutral"} variant="soft">
                    {order.paymentStatus}
                  </Badge>
                </td>
                <td style={adminStyles.td}>
                  {order.delivery ? (
                    <Badge tone="brand" variant="soft">
                      Yes &middot; {order.delivery.status}
                    </Badge>
                  ) : (
                    <Badge tone="neutral" variant="soft">
                      No
                    </Badge>
                  )}
                </td>
                <td style={adminStyles.td}>{order.createdAt.toLocaleDateString("en-US")}</td>
                <td style={adminStyles.td}>
                  <Link href={`/admin/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td style={adminStyles.emptyState} colSpan={7}>
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
