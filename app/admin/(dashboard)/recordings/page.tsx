import { prisma } from "@/lib/prisma";
import { RecordingsManager } from "./RecordingsManager";

export default async function AdminRecordingsPage() {
  const recordings = await prisma.recording.findMany({ orderBy: { recordedAt: "desc" } });
  return <RecordingsManager recordings={recordings} />;
}
