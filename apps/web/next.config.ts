import type { NextConfig } from 'next';
import { resolve } from 'path';

const nextConfig: NextConfig = {
  turbopack: {
    root: resolve(__dirname, '../..'),
  },

  // TypeScript Configuration
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json',
  },

  // External Packages
  serverExternalPackages: ['@neondatabase/serverless', 'pino', 'pino-pretty'],

  // Features
  typedRoutes: true,

  // Production Source Maps (disabled for performance)
  productionBrowserSourceMaps: false,

  // React Strict Mode
  reactStrictMode: true,

  // Power UX features
  poweredByHeader: false,
  compress: true,

  // Experimental Features (Next.js 16 optimizations)
  experimental: {
    // Package optimization - tree-shake unused exports
    optimizePackageImports: [
      '@radix-ui/react-icons',
      'lucide-react',
      '@tanstack/react-table',
      'date-fns',
    ],

    // Build performance
    webpackBuildWorker: true,

    // Server optimizations
    serverMinification: true,
    serverSourceMaps: false,

    // CSS optimization
    optimizeCss: true,

    // UX improvements
    scrollRestoration: true,

    // Partial Prerendering (Next.js 16)
    ppr: false, // Enable when stable

    // Server Actions optimizations
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['localhost:3000'],
    },

    // Large page data threshold
    largePageDataBytes: 128 * 1000, // 128KB

    // Instrumentation for observability
    instrumentationHook: true,

    // Improved compile caching
    cpus: Math.max(1, require('os').cpus().length - 1),
  },

  // Transpile Packages
  transpilePackages: ['afenda-ui'],

  // Headers for Security (Enhanced with CSP)
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
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
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
      ],
    },
  ],

  // Logging (Development optimized)
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
      hmr: process.env.NODE_ENV === 'development',
    },
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Output Configuration
  output: 'standalone',

  // Cache handler (optional: prepare for incremental cache)
  cacheHandler: process.env.CACHE_HANDLER_PATH,
  cacheMaxMemorySize: 50 * 1024 * 1024, // 50MB
};

export default nextConfig;
