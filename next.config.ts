import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**', // Match all paths on picsum.photos
      },
    ],
    unoptimized:true
  },
  reactStrictMode: false,
};

export default nextConfig;
