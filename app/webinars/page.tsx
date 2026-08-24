import { prisma } from "@/lib/prisma";
import { WebinarsClient } from "./WebinarsClient";

export default async function WebinarsPage() {
  const [upcomingWebinars, recordings] = await Promise.all([
    prisma.webinar.findMany({ where: { status: "upcoming" }, orderBy: { startsAt: "asc" } }),
    prisma.recording.findMany({ where: { isPublished: true }, orderBy: { recordedAt: "desc" } }),
  ]);

  return <WebinarsClient upcomingWebinars={upcomingWebinars} recordings={recordings} />;
}
