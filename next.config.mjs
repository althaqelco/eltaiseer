/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use static export for production builds
  // In development, we need dynamic routing for Firestore properties
  ...(process.env.NODE_ENV === 'production' && process.env.STATIC_EXPORT === 'true' 
    ? { output: 'export' } 
    : {}),
  trailingSlash: true,
  images: {
    // تحسين الصور مفعّل في وضع SSR؛ التصدير الثابت لا يدعم محسّن الصور فيتعطل تلقائياً
    unoptimized: process.env.STATIC_EXPORT === 'true',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // التحويلات والرؤوس تعمل في وضع SSR فقط (التصدير الثابت يتجاهلها)
  ...(process.env.STATIC_EXPORT === 'true'
    ? {}
    : {
        async redirects() {
          return [
            // مسار قديم مكرر لصفحات المدن — تحويل دائم للنسخة الأساسية
            {
              source: '/properties/city/:city',
              destination: '/:city',
              permanent: true,
            },
          ];
        },
        async headers() {
          return [
            {
              source: '/:path*',
              headers: [
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
              ],
            },
            {
              source: '/_next/static/:path*',
              headers: [
                { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
