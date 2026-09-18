import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["*.trycloudflare.com", "*.loca.lt", "localhost:5173", "127.0.0.1:5173"],
    },
  },
};

export default nextConfig;
