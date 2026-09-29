// src/lib/seo/llmsRoute.ts — خادم فقط: يجلب البيانات ويبني ملف llms ويفحصه قبل تقديمه (spec-final A4.1).
// الملف نص عادي noindex (جوجل يفهرس text/plain، و60 KB من الأسئلة والجداول كانت ستنافس الصفحات المالكة)،
// وX-Content-Source يثبت أن الرد من المسار لا من ملف ثابت قديم في Hosting (يفحصه test:seo:llms).
// إن وجد الفحص مشكلة: تُقدَّم آخر نسخة سليمة في ذاكرة الخادم؛ وإن لم توجد يُرمى خطأ فيُبقي Next آخر نسخة
// سليمة في ذاكرة ISR (وأثناء البناء يفشل النشر)؛ وفي التطوير 503 صريح.

import { getPropertiesServerResult } from "@/lib/serverProperties";
import { getActiveListings } from "@/lib/bw/listings";
import { BW_CITIES } from "@/lib/bw/cities";
import { cityLiveListings, resaleCityIndexable } from "@/lib/bw/calc";
import { computePriceStats, toPriceInput } from "@/lib/seo/prices";
import {
  LLMS_FULL_MAX_BYTES,
  LLMS_MAX_BYTES,
  buildLlms,
  buildLlmsFull,
  checkLlms,
  type LlmsData,
  type LlmsDoc,
} from "@/lib/seo/llms";

export type LlmsKind = "llms" | "full";

const lastGood: Partial<Record<LlmsKind, LlmsDoc>> = {};

async function loadData(): Promise<LlmsData> {
  const r = await getPropertiesServerResult();
  const prices = r.ok ? computePriceStats(r.properties.map(toPriceInput)) : null;
  const all = await getActiveListings(); // [] عند الفشل: لا مدينة إعادة بيع تُذكر
  const now = Date.now();
  const resaleCities = BW_CITIES.map((c) => c.slug).filter((s) => resaleCityIndexable(cityLiveListings(all, s, now)));
  return { prices, resaleCities };
}

function respond(doc: LlmsDoc): Response {
  return new Response(doc.text, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex",
      "X-Content-Source": "llms-route",
      "Last-Modified": new Date(doc.asOf).toUTCString(),
    },
  });
}

export async function llmsResponse(kind: LlmsKind): Promise<Response> {
  const data = await loadData();
  const doc = kind === "llms" ? buildLlms(data) : buildLlmsFull(data);
  const problems = checkLlms(doc.text, kind === "llms" ? LLMS_MAX_BYTES : LLMS_FULL_MAX_BYTES);
  if (problems.length === 0) {
    lastGood[kind] = doc;
    return respond(doc);
  }
  console.error(`[llms] ${kind} refused: ${problems.join(" | ")}`);
  const prev = lastGood[kind];
  if (prev) return respond(prev);
  if (process.env.NODE_ENV === "development") {
    return new Response(`llms ${kind} refused:\n${problems.join("\n")}\n`, {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex", "Cache-Control": "no-store" },
    });
  }
  throw new Error(`llms ${kind} failed its content check: ${problems.join(" | ")}`);
}
