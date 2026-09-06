import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: no backend — orders hand off to a WhatsApp draft.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  devIndicators: false,
  allowedDevOrigins: ["100.114.88.104", "localhost"],
};

export default nextConfig;
