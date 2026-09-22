import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export to `out/` for drag-and-drop hosting (Netlify Drop).
  output: "export",
  // The default image optimiser needs a server; serve images as-is.
  images: { unoptimized: true },
  turbopack: { root: __dirname },
};

export default nextConfig;
