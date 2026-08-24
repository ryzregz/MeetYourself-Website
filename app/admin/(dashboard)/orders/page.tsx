import { prisma } from "@/lib/prisma";
import { OrdersManager } from "./OrdersManager";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { delivery: true, book: { select: { title: true, coverUrl: true } } },
  });
  return <OrdersManager orders={orders} />;
}
