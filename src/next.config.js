/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Webpack configuration
  webpack: (config, { isServer, webpack }) => {
    // Fix for packages that use process or buffer
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
      
      // Replace process.env with actual values for browser
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(
            process.env.NEXT_PUBLIC_SUPABASE_URL || ''
          ),
          'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
          ),
          'process.env.NEXT_PUBLIC_USE_REAL_DATA': JSON.stringify(
            process.env.NEXT_PUBLIC_USE_REAL_DATA || 'false'
          ),
          'process.env.NEXT_PUBLIC_DEBUG': JSON.stringify(
            process.env.NEXT_PUBLIC_DEBUG || 'false'
          ),
          'process.env.NEXT_PUBLIC_APP_URL': JSON.stringify(
            process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
          ),
        })
      );
    }
    
    return config;
  },
  
  // Image optimization
  images: {
    domains: [
      'api.dicebear.com',
      'images.unsplash.com',
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
  
  // Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
