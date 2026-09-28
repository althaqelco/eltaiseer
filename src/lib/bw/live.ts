// lib/bw/live.ts
// لقطة البيانات الحية من منصة الحجز للخادم: طلب واحد كل 6 ساعات لكل نسخة خادم، لا طلب لكل زيارة
// (كائن الحجز ذاكرته 128 ميجابايت ولا يتحمل حِملًا جديدًا).
// المصدر اليوم /baitelwatan/api/plots العام. عند تشغيل ملف الأرقام الحية لصفحات دليل المنصة (KV تكتبه الحافة كل 5 دقائق)
// يُحوَّل BW_LIVE_URL إليه ويُضاف له محلّل بنفس شكل BwLive.

import { unstable_cache } from "next/cache";
import { aggregatePlots, BwLive } from "./live-parse";

const SOURCE = process.env.BW_LIVE_URL || "https://eltaiseer.com/baitelwatan/api/plots";
const REVALIDATE_S = 6 * 60 * 60;

async function fetchLive(): Promise<BwLive> {
  // بلا cache: "no-store" — داخل unstable_cache أثناء التوليد الثابت (ISR) كان يرمي «dynamic server usage» قبل أي طلب
  // فيختفي بلوك الأرقام الحية في الإنتاج. fetch داخل unstable_cache لا تُخزَّن استجابته أصلًا؛ المخزَّن هو الملخص الصغير فقط.
  const res = await fetch(SOURCE, {
    headers: { "user-agent": "eltaiseer-main-site/1 (resale live snapshot)" },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`live ${res.status}`);
  const out = aggregatePlots(await res.json());
  if (!out) throw new Error("live: empty");
  return out;
}

// الفشل يرمي داخل الدالة المخزَّنة فلا يُحفظ؛ الصفحة تُعرض بدون بلوك الأرقام الحية وتعيد المحاولة في الطلب التالي
// غيّر رقم المفتاح مع أي تغيير في شكل BwLive، وإلا قُدّمت لقطة قديمة بلا الحقول الجديدة حتى تنتهي مدتها
const cached = unstable_cache(fetchLive, ["bw-live-v2"], { revalidate: REVALIDATE_S });

export async function getBwLive(): Promise<BwLive | null> {
  try {
    return await cached();
  } catch {
    return null;
  }
}
