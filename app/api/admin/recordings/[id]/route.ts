import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isYoutubeUrl, mediaUrlSchema } from "@/lib/media";

const recordingUpdateSchema = z
  .object({
    title: z.string().min(1).optional(),
    topic: z.string().min(1).optional(),
    recordedAt: z.coerce.date().optional(),
    durationLabel: z.string().min(1).optional(),
    coverUrl: mediaUrlSchema("Upload a cover image first").optional(),
    isPublished: z.coerce.boolean().optional(),
    webinarId: z.string().nullable().optional(),
    sourceType: z.enum(["none", "youtube", "ppt"]).optional(),
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
  .transform((data) => {
    if (data.sourceType === undefined) return data;
    return {
      ...data,
      youtubeUrl: data.sourceType === "youtube" ? data.youtubeUrl : null,
      pptUrl: data.sourceType === "ppt" ? data.pptUrl : null,
    };
  });

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const data = recordingUpdateSchema.parse(body);
    const recording = await prisma.recording.update({ where: { id }, data });
    return NextResponse.json(recording);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
    }
    console.error("[api/admin/recordings/[id] PATCH]", error);
    return NextResponse.json({ error: "Failed to update recording" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await prisma.recording.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/admin/recordings/[id] DELETE]", error);
    return NextResponse.json({ error: "Failed to delete recording" }, { status: 500 });
  }
}
