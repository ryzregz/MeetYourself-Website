import type { NextConfig } from "next";

// Admin-uploaded cover images and presentations are served through the app's
// own /api/media proxy (see lib/storage.ts) rather than linked directly from
// Blob, so next/image never sees an external hostname to allowlist here.
const nextConfig: NextConfig = {
  // Explicit (this is already the default) — gzip-compresses responses when
  // self-hosting with `next start`. On Vercel, the edge network compresses
  // responses itself regardless of this setting.
  compress: true,
};

export default nextConfig;
