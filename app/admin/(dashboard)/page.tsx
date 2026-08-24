import Link from "next/link";
import { Card } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { formatKes } from "@/lib/format";
import { adminStyles } from "@/components/admin/adminStyles";

interface BookSalesRow {
  bookId: string;
  title: string;
  format: string;
  units: number;
  revenue: number;
}

export default async function AdminOverviewPage() {
  const [upcomingWebinars, pendingOrders, pendingDeliveries, totalRegistrations, subscriberCount, paidOrders] =
    await Promise.all([
      prisma.webinar.count({ where: { status: "upcoming" } }),
      prisma.order.count({ where: { paymentStatus: "paid", fulfillmentStatus: "pending" } }),
      prisma.delivery.count({ where: { status: { not: "delivered" } } }),
      prisma.webinarRegistration.count(),
      prisma.newsletterSubscriber.count({ where: { status: "subscribed" } }),
      prisma.order.findMany({
        where: { paymentStatus: "paid" },
        select: { bookId: true, bookTitleSnapshot: true, format: true, priceKes: true },
      }),
    ]);

  const stats = [
    { label: "Upcoming webinars", value: upcomingWebinars },
    { label: "Orders to fulfil", value: pendingOrders },
    { label: "Deliveries in progress", value: pendingDeliveries },
    { label: "Total registrations", value: totalRegistrations },
    { label: "Newsletter subscribers", value: subscriberCount },
  ];

  // Book sales analysis — derived from paid orders (small dataset for a site
  // like this, so aggregating in JS beats a second round-trip with groupBy).
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.priceKes, 0);
  const totalUnits = paidOrders.length;
  const ebookRevenue = paidOrders.filter((o) => o.format === "Ebook").reduce((sum, o) => sum + o.priceKes, 0);
  const physicalRevenue = paidOrders.filter((o) => o.format === "Physical book").reduce((sum, o) => sum + o.priceKes, 0);

  const byBook = new Map<string, BookSalesRow>();
  for (const o of paidOrders) {
    const existing = byBook.get(o.bookId);
    if (existing) {
      existing.units += 1;
      existing.revenue += o.priceKes;
    } else {
      byBook.set(o.bookId, { bookId: o.bookId, title: o.bookTitleSnapshot, format: o.format, units: 1, revenue: o.priceKes });
    }
  }
  const topBooks = [...byBook.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 8);

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-strong)", marginBottom: 24 }}>Overview</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        {stats.map((s) => (
          <Card key={s.label}>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text-strong)" }}>{s.value}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-strong)" }}>Book sales</h2>
        <Link href="/admin/orders" style={{ fontSize: 13, fontWeight: 600 }}>
          View all orders &rarr;
        </Link>
      </div>

      {totalUnits === 0 ? (
        <Card>
          <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)" }}>No paid orders yet.</p>
        </Card>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 16 }}>
            <Card>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 6 }}>Total revenue</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--text-strong)" }}>{formatKes(totalRevenue)}</div>
            </Card>
            <Card>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 6 }}>Books sold</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--text-strong)" }}>{totalUnits}</div>
            </Card>
            <Card>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 6 }}>Ebook revenue</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--text-strong)" }}>{formatKes(ebookRevenue)}</div>
            </Card>
            <Card>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 6 }}>Physical book revenue</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--text-strong)" }}>{formatKes(physicalRevenue)}</div>
            </Card>
          </div>

          <div style={adminStyles.tableWrap}>
            <table style={adminStyles.table}>
              <thead>
                <tr>
                  <th style={adminStyles.th}>Book</th>
                  <th style={adminStyles.th}>Format</th>
                  <th style={adminStyles.th}>Units sold</th>
                  <th style={adminStyles.th}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topBooks.map((b) => (
                  <tr key={b.bookId}>
                    <td style={adminStyles.td}>{b.title}</td>
                    <td style={adminStyles.td}>{b.format}</td>
                    <td style={adminStyles.td}>{b.units}</td>
                    <td style={adminStyles.td}>{formatKes(b.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
