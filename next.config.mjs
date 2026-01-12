/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use static export for production builds
  // In development, we need dynamic routing for Firestore properties
  ...(process.env.NODE_ENV === 'production' && process.env.STATIC_EXPORT === 'true' 
    ? { output: 'export' } 
    : {}),
  trailingSlash: true,
  images: {
    unoptimized: true,
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
};

export default nextConfig;
