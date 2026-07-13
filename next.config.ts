import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: "http://172.16.103.65:2003/api",
    APP_ENV: "production",
  },
};

export default nextConfig;
