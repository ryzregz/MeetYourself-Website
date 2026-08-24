import { z } from "zod";

// Inline-playback helpers for Recording.sourceType — "youtube" embeds via
// YouTube's own iframe player; "ppt" embeds via Microsoft's Office Online
// viewer, which can render any publicly-reachable .ppt/.pptx URL (ours live
// in Vercel Blob, so this needs no server-side conversion).

/**
 * Validates an uploaded-media URL: either our own `/api/media/...` proxy
 * path (see lib/storage.ts — everything uploaded through the admin portal
 * looks like this) or a plain absolute http(s) URL, for anything set by
 * hand/seed data. Plain `z.string().url()` rejects the former.
 */
export function mediaUrlSchema(requiredMessage: string) {
  return z
    .string()
    .min(1, requiredMessage)
    .refine((v) => v.startsWith("/") || /^https?:\/\//i.test(v), { message: "Invalid URL" });
}

/** Accepts youtube.com/watch, youtu.be, /embed/, and /shorts/ URLs. */
export function getYoutubeVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return u.pathname.slice(1).split("/")[0] || null;
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      const embedMatch = u.pathname.match(/^\/(embed|shorts)\/([^/]+)/);
      if (embedMatch) return embedMatch[2];
    }
    return null;
  } catch {
    return null;
  }
}

export function isYoutubeUrl(url: string): boolean {
  return getYoutubeVideoId(url) != null;
}

export function getYoutubeEmbedUrl(url: string): string | null {
  const id = getYoutubeVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

/** `fileUrl` must be publicly reachable over HTTPS — Microsoft's viewer fetches it server-side. */
export function getOfficeViewerUrl(fileUrl: string): string {
  return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
}

/**
 * Uploaded media is stored as an app-relative `/api/media/...` path (works
 * anywhere, needs no config — see lib/storage.ts). The Office viewer above is
 * the one consumer that needs a real absolute URL, since it fetches from
 * Microsoft's own servers, not the visitor's browser. Only meaningful when
 * the site is actually publicly reachable — on localhost this still resolves
 * to a real (but unreachable-from-Microsoft) URL, so PPT preview only works
 * once deployed.
 */
export function toAbsoluteUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}${url}`;
}

/**
 * True for localhost / private-network hosts — anywhere Microsoft's Office
 * viewer (which fetches server-side from its own infrastructure) has no
 * possible way to reach. Used to show a clear explanation instead of
 * Microsoft's generic "can't open this" failure when previewing a PPT during
 * local development.
 */
export function isPubliclyReachableHost(hostname: string): boolean {
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname === "0.0.0.0") {
    return false;
  }
  if (hostname.endsWith(".local")) return false;
  // RFC1918 private ranges + link-local — a real deploy is never at one of these.
  if (/^10\.\d+\.\d+\.\d+$/.test(hostname)) return false;
  if (/^192\.168\.\d+\.\d+$/.test(hostname)) return false;
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(hostname)) return false;
  if (/^169\.254\.\d+\.\d+$/.test(hostname)) return false;
  return true;
}
