import type { NextConfig } from "next";

// Admin-uploaded cover images and presentations are served through the app's
// own /api/media proxy (see lib/storage.ts) rather than linked directly from
// Blob, so next/image never sees an external hostname to allowlist here.
const nextConfig: NextConfig = {};

export default nextConfig;
