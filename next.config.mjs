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
    // صيغة واحدة عمدًا: Cloudflare لا يفرّق النسخ حسب Accept، فلو فُعّلت AVIF قد تُخزَّن نسخة
    // AVIF وتُرسل لمتصفح لا يدعمها. WebP مدعومة في كل المتصفحات الحالية، وترميزها أخف على الدالة.
    formats: ['image/webp'],
    // صور Storage تُرفع بأسماء فريدة (توقيت + عشوائي) ورابطها يحمل token، فلا يتغير محتواها.
    // 30 يومًا بدل 60 ث: المتصفح (وCDN إن خُزّنت) لا يعيد طلب الدالة لكل صورة، ويبقى الحد معقولًا
    // لملفات public/ (مثل /logo.png) إن تغيّرت يومًا.
    minimumCacheTTL: 2592000,
    // المقاسات الافتراضية لـ Next كما هي عمدًا: روابط /_next/image?w=... مفهرسة في Google Images،
    // وحذف أي عرض (مثل 2048/3840) يجعل روابطه تعيد 400. الأصول لا تتجاوز 1200px (compressImage)
    // وsharp لا يكبّر الصورة، فالأعرض يعيد نسخة 1200px نفسها.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
              // صور وأيقونات public/ (الشعار وصور og وicon-192/512): كانت تُخدم من الدالة بـ max-age=0
              // فتُستدعى الدالة في كل طلب. يوم في المتصفح وأسبوع في CDN (Hosting/Cloudflare).
              // لا يغيّر شيئًا في تخزين صفحات HTML. تُستثنى ملفات metadata في src/app (favicon.ico
              // وicon.svg وapple-icon.png) لأن Next يضع لها Cache-Control خاصًا بها فيتكرر الرأس.
              source: '/:file((?!favicon\\.|icon\\.|apple-icon|opengraph-image|twitter-image)[^/]+\\.(?:png|jpe?g|webp|avif|gif|svg))',
              headers: [
                { key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400' },
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
