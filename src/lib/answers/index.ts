// src/lib/answers/index.ts
// كل الأسئلة والإجابات المعروضة على الموقع الرئيسي، مفهرسة برقم السؤال (Q… من questions.json أو M-…).
// قاعدة الملكية: السؤال وإجابته (وعقدة Question) على صفحته المالكة فقط؛ أي صفحة أخرى تعرض رابطًا تشويقيًا.
// مكوّنات الخادم فقط: ممنوع استيراد هذا الملف من أي ملف "use client" (يتحقق منه test:seo).

import { LOCAL } from "./local";
import { RESALE } from "./resale";
import type { Answer, PageData, RenderedAnswer } from "./types";
import { toPlain } from "../seo/lint";
import type { Faq } from "../seo/schema";
import { FAQ_MAX_CHARS, SITE } from "../seo/schema";
import owners from "../seo/faq-owners.json";

export type { Answer, PageData, RenderedAnswer } from "./types";

export const ANSWERS: Answer[] = [...LOCAL, ...RESALE];

const BY_ID = new Map(ANSWERS.map((a) => [a.id, a]));

export function getAnswer(id: string): Answer | undefined {
  return BY_ID.get(id);
}

/** «[نص](/رابط/)» → «نص»، ورابط الهيئة بصيغته النصية — لـ JSON-LD وllms */
export function plainText(t: string): string {
  return toPlain(t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1"));
}

export function firstParagraph(t: string): string {
  return t.split(/\n\n+/)[0].trim();
}

/**
 * إجابات صفحة معينة بالترتيب المطلوب: الموثّقة فقط، وعلى مالكها فقط، وبعد حساب نصها من البيانات.
 * سؤال لا تملكه الصفحة يُتجاهل هنا (استخدم teaser له).
 */
export function answersFor(path: string, data: PageData, ids: string[]): RenderedAnswer[] {
  const out: RenderedAnswer[] = [];
  for (const id of ids) {
    const ans = BY_ID.get(id);
    if (!ans || ans.status !== "verified" || ans.owner !== path) continue;
    const a = ans.a(data);
    if (!a) continue;
    out.push({ id, q: ans.q, a, sources: ans.sources, anchor: ans.anchor, faq: ans.faq !== false });
  }
  return out;
}

/**
 * عناصر FAQPage: المعلَّمة faq فقط، ونص الإجابة = الفقرة الأولى بصيغتها النصية.
 * الفقرة الأطول من الحد لا تدخل JSON-LD (تبقى مرئية) بدل أن تُسقط الصفحة وقت البناء.
 */
export function faqFrom(items: RenderedAnswer[], max = 6): Faq[] {
  return items
    .filter((i) => i.faq)
    .map((i) => ({ id: i.id, q: i.q, a: plainText(firstParagraph(i.a)) }))
    .filter((f) => f.a.length <= FAQ_MAX_CHARS)
    .slice(0, max);
}

const OWNER_URL = new Map((owners as { id: string; owner_url: string }[]).map((o) => [o.id, o.owner_url]));

/**
 * رابط تشويقي لسؤال تملكه صفحة أخرى (لا إجابة ولا Question). للموثّق فقط؛ وأسئلة المنصة
 * (/baitelwatan/…) لا تُربط من هنا — روابطها تمر عبر PlatformLink حين تُطلق صفحاتها.
 */
export function teaser(id: string, label?: string): { q: string; href: string } | null {
  const ans = BY_ID.get(id);
  if (ans) {
    if (ans.status !== "verified") return null;
    return { q: label || ans.q, href: `${ans.owner}${ans.anchor ? `#${ans.anchor}` : ""}` };
  }
  const url = OWNER_URL.get(id);
  if (!url || !label || url.startsWith(`${SITE}/baitelwatan/`)) return null;
  return { q: label, href: url.slice(SITE.length) };
}
