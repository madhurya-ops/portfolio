import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the project root to my-app so the repo-root lockfile isn't picked up
  outputFileTracingRoot: path.join(__dirname),
  turbopack: {
    root: path.join(__dirname),
  },

  // Disable source maps in production
  productionBrowserSourceMaps: false,

  // Disable React Strict Mode to reduce double rendering in development
  reactStrictMode: false,

  // The blog was removed; send old links home
  async redirects() {
    return [{ source: "/blog", destination: "/", permanent: true }];
  },

  // Disable Next.js telemetry and loader optimization
  experimental: {
    // This will disable the Next.js dev overlay
    disableOptimizedLoading: true,
  },
};

export default nextConfig;