import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  // Disable React Strict Mode to reduce double rendering in development
  reactStrictMode: false,
  // Disable Next.js telemetry
  experimental: {
    // This will disable the Next.js dev overlay
    disableOptimizedLoading: true,
  },
};

export default nextConfig;
