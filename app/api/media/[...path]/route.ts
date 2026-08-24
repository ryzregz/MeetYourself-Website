import { NextResponse } from "next/server";
import { get } from "@vercel/blob";

// Public, unauthenticated route (not matched by proxy.ts's admin patterns) —
// this is how admin-uploaded cover images and presentations reach visitors,
// since the underlying Blob store is private (see lib/storage.ts).
export async function GET(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const pathname = path.join("/");

  try {
    const result = await get(pathname, { access: "private" });
    if (!result || !result.stream) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return new NextResponse(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType || "application/octet-stream",
        // Each upload gets a fresh, timestamped key (see lib/storage.ts) — the
        // content behind a given path never changes, so this can cache hard.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[api/media GET]", pathname, error);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
