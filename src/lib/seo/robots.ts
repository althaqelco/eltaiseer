// src/lib/seo/robots.ts
// كائن robots واحد للصفحات القابلة للفهرسة: كائن robots في صفحة Next يحل محل كائن الجذر كاملًا،
// فكانت صفحات العقارات والأحياء والمدن والتقييم وإعادة البيع تفقد max-snippet وmax-image-preview. (spec-final A1.5)
import type { Metadata } from "next";

export const ROBOTS_INDEX: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
};

export const ROBOTS_NOINDEX: Metadata["robots"] = { index: false, follow: true, googleBot: { index: false, follow: true } };
