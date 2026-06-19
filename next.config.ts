import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  images: {
    remotePatterns: [
      // Allow any Appwrite regional subdomain (e.g. nyc.cloud.appwrite.io)
      {
        protocol: "https",
        hostname: "**.cloud.appwrite.io",
      },
    ],
  },
};

export default nextConfig;
