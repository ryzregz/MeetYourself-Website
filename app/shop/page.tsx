import { prisma } from "@/lib/prisma";
import { ShopClient } from "./ShopClient";

// Already dynamic in practice (reads searchParams below), but explicit so a
// future refactor can't silently make book listings go stale.
export const dynamic = "force-dynamic";

export default async function ShopPage(props: PageProps<"/shop">) {
  const searchParams = await props.searchParams;
  const buy = searchParams.buy;
  const initialBuyId = Array.isArray(buy) ? buy[0] : buy;

  const books = await prisma.book.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } });

  return <ShopClient books={books} initialBuyId={initialBuyId} />;
}
