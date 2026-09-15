import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";

const heroStatSchema = z.object({
  value: z.coerce.number(),
  decimals: z.coerce.number().int().min(0).max(2).optional(),
  suffix: z.string().optional(),
  label: z.string().min(1, "Every stat needs a label"),
});

// The form sends "" to clear an optional field, but the field also
// round-trips as null straight from a GET — accept both and normalize to
// null rather than ever storing "".
const optionalUrl = z
  .string()
  .trim()
  .nullish()
  .transform((v) => (v ? v : null))
  .refine((v) => v === null || /^https?:\/\//i.test(v), { message: "Must be a full URL starting with http(s)://" });

const optionalText = z
  .string()
  .trim()
  .nullish()
  .transform((v) => (v ? v : null));

const settingsUpdateSchema = z.object({
  heroBadge: z.string().min(1, "Hero badge is required"),
  heroHeadline: z.string().min(1, "Hero headline is required"),
  heroSubtext: z.string().min(1, "Hero subtext is required"),
  heroStats: z.array(heroStatSchema).min(1, "Add at least one stat"),
  aboutAuthorBio: z.array(z.string().min(1)).min(1, "Add at least one paragraph"),
  aboutUsText: z.array(z.string().min(1)).min(1, "Add at least one paragraph"),
  contactEmail: z.string().email("Enter a valid email"),
  contactPhone: z.string().min(1, "Phone is required"),
  contactLocation: z.string().min(1, "Location is required"),
  socialInstagram: optionalUrl,
  socialYoutube: optionalUrl,
  socialLinkedin: optionalUrl,
  socialFacebook: optionalUrl,
  googleAnalyticsId: optionalText,
});

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("[api/admin/settings GET]", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const parsed = settingsUpdateSchema.parse(body);
    // Ensure the row exists first (first-ever save on a brand new DB).
    await getSiteSettings();
    const settings = await prisma.siteSettings.update({
      where: { id: "singleton" },
      data: parsed,
    });
    return NextResponse.json(settings);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
    }
    console.error("[api/admin/settings PATCH]", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
