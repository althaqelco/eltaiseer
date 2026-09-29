// src/lib/bw/platformLinks.tsx — روابط الموقع الرئيسي إلى منصة «التيسير — الحجز الذكي» (/baitelwatan/*).
// كل رابط لصفحة من صفحات المنصة يُعرض فقط حين يكون مسارها في platform-routes.json (حي ومفهرس)؛
// قبل ذلك لا يُعرض شيء، أو الرابط باسم العلامة فقط إلى /baitelwatan/. ممنوع أي نص موضوعي على جذر
// التطبيق (noindex)، وممنوع next/link هنا (لا prefetch لصفحات المنصة). (spec-final A0.8 / A7)
import { PLATFORM_BRAND, PLATFORM_ROOT, platformLive } from "./platformRoutes";

export { PLATFORM_BRAND, PLATFORM_ROOT, platformLive };

export function PlatformLink({
  path,
  children,
  fallback = null,
  className,
}: {
  path: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}) {
  return platformLive(path) ? (
    <a href={path} className={className}>
      {children}
    </a>
  ) : (
    <>{fallback}</>
  );
}

/** الرابط الوحيد المسموح على جذر المنصة: اسم العلامة فقط */
export function BrandPlatformLink({ className }: { className?: string }) {
  return (
    <a href={PLATFORM_ROOT} className={className}>
      {PLATFORM_BRAND}
    </a>
  );
}
