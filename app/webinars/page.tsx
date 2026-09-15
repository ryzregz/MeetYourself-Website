import { prisma } from "@/lib/prisma";
import { WebinarsClient } from "./WebinarsClient";

// This page reads live data (webinars, recordings) — without this, Next
// prerenders it once at build time and admin edits never show up until the
// next deploy.
export const dynamic = "force-dynamic";

export default async function WebinarsPage() {
  const [upcomingWebinars, recordings] = await Promise.all([
    prisma.webinar.findMany({ where: { status: "upcoming" }, orderBy: { startsAt: "asc" } }),
    prisma.recording.findMany({ where: { isPublished: true }, orderBy: { recordedAt: "desc" } }),
  ]);

  return <WebinarsClient upcomingWebinars={upcomingWebinars} recordings={recordings} />;
}
