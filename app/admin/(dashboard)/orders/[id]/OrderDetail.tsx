"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Delivery, Order } from "@prisma/client";
import { Card, Select } from "@/components/ui";
import { formatKes } from "@/lib/format";

type OrderWithRelations = Order & { delivery: Delivery | null; book: { title: string; coverUrl: string } };

const PAYMENT_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "cancelled", label: "Cancelled" },
];

const FULFILLMENT_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "fulfilled", label: "Fulfilled" },
];

const DELIVERY_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
];

const sectionStyle = { display: "flex", flexDirection: "column" as const, gap: 4 };
const labelStyle = { fontSize: 12, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.04em", color: "var(--text-muted)" };
const valueStyle = { fontSize: 14, color: "var(--text-strong)" };

export function OrderDetail({ order: initialOrder }: { order: OrderWithRelations }) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);
  const [savingOrder, setSavingOrder] = useState(false);
  const [savingDelivery, setSavingDelivery] = useState(false);

  async function updateOrder(patch: Record<string, string>) {
    setSavingOrder(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrder((prev) => ({ ...prev, ...updated }));
        router.refresh();
      }
    } finally {
      setSavingOrder(false);
    }
  }

  async function updateDeliveryStatus(status: string) {
    if (!order.delivery) return;
    setSavingDelivery(true);
    try {
      const res = await fetch(`/api/admin/deliveries/${order.delivery.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrder((prev) => (prev.delivery ? { ...prev, delivery: { ...prev.delivery, ...updated } } : prev));
        router.refresh();
      }
    } finally {
      setSavingDelivery(false);
    }
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/admin/orders" style={{ fontSize: 13, color: "var(--text-muted)" }}>
          &larr; Back to orders
        </Link>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-strong)", marginTop: 8 }}>Order details</h1>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: 2 }}>{order.id}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Item */}
        <Card title="Item">
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ position: "relative", width: 56, height: 78, borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--gray-900)", flexShrink: 0 }}>
              <Image src={order.book.coverUrl} alt="" fill style={{ objectFit: "contain" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: "var(--text-strong)" }}>{order.bookTitleSnapshot}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{order.format}</div>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-strong)" }}>{formatKes(order.priceKes)}</div>
          </div>
        </Card>

        {/* Buyer */}
        <Card title="Buyer">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            <div style={sectionStyle}>
              <span style={labelStyle}>Name</span>
              <span style={valueStyle}>{order.buyerName ?? order.delivery?.recipientName ?? "—"}</span>
            </div>
            <div style={sectionStyle}>
              <span style={labelStyle}>Email</span>
              <span style={valueStyle}>{order.buyerEmail ?? "—"}</span>
            </div>
            <div style={sectionStyle}>
              <span style={labelStyle}>Phone</span>
              <span style={valueStyle}>{order.buyerPhone ?? order.delivery?.phone ?? "—"}</span>
            </div>
          </div>
          {!order.delivery && order.deliveryMethod && (
            <div style={{ marginTop: 14 }}>
              <span style={labelStyle}>Ebook delivery method</span>
              <div style={valueStyle}>{order.deliveryMethod === "email" ? "Email" : "WhatsApp"}</div>
            </div>
          )}
        </Card>

        {/* Payment */}
        <Card title="Payment">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, alignItems: "end" }}>
            <div style={sectionStyle}>
              <span style={labelStyle}>Method</span>
              <span style={valueStyle}>{order.paymentMethod === "mpesa_stk" ? "M-PESA STK push" : "M-PESA paybill"}</span>
            </div>
            <div>
              <Select
                label="Status"
                options={PAYMENT_OPTIONS}
                value={order.paymentStatus}
                disabled={savingOrder}
                onChange={(e) => updateOrder({ paymentStatus: e.target.value })}
              />
            </div>
            <div>
              <Select
                label="Fulfillment"
                options={FULFILLMENT_OPTIONS}
                value={order.fulfillmentStatus}
                disabled={savingOrder}
                onChange={(e) => updateOrder({ fulfillmentStatus: e.target.value })}
              />
            </div>
          </div>
          <div style={{ marginTop: 14, fontSize: 12, color: "var(--text-muted)" }}>
            Placed {order.createdAt.toLocaleString("en-US")} &middot; Last updated {order.updatedAt.toLocaleString("en-US")}
          </div>
        </Card>

        {/* Delivery */}
        <Card
          title="Delivery"
          subtitle={order.delivery ? "Physical book" : "Not required — digital delivery"}
        >
          {order.delivery ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                <div style={sectionStyle}>
                  <span style={labelStyle}>Recipient</span>
                  <span style={valueStyle}>{order.delivery.recipientName}</span>
                </div>
                <div style={sectionStyle}>
                  <span style={labelStyle}>Phone</span>
                  <span style={valueStyle}>{order.delivery.phone}</span>
                </div>
                <div style={sectionStyle}>
                  <span style={labelStyle}>County</span>
                  <span style={valueStyle}>{order.delivery.county}</span>
                </div>
                <div style={sectionStyle}>
                  <span style={labelStyle}>Address</span>
                  <span style={valueStyle}>{order.delivery.addressLine}</span>
                </div>
                {order.delivery.coordinates && (
                  <div style={sectionStyle}>
                    <span style={labelStyle}>Coordinates</span>
                    <span style={{ ...valueStyle, fontFamily: "var(--font-mono)" }}>{order.delivery.coordinates}</span>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 180 }}>
                  <Select
                    label="Delivery status"
                    options={DELIVERY_STATUS_OPTIONS}
                    value={order.delivery.status}
                    disabled={savingDelivery}
                    onChange={(e) => updateDeliveryStatus(e.target.value)}
                  />
                </div>
                {order.delivery.shippedAt && (
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Shipped {order.delivery.shippedAt.toLocaleString("en-US")}</div>
                )}
                {order.delivery.deliveredAt && (
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Delivered {order.delivery.deliveredAt.toLocaleString("en-US")}</div>
                )}
              </div>
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)" }}>
              This is an ebook order — nothing to ship. It&rsquo;s delivered to the buyer&rsquo;s{" "}
              {order.deliveryMethod === "whatsapp" ? "WhatsApp number" : "email address"} above once marked fulfilled.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
