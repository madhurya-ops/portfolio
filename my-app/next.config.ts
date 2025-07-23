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
  // Disable webpack's performance hints
  webpack: (config, { isServer }) => {
    // Disable source maps in development
    config.devtool = false;
    
    // Disable performance hints
    config.performance = {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    };
    
    return config;
  },
};

export default nextConfig;
