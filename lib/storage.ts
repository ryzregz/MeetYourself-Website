import { put } from "@vercel/blob";

/**
 * Uploads a file to Vercel Blob (as a *private* blob — this account's store is
 * configured private-only, and `access: "public"` is rejected outright) and
 * returns an app-relative URL that serves it back through
 * `app/api/media/[...path]/route.ts`. That route is the only thing that ever
 * talks to Blob's private `get()`, so this works regardless of whether the
 * store is public or private, and callers never see a Blob URL directly.
 * Swap this one function (and the media route) if you later move to S3 or
 * another provider.
 */
export async function uploadFile(file: File, pathPrefix: string): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
  const key = `${pathPrefix}/${Date.now()}-${safeName}`;
  await put(key, file, { access: "private" });
  return `/api/media/${key}`;
}
