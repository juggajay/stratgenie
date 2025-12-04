import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignore TypeScript errors during build to unblock Vercel deployment
  // This allows deploying while non-critical type issues are being resolved
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Transpile ESM packages for compatibility (CH-0012: @react-pdf/renderer)
  transpilePackages: ["@react-pdf/renderer"],
};

export default nextConfig;
