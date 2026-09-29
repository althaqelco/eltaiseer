// src/lib/seo/og.ts — openGraph لصفحة عادية (spec-final A9.5).
// في Next 14 كائن openGraph في الصفحة يحل محل كائن الجذر كاملًا، وبدونه ترث الصفحة og:url الرئيسية
// (https://eltaiseer.com/). فكل صفحة تمرر مسارها، ومعه الصورة والاسم واللغة حتى لا تسقط.
import type { Metadata } from "next";
import { SITE_NAME } from "./owner-flags";

const SITE = "https://eltaiseer.com";

export const DEFAULT_OG_IMAGE = { url: "/og-image.jpg", width: 1200, height: 630 };

export function pageOpenGraph(o: {
  /** مسار بشرطة أخيرة، مثل "/terms/" */
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
}): NonNullable<Metadata["openGraph"]> {
  return {
    title: o.title.includes(SITE_NAME) ? o.title : `${o.title} | ${SITE_NAME}`,
    description: o.description,
    url: `${SITE}${o.path}`,
    type: o.type || "website",
    locale: "ar_EG",
    siteName: SITE_NAME,
    images: [DEFAULT_OG_IMAGE],
  };
}
