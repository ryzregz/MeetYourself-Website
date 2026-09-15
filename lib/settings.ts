import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { SiteSettings } from "@prisma/client";

const SETTINGS_ID = "singleton";

export interface HeroStat {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
}

// Matches the copy that used to be hardcoded across app/page.tsx and
// app/about/page.tsx — first-ever read creates this row with these values,
// so nothing changes visually until an admin edits it in /admin/settings.
const DEFAULTS = {
  heroBadge: "LIVE WEBINARS · EBOOKS · BOOKS",
  heroHeadline: "Unveil. Unleash. Greatness in YOU.",
  heroSubtext:
    "Meet Yourself Academy is Mwenda Itumbiri’s home for mindset coaching — live webinars, recorded sessions, and books that help you name your reality so it stops running you.",
  heroStats: [
    { value: 38, suffix: "+", label: "Webinars hosted" },
    { value: 12.4, decimals: 1, suffix: "k", label: "Community followers" },
    { value: 1200, suffix: "+", label: "Books & ebooks sold" },
  ] as HeroStat[],
  aboutAuthorBio: [
    "Mwenda Itumbiri is a leader, board advisor, and author with over two decades of People & Culture leadership across insurance, development finance, international NGOs, and public service — known for building high-performing teams and unlocking human potential.",
    "His life mission is helping people discover their authentic selves and live purposefully. He has mentored hundreds of youth across Nairobi’s Mathare, Huruma, and Korogocho areas, and remains a sought-after speaker on emotional intelligence, HR leadership, and governance.",
  ] as string[],
  aboutUsText: [
    "Mwenda Itumbiri holds an MBA in Human Resource Management (University of Nairobi), a BSc in Biochemistry (Egerton University), and multiple professional qualifications in HR, insurance, and coaching. He is a full member of IHRM, the Insurance Institute of Kenya (AIIK), and the Institute of Directors Kenya (IOD). His early service as a missionary with YWAM and FOCUS in Kenya and Norway continues to shape his faith-driven leadership today.",
  ] as string[],
  contactEmail: "hello@meetyourselfacademy.com",
  contactPhone: "+254 700 000 000",
  contactLocation: "Nairobi, Kenya",
  socialInstagram: null as string | null,
  socialYoutube: null as string | null,
  socialLinkedin: null as string | null,
  socialFacebook: null as string | null,
  googleAnalyticsId: null as string | null,
};

/**
 * Reads the single settings row, creating it with the defaults above on
 * first-ever call. Cheap (one indexed upsert) and means no manual seed step
 * is needed on a fresh database. Wrapped in React's `cache()` so the several
 * places that read settings within one request (layout, page, footer) share
 * a single DB round trip instead of each issuing their own.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    return await prisma.siteSettings.upsert({
      where: { id: SETTINGS_ID },
      update: {},
      // Prisma's Json input type wants a bare JSON-serializable value, not
      // our typed HeroStat[]/string[] — the round-trip through JSON is a
      // no-op at runtime since these are already plain data.
      create: { id: SETTINGS_ID, ...DEFAULTS } as unknown as Prisma.SiteSettingsCreateInput,
    });
  } catch (error) {
    // Several pages read settings in parallel (Next prerenders them
    // concurrently at build time, and concurrent first-ever requests can
    // race the same way) — if another call's insert won the race between
    // our upsert's own check and write, just read what it created.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return prisma.siteSettings.findUniqueOrThrow({ where: { id: SETTINGS_ID } });
    }
    throw error;
  }
});

export function parseHeroStats(json: unknown): HeroStat[] {
  if (!Array.isArray(json)) return [];
  return json.filter(
    (s): s is HeroStat =>
      typeof s === "object" &&
      s !== null &&
      typeof (s as Record<string, unknown>).value === "number" &&
      typeof (s as Record<string, unknown>).label === "string"
  );
}

export function parseParagraphs(json: unknown): string[] {
  if (!Array.isArray(json)) return [];
  return json.filter((p): p is string => typeof p === "string" && p.trim().length > 0);
}
