import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: "http://10.110.10.155:8000/api",
    APP_ENV: "production",
  },
};

export default nextConfig;
