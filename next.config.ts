import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // Destination can be an environment variable, but for now we hardcode the known backend
        destination: 'https://api.serviceapotheke.tech/api/:path*',
      },
    ];
  },
};

export default nextConfig;
