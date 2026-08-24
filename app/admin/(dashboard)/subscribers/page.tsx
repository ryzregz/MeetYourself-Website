import { prisma } from "@/lib/prisma";
import { SubscribersManager } from "./SubscribersManager";

export default async function AdminSubscribersPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({ orderBy: { subscribedAt: "desc" } });
  return <SubscribersManager subscribers={subscribers} />;
}
