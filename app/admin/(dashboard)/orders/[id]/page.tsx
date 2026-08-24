import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OrderDetail } from "./OrderDetail";

export default async function AdminOrderDetailPage(props: PageProps<"/admin/orders/[id]">) {
  const { id } = await props.params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { delivery: true, book: { select: { title: true, coverUrl: true } } },
  });
  if (!order) notFound();

  return <OrderDetail order={order} />;
}
