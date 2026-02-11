import { resolve } from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: resolve(__dirname, "../.."),
  },

  // TypeScript Configuration
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: "./tsconfig.json",
  },

  // External Packages
  serverExternalPackages: ['@prisma/client'],

  // Features
  typedRoutes: true,

  // Experimental Features
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
    webpackBuildWorker: true,
    serverMinification: true,
    optimizeCss: true,
    scrollRestoration: true,
    largePageDataBytes: 128 * 1000, // 128KB
  },

  // Transpile Packages
  transpilePackages: ['afena-ui'],

  // Headers for Security
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ],

  // Logging
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
};

export default nextConfig;
