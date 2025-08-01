import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol:"https",
        hostname:"huzrinbkhqvqhfcrvxmy.supabase.co"
      }
  ],
  },
};

export default nextConfig;
