import type { NextConfig } from "next";
// @ts-expect-error next-pwa typing missing
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "https://serviceapotheke-api-830781040278.europe-west1.run.app/api",
  },
  output: "standalone",
  turbopack: {},
  generateBuildId: async () => {
    return 'release-' + Date.now();
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.serviceapotheke.tech/api/:path*",
      },
    ];
  },
};

import { withSentryConfig } from "@sentry/nextjs";

const sentryWebpackPluginOptions = {
  silent: true,
  org: "serviceapotheke",
  project: "serviceapotheke-web",
};

export default withSentryConfig(withPWA(nextConfig), sentryWebpackPluginOptions);
