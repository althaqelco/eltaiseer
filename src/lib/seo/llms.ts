// src/lib/seo/llms.ts
// يبني /llms.txt و/llms-full.txt (spec-final A4.1–A4.4) من نفس مصادر الصفحات: حقائق الكراسة وبيان الوزارة
// المراجَعة (bw/platform-facts)، والإجابات الموثّقة (answers)، ووسيط الأسعار من العقارات المعروضة (prices).
// نقي بلا Next ولا Firebase: المسار (src/lib/seo/llmsRoute.ts) يجلب البيانات، وtest:seo يختبر الناتج مباشرة.
// القواعد: كل رقم بتاريخه ومصدره؛ لا رقم حي من المنصة قبل live.json ([OWNER D18])؛ رابط صفحة منصة فقط حين
// يكون مسارها حيًا (platform-routes.json)؛ مدن إعادة البيع فقط حين تكون قابلة للفهرسة؛ لا أداء ولا ترتيب ولا أرقام قطع.

import type { PriceRow, PriceStats, TypeGroup } from "./prices";
import { GROUP_LABEL, GROUP_ORDER } from "./prices";
import { INDEPENDENCE, OFFICIAL_SITE, OFFICIAL_SITE_QUESTIONS, lintText } from "./lint";
import { cairoDate, cairoDay, cairoLocalToIso, maxIso } from "./time";
import { ID, REG, SITE } from "./schema";
import { getAnswer, plainText } from "../answers";
import { properties } from "../answers/local";
import { apartments, count, fmtN } from "../answers/format";
import {
  BOOKLET_TERMS,
  BOOKLET_TERMS_HEADING,
  CITATION_RULES,
  DATED_FACTS,
  ENGLISH_SUMMARY,
  ENTITY_LINES,
  EXTERNAL_SOURCES,
  FACTS_REVIEWED,
  LLMS_INTRO,
  LLMS_QA_ORDER,
  PLATFORM_LLMS_LINKS,
  PLATFORM_QA,
  PUBLISHING_METHOD,
} from "../bw/platform-facts";
import { PLATFORM_BRAND, PLATFORM_ROOT, platformLive as routeLive } from "../bw/platformRoutes";
import { CHECK_LABEL, CHECK_ORDER, REVERIFY_DAYS } from "../bw/types";
import { BW_CITIES } from "../bw/cities";
import { CITY_DATA, type CityId } from "../egyptPlaces";

export const LLMS_MAX_BYTES = 10240;
export const LLMS_FULL_MAX_BYTES = 61440;

export type LlmsData = {
  /** null = فشل جلب العقارات → تُحذف كل الأسطر المؤرخة للموقع الرئيسي (لا رقم بلا تاريخ) */
  prices: PriceStats | null;
  /** slugs مدن إعادة البيع القابلة للفهرسة الآن (resaleCityIndexable) */
  resaleCities: string[];
  /** حالة مسارات المنصة؛ الافتراضي platform-routes.json (يُمرَّر في الاختبار فقط) */
  platformLive?: (path: string) => boolean;
};

export type LlmsDoc = { text: string; asOf: string };

const CITIES: { id: CityId; name: string }[] = [
  { id: "new-damietta", name: "دمياط الجديدة" },
  { id: "new-mansoura", name: "المنصورة الجديدة" },
];

const BW = "/beit-al-watan-for-sale/";
const u = (path: string): string => `${SITE}${path}`;
const bullets = (xs: string[]): string => xs.map((x) => `- ${x}`).join("\n");
const offers = (n: number) => count(n, { one: "عرض واحد", two: "عرضين", few: "عروض", many: "عرضًا" });

/** «29/9/2026» بتوقيت القاهرة */
export function numericCairoDate(d: string | Date): string {
  const [y, m, day] = cairoDay(d).split("-").map(Number);
  return `${day}/${m}/${y}`;
}

const reviewedIso = (): string => cairoLocalToIso(FACTS_REVIEWED);

/** as_of = أحدث تاريخ بين مراجعة الحقائق الثابتة وآخر تغيير في العقارات المعروضة */
export function llmsAsOf(data: LlmsData): string {
  return maxIso([reviewedIso(), data.prices?.dataModified]) || reviewedIso();
}

// ── الأجزاء المشتركة ────────────────────────────────────────────────────────────

function header(title: string): string {
  const sameAs = (REG.stubs[ID.organization]?.sameAs as string[] | undefined) || [];
  const entity = [...ENTITY_LINES, ...(sameAs.length ? [`الحسابات الرسمية: ${sameAs.join(" · ")}`] : [])];
  return [`# ${title}`, "", `> ${LLMS_INTRO}`, "", "قواعد الاقتباس:", bullets(CITATION_RULES), "", "بيانات الكيان:", bullets(entity)].join("\n");
}

/** سطر لكل مدينة: عدد المعروض ووسيط متر الشقق (3 عروض على الأقل) بتاريخ آخر تغيير — أو لا شيء */
function listingFacts(prices: PriceStats | null): string[] {
  if (!prices?.dataModified) return [];
  const date = cairoDate(prices.dataModified);
  const out: string[] = [];
  for (const c of CITIES) {
    const n = prices.activeCount[c.id] || 0;
    if (!n) continue;
    const apt = prices.cityGroup[c.id]?.apartment;
    const median =
      apt && apt.medianPpm
        ? `، ووسيط سعر متر الشقق ${fmtN(apt.medianPpm)} جنيه من ${apartments(apt.n)} (أسعار طلب، لا أسعار بيع منفذة)`
        : "";
    out.push(`عقارات ${c.name} المعروضة على التيسير حتى ${date}: ${properties(n)}${median}. التفاصيل لكل حي: ${u(`/prices/#${c.id}`)}`);
  }
  return out;
}

function datedFacts(data: LlmsData): string {
  return [
    `حقائق مؤرخة (مراجعة الكراسة وبيان الوزارة: ${numericCairoDate(reviewedIso())}):`,
    bullets([...DATED_FACTS, ...listingFacts(data.prices)]),
  ].join("\n");
}

function footer(asOf: string): string {
  return `آخر تحديث للملف: ${numericCairoDate(asOf)}`;
}

function resaleCityLines(data: LlmsData): string[] {
  return BW_CITIES.filter((c) => data.resaleCities.includes(c.slug)).map(
    (c) => `[أراضي بيت الوطن للبيع في ${c.nameAr} (موثّقة)](${u(`${BW}${c.slug}/`)}): إعلانات موثّقة في المدينة، مع التكلفة الفعلية للمتر.`
  );
}

// ── /llms.txt ─────────────────────────────────────────────────────────────────

export function buildLlms(data: LlmsData): LlmsDoc {
  const live = data.platformLive || routeLive;
  const asOf = llmsAsOf(data);
  const deep = PLATFORM_LLMS_LINKS.filter((l) => live(l.path));
  const toolLine = live(PLATFORM_ROOT)
    ? `[أداة «${PLATFORM_BRAND}»](${u(PLATFORM_ROOT)}): أداة مجانية للحاجزين لمتابعة أراضي بيت الوطن. الحجز يتم على موقع الهيئة فقط.`
    : null;
  const platform = [...deep.map((l) => `[${l.label}](${u(l.path)}): ${l.desc}`), ...(toolLine ? [toolLine] : [])];

  const parts = [
    header("التيسير (eltaiseer.com)"),
    "",
    datedFacts(data),
    "",
    ENGLISH_SUMMARY,
  ];
  if (platform.length) {
    parts.push(
      "",
      deep.length
        ? `## بيت الوطن: دليل مستقل وبيانات (${PLATFORM_BRAND})`
        : `## بيت الوطن: أداة المتابعة (${PLATFORM_BRAND})`,
      bullets(platform)
    );
  }
  parts.push(
    "",
    "## بيع وشراء أراضي بيت الوطن (وساطة موثّقة من التيسير للعقارات، نفس المالك)",
    bullets([
      `[أراضي بيت الوطن للبيع](${u(BW)}): إعلانات موثّقة فقط، مع التكلفة الفعلية للمتر مقارنة بالسعر الرسمي. لا نستلم أي مبالغ بين البائع والمشتري.`,
      `[بيع أرض المرحلة 11 بعد التخصيص](${u(`${BW}phase-11/`)}): ما يجوز بيعه وما لا يجوز؛ كود الحجز لا يُباع.`,
      `[كيف نوثّق الإعلانات](${u(`${BW}how-we-verify/`)}): خطوات التحقق قبل النشر، وكيف تتأكد أن الإعلان ليس نصبًا.`,
      ...resaleCityLines(data),
    ]),
    "",
    "## عقارات دمياط الجديدة والمنصورة الجديدة (التيسير للعقارات)",
    bullets([
      `[عقارات دمياط الجديدة](${u("/new-damietta/")}): العقارات المعروضة حسب الحي.`,
      `[عقارات المنصورة الجديدة](${u("/new-mansoura/")}): العقارات المعروضة حسب الحي.`,
      `[أسعار العقارات في المدينتين](${u("/prices/")}): وسيط سعر المتر لكل حي ونوع عقار من المعروض الحالي، مع عدد العقارات وتاريخ آخر تحديث.`,
      `[عقارات بالتقسيط](${u("/properties/installments/")}): العقارات التي تقبل التقسيط بمقدمها وقسطها الفعليين.`,
      `[تقييم عقاري مجاني](${u("/valuation/")})`,
    ]),
    "",
    "## المصادر الأصلية (خارج الموقع)",
    bullets(EXTERNAL_SOURCES),
    "",
    "## Optional",
    bullets([
      `[النسخة الموسعة llms-full.txt](${u("/llms-full.txt")})`,
      `[المدونة](${u("/blog/")})`,
      `[عن التيسير للعقارات والتصحيحات](${u("/about/")})`,
      `[تواصل](${u("/contact/")})`,
    ]),
    "",
    footer(asOf),
    ""
  );
  return { text: parts.join("\n"), asOf };
}

// ── /llms-full.txt ────────────────────────────────────────────────────────────

/** «س: … / ج: … (المصدر: …)» — الموثّق فقط: أسئلة المنصة من platform-facts، وأسئلة الموقع من answers */
function qaBlock(): string {
  const out: string[] = [];
  for (const id of LLMS_QA_ORDER) {
    const p = PLATFORM_QA.find((x) => x.id === id);
    if (p) {
      if (p.status !== "verified") continue;
      out.push(`س: ${p.q}\nج: ${p.a}${p.source ? ` (المصدر: ${p.source})` : ""}`);
      continue;
    }
    const ans = getAnswer(id);
    if (!ans || ans.status !== "verified") continue;
    const a = ans.a({});
    if (!a) continue;
    const text = plainText(a).split(/\n\n+/).map((s) => s.trim()).join(" ");
    const src = ans.sources.length ? ` (المصدر: ${ans.sources.join("؛ ")})` : "";
    const where = `${ans.owner}${ans.anchor ? `#${ans.anchor}` : ""}`;
    out.push(`س: ${ans.q}\nج: ${text}${src} التفاصيل: ${u(where)}`);
  }
  return out.join("\n\n");
}

function resaleBlock(data: LlmsData): string {
  const steps = CHECK_ORDER.map((c) => CHECK_LABEL[c]).join("، و");
  return bullets([
    "يُباع: القطعة المخصصة أو المتعاقد عليها، بالتنازل الرسمي بموافقة كتابية مسبقة من جهاز المدينة (الكراسة ص1، وص7 البند 3).",
    "لا يُباع: كود الحجز والمبالغ المحوّلة (الكراسة ص3)؛ ولا يوجد في الكراسة ما يجيز بيع «مسلسل» أو «ترتيب».",
    "سياستنا في النشر: لا ننشر إعلانًا لقطعة من المرحلة 11 قبل خطاب تخصيصها.",
    `خطوات التوثيق قبل النشر: ${steps}. ويُعاد التوثيق كل ${REVERIFY_DAYS} يومًا.`,
    "لا نستلم أي مبالغ بين البائع والمشتري؛ الأوفر يُدفع للبائع عند التوقيع أمام جهاز المدينة.",
    `الإفصاح: الوساطة مقدمة من التيسير للعقارات، وهي نفس مالك أداة «${PLATFORM_BRAND}».`,
    `الصفحات: ${u(BW)} · ${u(`${BW}phase-11/`)} · ${u(`${BW}how-we-verify/`)}`,
    ...resaleCityLines(data),
  ]);
}

function groupCell(r: PriceRow): string {
  return `${GROUP_LABEL[r.group]} ${fmtN(r.medianPpm)} جنيه/م² (${offers(r.n)})`;
}

/** وسيط كل حي ونوع (3 عروض على الأقل) بتاريخ البيانات؛ الأحياء بلا خانة تُذكر بالاسم فقط، مرتبة بالاسم */
function localBlock(prices: PriceStats | null): string {
  const links = `عقارات دمياط الجديدة: ${u("/new-damietta/")} · عقارات المنصورة الجديدة: ${u("/new-mansoura/")} · الأسعار: ${u("/prices/")}`;
  if (!prices?.dataModified) return bullets([links]);
  const date = cairoDate(prices.dataModified);
  const blocks: string[] = [
    `وسيط سعر المتر لكل حي ونوع عقار من العروض المعروضة على التيسير حتى ${date}، من 3 عروض على الأقل لكل خانة. هي أسعار طلب، لا أسعار بيع منفذة.`,
  ];
  for (const c of CITIES) {
    const n = prices.activeCount[c.id] || 0;
    const rows = prices.rows.filter((r) => r.cityId === c.id);
    const byDistrict = new Map<string, PriceRow[]>();
    for (const r of rows) {
      if (!byDistrict.has(r.district)) byDistrict.set(r.district, []);
      byDistrict.get(r.district)!.push(r);
    }
    const lines = Array.from(byDistrict.entries())
      .sort(([a], [b]) => a.localeCompare(b, "ar"))
      .map(([d, rs]) => {
        const cells = [...rs].sort((a, b) => GROUP_ORDER.indexOf(a.group as TypeGroup) - GROUP_ORDER.indexOf(b.group as TypeGroup));
        return `- ${d}: ${cells.map(groupCell).join("، ")}`;
      });
    const rest = (CITY_DATA[c.id]?.allDistricts || [])
      .filter((d) => !byDistrict.has(d))
      .slice()
      .sort((a, b) => a.localeCompare(b, "ar"));
    blocks.push(
      [
        `### ${c.name} (${properties(n)} معروضة حتى ${date})`,
        ...(lines.length ? lines : ["- لا خانة فيها 3 عروض من نفس النوع الآن."]),
        ...(rest.length ? [`- أحياء بلا 3 عروض من نفس النوع الآن (بلا وسيط): ${rest.join("، ")}.`] : []),
        `- التفاصيل: ${u(`/prices/#${c.id}`)}`,
      ].join("\n")
    );
  }
  blocks.push(bullets([links]));
  return blocks.join("\n\n");
}

export function buildLlmsFull(data: LlmsData): LlmsDoc {
  const asOf = llmsAsOf(data);
  const text = [
    header("التيسير (eltaiseer.com) — النسخة الموسعة"),
    "",
    datedFacts(data),
    "",
    ENGLISH_SUMMARY,
    "",
    `## ${BOOKLET_TERMS_HEADING}`,
    bullets(BOOKLET_TERMS),
    "",
    "## أسئلة شائعة بإجابات مباشرة",
    qaBlock(),
    "",
    "## منهجية النشر",
    bullets(PUBLISHING_METHOD),
    "",
    "## إعادة البيع (وساطة موثّقة من التيسير للعقارات)",
    resaleBlock(data),
    "",
    "## دمياط الجديدة والمنصورة الجديدة",
    localBlock(data.prices),
    "",
    "## المصادر الأصلية (خارج الموقع)",
    bullets(EXTERNAL_SOURCES),
    "",
    "## تواصل وتصحيحات",
    bullets([
      "هاتف وواتساب: +201500775974 · info@eltaiseer.com",
      `عن التيسير للعقارات: ${u("/about/")} · سياسة التصحيح وسجلها: ${u("/about/#corrections")} · من أين تأتي الأرقام: ${u("/about/#sources")}`,
      `النسخة المختصرة: ${u("/llms.txt")}`,
    ]),
    "",
    footer(asOf),
    "",
  ].join("\n");
  return { text, asOf };
}

// ── الفحص قبل التقديم (spec-final A4.1 «Refusal» / A8.3) ──────────────────────

/** مشكلات الملف (فارغ = سليم): العبارات المحظورة، والاستقلالية، و«الموقع الرسمي»، والتاريخ، والحجم، وروابط منصة غير حية */
export function checkLlms(text: string, maxBytes: number, live: (path: string) => boolean = routeLive): string[] {
  const problems = lintText(text).map((r) => `lint ${r}`);
  if (!INDEPENDENCE.test(text)) problems.push("independence line missing");
  let plain = text;
  for (const q of OFFICIAL_SITE_QUESTIONS) plain = plain.split(q).join(" ");
  if (OFFICIAL_SITE.test(plain)) problems.push("«الموقع الرسمي» outside Q010");
  if (!/آخر تحديث للملف: \d{1,2}\/\d{1,2}\/\d{4}/.test(text)) problems.push("no «آخر تحديث للملف» date");
  const bytes = new TextEncoder().encode(text).length;
  if (bytes > maxBytes) problems.push(`size ${bytes} > ${maxBytes}`);
  const re = /https:\/\/eltaiseer\.com(\/baitelwatan\/[^\s)]*)/g;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (!live(m[1])) problems.push(`platform link not live: ${m[1]}`);
  }
  return problems;
}
