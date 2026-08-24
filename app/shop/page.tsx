import { prisma } from "@/lib/prisma";
import { ShopClient } from "./ShopClient";

export default async function ShopPage(props: PageProps<"/shop">) {
  const searchParams = await props.searchParams;
  const buy = searchParams.buy;
  const initialBuyId = Array.isArray(buy) ? buy[0] : buy;

  const books = await prisma.book.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } });

  return <ShopClient books={books} initialBuyId={initialBuyId} />;
}
