import type { NextConfig } from "next";
// @ts-expect-error next-pwa typing missing
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {},
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.serviceapotheke.tech/api/:path*",
      },
    ];
  },
};

export default withPWA(nextConfig);
