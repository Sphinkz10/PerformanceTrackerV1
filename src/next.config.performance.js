/**
 * Next.js Performance Configuration
 * Day 28-29: Performance Optimizations
 * 
 * This is a reference configuration for performance optimizations.
 * Merge with your existing next.config.js
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Experimental features for performance
  experimental: {
    // Optimize package imports
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      'motion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
    ],
    
    // Server actions (if using)
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      // Code splitting optimization
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Common chunk
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
            // UI libraries (large)
            ui: {
              test: /[\\/]node_modules[\\/](@radix-ui|lucide-react)[\\/]/,
              name: 'ui',
              chunks: 'all',
              priority: 30,
            },
            // Charts (large)
            charts: {
              test: /[\\/]node_modules[\\/](recharts|d3-)[\\/]/,
              name: 'charts',
              chunks: 'all',
              priority: 30,
            },
          },
        },
      };
    }

    // Analyze bundle (optional, enable when needed)
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: true,
        })
      );
    }

    return config;
  },

  // Headers for caching
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Production source maps (smaller)
  productionBrowserSourceMaps: false,

  // Strict mode
  reactStrictMode: true,

  // SWC minification (faster than Terser)
  swcMinify: true,

  // Trailing slash
  trailingSlash: false,

  // Powered by header (security)
  poweredByHeader: false,

  // Compression
  compress: true,

  // Generate ETags
  generateEtags: true,

  // Output file tracing (Vercel)
  outputFileTracing: true,
};

module.exports = nextConfig;
