import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isYoutubeUrl, mediaUrlSchema } from "@/lib/media";

const recordingSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    topic: z.string().min(1).default("Coaching Session"),
    recordedAt: z.coerce.date(),
    durationLabel: z.string().min(1, 'Duration is required (e.g. "52 min")'),
    coverUrl: mediaUrlSchema("Upload a cover image first"),
    isPublished: z.coerce.boolean().default(true),
    webinarId: z.string().nullable().optional(),
    sourceType: z.enum(["none", "youtube", "ppt"]).default("none"),
    youtubeUrl: z.string().url().nullable().optional(),
    pptUrl: mediaUrlSchema("Upload a presentation file first").nullable().optional(),
  })
  .refine((data) => data.sourceType !== "youtube" || (!!data.youtubeUrl && isYoutubeUrl(data.youtubeUrl)), {
    message: "Enter a valid YouTube URL",
    path: ["youtubeUrl"],
  })
  .refine((data) => data.sourceType !== "ppt" || !!data.pptUrl, {
    message: "Upload a presentation file first",
    path: ["pptUrl"],
  })
  .transform((data) => ({
    ...data,
    // Never persist a stale link for whichever source type isn't selected.
    youtubeUrl: data.sourceType === "youtube" ? data.youtubeUrl : null,
    pptUrl: data.sourceType === "ppt" ? data.pptUrl : null,
  }));

export async function GET() {
  try {
    const recordings = await prisma.recording.findMany({ orderBy: { recordedAt: "desc" } });
    return NextResponse.json(recordings);
  } catch (error) {
    console.error("[api/admin/recordings GET]", error);
    return NextResponse.json({ error: "Failed to fetch recordings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = recordingSchema.parse(body);
    const recording = await prisma.recording.create({ data });
    return NextResponse.json(recording, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
    }
    console.error("[api/admin/recordings POST]", error);
    return NextResponse.json({ error: "Failed to create recording" }, { status: 500 });
  }
}
