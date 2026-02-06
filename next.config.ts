import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/film",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
