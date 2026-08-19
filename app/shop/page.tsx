import { ShopClient } from "./ShopClient";

export default async function ShopPage(props: PageProps<"/shop">) {
  const searchParams = await props.searchParams;
  const buy = searchParams.buy;
  const initialBuyId = Array.isArray(buy) ? buy[0] : buy;

  return <ShopClient initialBuyId={initialBuyId} />;
}
