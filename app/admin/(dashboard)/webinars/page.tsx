import { prisma } from "@/lib/prisma";
import { WebinarsManager } from "./WebinarsManager";

export default async function AdminWebinarsPage() {
  const webinars = await prisma.webinar.findMany({
    orderBy: { startsAt: "asc" },
    include: { _count: { select: { registrations: true } } },
  });
  return <WebinarsManager webinars={webinars} />;
}
