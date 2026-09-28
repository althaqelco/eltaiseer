// lib/bw/meta.ts
// بيانات الصفحة لكل صفحات القسم: في Next 14 كائن openGraph في الصفحة يحل محل كائن الجذر كاملًا، فبدون صورة صريحة
// لا يخرج og:image، وبطاقة تويتر تبقى بعنوان الموقع العام ووصف دمياط.

import type { Metadata } from "next";
import { SITE } from "./constants";

const DEFAULT_IMAGE = { url: "/og-image.jpg", width: 1200, height: 630 };

export function bwMeta(o: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  type?: "website" | "article";
  images?: string[];
  noindex?: boolean;
}): Metadata {
  const url = `${SITE}${o.path}`;
  // صور المعاينة مقاساتها غير معروفة فلا نعلن أبعادًا خاطئة؛ الأبعاد للصورة الافتراضية فقط
  const images = o.images?.length ? o.images.slice(0, 3).map((u) => ({ url: u })) : [DEFAULT_IMAGE];
  return {
    title: o.absoluteTitle ? { absolute: o.title } : o.title,
    description: o.description,
    alternates: { canonical: url },
    robots: o.noindex ? { index: false, follow: true } : undefined,
    openGraph: { title: o.title, description: o.description, url, type: o.type || "website", locale: "ar_EG", siteName: "التيسير للعقارات", images },
    twitter: { card: "summary_large_image", title: o.title, description: o.description, images: images.map((i) => i.url) },
  };
}
