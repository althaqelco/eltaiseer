// lib/bw/modified.ts — «آخر تغيير في البيانات» لمركز إعادة البيع وصفحة المرحلة 11 (spec-final A3.2).
// مصدر واحد لـ dateModified في JSON-LD الصفحة، و<time> الظاهر، و<lastmod> في sitemap.xml:
// أحدث توثيق لإعلان منشور أو وقت لقطة الأرقام الحية، وإلا آخر تعديل تحريري. (كان sitemap يأخذ التحريري
// والتوثيق فقط، فابتعد lastmod عن dateModified بقدر عمر اللقطة.) نقي بلا Next ولا Firebase.
import type { BwLive } from "./live-parse";
import type { BwListing } from "./types";
import { cairoIso, cairoLocalToIso, maxIso } from "../seo/time";
import { editorialIso } from "../seo/editorial";

// نص محلي بتوقيت القاهرة («2026-09-28 17:40:43» أو «2026-09-28»)؛ صيغة غير متوقعة لا تُسقط الصفحة
export function safeLocalIso(s: string): string | null {
  try {
    return cairoLocalToIso(s);
  } catch {
    return null;
  }
}

/** وقت لقطة الأرقام الحية (generated_at بتوقيت القاهرة، وإلا وقت الجلب) — نفسه في <time> وdateModified وlastmod */
export function liveIso(live: BwLive): string {
  return (live.generatedAt && safeLocalIso(live.generatedAt)) || cairoIso(live.fetchedAt);
}

/** يوم التوثيق (verifiedAt) بتوقيت القاهرة */
export function verifiedIso(d: string): string | null {
  return safeLocalIso(String(d).slice(0, 10));
}

export type ResaleModified = {
  /** أحدث توثيق بين الإعلانات المنشورة المعروضة */
  lastVerified: string | null;
  /** وقت لقطة الأرقام الحية */
  liveAt: string | null;
  /** dateModified = lastmod: بإزاحة القاهرة (undefined لصفحة بلا بيانات ولا تاريخ تحريري) */
  dateModified: string | undefined;
};

/**
 * listings = الإعلانات المنشورة التي تعرضها الصفحة نفسها (المركز: كل النشط؛ المرحلة 11: نشط المرحلة 11)،
 * وlive = لقطة getBwLive() (مخزنة 6 ساعات، نفس القيمة للصفحة وللخريطة).
 */
export function resaleModified(path: string, listings: Pick<BwListing, "verifiedAt">[], live: BwLive | null): ResaleModified {
  const lastVerified = maxIso(listings.map((l) => verifiedIso(l.verifiedAt)));
  const liveAt = live ? liveIso(live) : null;
  const data = maxIso([lastVerified, liveAt]);
  return { lastVerified, liveAt, dateModified: data ? cairoIso(data) : editorialIso(path, "modified") };
}
