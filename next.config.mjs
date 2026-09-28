// ── تحويلات الروابط القديمة ──────────────────────────────────────────────────
// روابط خريطة يناير (قبل هيكل /{city}/{district}/{id}/) ما زالت في فهرس جوجل وروابط خارجية.
// - كل وجهة هي الرابط النهائي بشرطته الأخيرة: التحويل يصل في قفزة واحدة بلا سلاسل
//   (رابط بلا شرطة أخيرة يمر أولاً بتحويل الشرطة الداخلي في Next — دمجه في قفزة واحدة قاعدة Cloudflare عند المالك)
// - المصادر حرفية بلا أنماط regex عمداً: firebase-tools ينسخ هذه التحويلات إلى إعدادات Hosting
//   التي لا تفهم أنماط path-to-regexp، والمصدر الحرفي يعمل في الطبقتين
// - تتحقق منها tests/seo (npm run test:seo) مقابل src/lib/districtSlugs.ts وegyptPlaces.ts

// slugs الأحياء الحالية لكل مدينة — نسخة من getCityDistrictSlugs() (الاختبار يفشل إن اختلفتا)
const DISTRICT_SLUGS_BY_CITY = {
  "new-damietta": [
    "first-district", "second-district", "third-district", "fourth-district", "fifth-district",
    "sixth-district", "janna-project", "dar-misr-1", "dar-misr-2", "sakan-misr-south",
    "sakan-misr-west", "beit-al-watan-east", "beit-al-watan-west", "beit-al-watan-beach",
    "central-area-a", "central-area-b", "central-area-c", "north-university", "industrial-zone",
    "chalets",
  ],
  "new-mansoura": [
    "r1", "r2", "r3", "r4", "r5", "r6", "r7", "residential-1", "residential-2", "residential-3",
    "sakan-kol-misryeen", "sakan-kol-misryeen-2", "sakan-kol-misryeen-3", "dar-misr", "janna",
    "medium-housing", "social-housing", "villas-district", "villas-d", "golf-villas", "lake-villas",
    "downtown", "central-mall", "cbd", "commercial-axis", "services-zone", "central-park", "corniche",
    "social-club", "touristic-zone", "waterfront", "beach", "coastal-resorts",
  ],
};

// slugs صفحة /properties/district/[slug] في الموقع القديم التي لا تطابق slug حالياً —
// كلها كانت مشاريع في دمياط الجديدة (خريطة DISTRICT_SLUGS القديمة)
const LEGACY_DISTRICT_ALIASES = {
  // «دار مصر - موقع 1» في دمياط — وليس حي dar-misr في المنصورة الجديدة الذي يحمل نفس الـ slug اليوم
  "dar-misr": "/new-damietta/dar-misr-1/",
  "sakan-misr": "/new-damietta/sakan-misr-south/",
  "beit-al-watan": "/new-damietta/beit-al-watan-east/",
  "central-area": "/new-damietta/central-area-a/",
};

// معرفات العقارات التجريبية للموقع القديم (mockData: prop-001 … prop-100) — لا صفحات لها اليوم
const LEGACY_MOCK_PROPERTY_COUNT = 100;

function legacyRedirects() {
  const districtTargets = {};
  for (const [city, slugs] of Object.entries(DISTRICT_SLUGS_BY_CITY)) {
    for (const slug of slugs) districtTargets[slug] = `/${city}/${slug}/`;
  }
  Object.assign(districtTargets, LEGACY_DISTRICT_ALIASES);

  return [
    // /properties/district/{slug} (صفحة عميل قديمة مكررة) → صفحة الحي الأساسية
    ...Object.entries(districtTargets).map(([slug, destination]) => ({
      source: `/properties/district/${slug}`,
      destination,
      statusCode: 301,
    })),
    // أي slug آخر (كان soft-404 «المنطقة غير موجودة» مخزناً سنة) → جميع العقارات
    { source: "/properties/district/:path*", destination: "/properties/", statusCode: 301 },
    // /properties/city/{city} → صفحة المدينة مباشرة بالشرطة الأخيرة (كانت 3 تحويلات 308 متتالية)
    ...Object.keys(DISTRICT_SLUGS_BY_CITY).map((city) => ({
      source: `/properties/city/${city}`,
      destination: `/${city}/`,
      statusCode: 301,
    })),
    { source: "/properties/city/:path*", destination: "/properties/", statusCode: 301 },
    // /property/prop-NNN (عقارات تجريبية) → جميع العقارات؛ معرفات Firestore الحقيقية يحوّلها src/app/property/[id]
    ...Array.from({ length: LEGACY_MOCK_PROPERTY_COUNT }, (_, i) => ({
      source: `/property/prop-${String(i + 1).padStart(3, "0")}`,
      destination: "/properties/",
      statusCode: 301,
    })),
  ];
}

// ── ترقيم صفحات القوائم بروابط ?page=N (انظر src/lib/pagination.ts) ──────────────
// /new-damietta/?page=2 يُخدم من المسار الداخلي /new-damietta/p/2/ (ISR) — قراءة searchParams
// في الصفحة الأساسية كانت ستجعلها ديناميكية بلا تخزين. الصفحة 1 هي الرابط الأساسي بلا ?page.
const PAGE_QUERY = [{ type: "query", key: "page", value: "(?<pg>[2-9]|[1-9][0-9]{1,3})" }];
const LISTING_CITIES = "new-damietta|new-mansoura";
const LISTING_CATEGORIES = "apartments|villas|lands|shops|clinics|chalets|installments";

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
            ...legacyRedirects(),
            // المسار الداخلي للترقيم لا يُزار مباشرة — رابطه العام هو ?page=N (الوجهة فيها ? فلا ينسخها firebase-tools)
            { source: `/:city(${LISTING_CITIES})/p/:n(\\d+)`, destination: '/:city/?page=:n', statusCode: 301 },
            { source: '/properties/p/:n(\\d+)', destination: '/properties/?page=:n', statusCode: 301 },
            { source: `/properties/:category(${LISTING_CATEGORIES})/p/:n(\\d+)`, destination: '/properties/:category/?page=:n', statusCode: 301 },
          ];
        },
        async rewrites() {
          return {
            beforeFiles: [
              { source: `/:city(${LISTING_CITIES})`, has: PAGE_QUERY, destination: '/:city/p/:pg' },
              { source: '/properties', has: PAGE_QUERY, destination: '/properties/p/:pg' },
              { source: `/properties/:category(${LISTING_CATEGORIES})`, has: PAGE_QUERY, destination: '/properties/:category/p/:pg' },
            ],
          };
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
