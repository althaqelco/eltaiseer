// src/lib/seo/schema.ts
// مساعدات JSON-LD النقية (بلا Next ولا Firebase): معرّفات ثابتة من سجل واحد (schema-registry.json)،
// وإغلاق الرسم البياني بحيث كل {"@id"} تشير إليه الصفحة معرَّف فيها (بالعقدة الكاملة أو بقالب السجل).
// المرجع: spec-final §0.3 وA1.1. السجل نفسه يُنسخ حرفيًا إلى المنصة لاحقًا ويُثبَّت بـ SHA-256 في الاختبار.

import registry from "./schema-registry.json";
import { toPlain } from "./lint";
import { IN_LANGUAGE } from "./owner-flags";

export { IN_LANGUAGE };

type Node = Record<string, unknown>;

export const SITE = "https://eltaiseer.com";
export const REG = registry as { version: string; site: string; ids: Record<string, string>; stubs: Record<string, Node> };
export const ID = REG.ids; // ID.organization, ID.website, ID.app, …

export const ref = (id: string): { "@id": string } => ({ "@id": id });
export const ORG = ref(ID.organization);
export const WEBSITE = ref(ID.website);

/** عقدة كيان مشترك: خصائص الصفحة + قالب السجل (مفاتيح القالب تغلب، فتتطابق القيم في كل صفحة). */
export const node = (id: string, extra: Node = {}): Node => ({ "@id": id, ...extra, ...(REG.stubs[id] || {}) });

/** قاعدة واحدة للشرطة الأخيرة؛ لا تغيّر حالة الأحرف أبدًا (معرفات العقارات فيها أحرف كبيرة). */
export function abs(p: string): string {
  const [path, hash] = p.split("#");
  let u = path.startsWith("http") ? path : SITE + (path.startsWith("/") ? path : `/${path}`);
  if (!u.endsWith("/") && !/\.[a-z0-9]+$/i.test(u)) u += "/"; // الملفات (.pdf/.csv/.txt) بلا شرطة
  return hash ? `${u}#${hash}` : u;
}
export const pageUrl = (path: string): string => abs(path.split("#")[0]);
export const pageId = (path: string): string => `${pageUrl(path)}#webpage`;
export const cityId = (slug: string): string => `${SITE}/#city-${slug}`;
export const districtId = (city: string, d: string): string => `${SITE}/#district-${city}-${d}`;
export const ID_RE = /^https:\/\/eltaiseer\.com\/([A-Za-z0-9-]+\/)*#[a-z0-9-]+$/;

/** معرّفات يعرّفها سكربت الـ layout في كل صفحة؛ رسوم الصفحات لا تعيد إضافة قوالبها. */
export const LAYOUT_IDS = new Set<string>([
  ID.organization,
  ID.logo,
  ID.website,
  ID.brand,
  ID.serviceResale,
  ID.serviceValuation,
  cityId("new-damietta"),
  cityId("new-mansoura"),
  `${SITE}/#gov-damietta`,
  `${SITE}/#gov-dakahlia`,
]);

/**
 * يغلق الرسم: لكل @id مُشار إليه وغير معرّف في الصفحة يضيف قالبه من السجل (تكراريًا، فمراجع القالب تُغلق أيضًا).
 * @id مجهول بلا قالب = خطأ وقت البناء، لا مرجع معلّق في الإنتاج.
 */
export function closeGraph(
  nodes: unknown[],
  opts: { external?: Set<string>; minimal?: (id: string) => boolean } = {}
): Node[] {
  const out = (nodes.flat(2).filter(Boolean) as Node[]).map((n) => n);
  const have = new Set<string>(opts.external || []);
  for (const n of out) if (typeof n["@id"] === "string" && n["@type"]) have.add(n["@id"] as string);
  const collect = (v: unknown, acc: Set<string>): void => {
    if (Array.isArray(v)) {
      v.forEach((x) => collect(x, acc));
      return;
    }
    if (!v || typeof v !== "object") return;
    const keys = Object.keys(v as Node);
    if (keys.length === 1 && keys[0] === "@id") {
      acc.add((v as Node)["@id"] as string);
      return;
    }
    keys.forEach((k) => collect((v as Node)[k], acc));
  };
  for (let i = 0; i < out.length; i++) {
    // out يكبر أثناء المرور → إغلاق تكراري
    const acc = new Set<string>();
    collect(out[i], acc);
    acc.forEach((id) => {
      if (have.has(id)) return;
      const s = REG.stubs[id];
      if (!s) throw new Error(`dangling @id without registry stub: ${id}`);
      out.push(opts.minimal?.(id) ? { "@type": s["@type"], "@id": id, name: s.name } : { "@id": id, ...s });
      have.add(id);
    });
  }
  return out;
}

function strip<T extends Record<string, unknown>>(o: T): T {
  for (const k of Object.keys(o)) if (o[k] === undefined) delete o[k];
  return o;
}

export function webPage(o: {
  path: string;
  type?: string | string[];
  name: string;
  description?: string;
  about?: object | object[];
  mainEntity?: object;
  mentions?: object[];
  hasPart?: object[];
  datePublished?: string;
  dateModified?: string;
  lastReviewed?: string;
  reviewedBy?: object;
  primaryImage?: string;
  breadcrumb?: boolean;
  relatedLink?: string[];
  significantLink?: string[];
}): Node {
  const url = pageUrl(o.path);
  return strip({
    "@type": o.type || "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: o.name,
    description: o.description,
    inLanguage: IN_LANGUAGE,
    isPartOf: WEBSITE,
    publisher: ORG,
    breadcrumb: o.breadcrumb === false ? undefined : ref(`${url}#breadcrumb`),
    about: o.about,
    mainEntity: o.mainEntity,
    mentions: o.mentions,
    hasPart: o.hasPart,
    datePublished: o.datePublished,
    dateModified: o.dateModified,
    lastReviewed: o.lastReviewed,
    reviewedBy: o.reviewedBy,
    primaryImageOfPage: o.primaryImage
      ? { "@type": "ImageObject", "@id": `${url}#primaryimage`, url: o.primaryImage }
      : undefined,
    relatedLink: o.relatedLink,
    significantLink: o.significantLink,
  });
}

/** id = رقم السؤال في questions.json (Q…) أو M-… للأسئلة الخاصة بالموقع الرئيسي */
export type Faq = { id: string; q: string; a: string };
export const FAQ_MAX_ITEMS = 6;
export const FAQ_MAX_CHARS = 300;

export function faqNode(path: string, items: Faq[]): Node | null {
  if (items.length === 0) return null;
  if (items.length > FAQ_MAX_ITEMS) throw new Error(`FAQPage ${path}: ${items.length} > ${FAQ_MAX_ITEMS} items`);
  const url = pageUrl(path);
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    isPartOf: ref(`${url}#webpage`),
    inLanguage: IN_LANGUAGE,
    mainEntity: items.map((f) => {
      const text = toPlain(f.a);
      if (text.length > FAQ_MAX_CHARS) throw new Error(`FAQ ${f.id}: acceptedAnswer > ${FAQ_MAX_CHARS} chars`);
      return { "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text } };
    }),
  };
}

export function breadcrumbNode(path: string, items: { name: string; path: string }[]): Node {
  const url = pageUrl(path);
  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: pageUrl(it.path) })),
  };
}

export function itemListNode(path: string, urls: string[], o: { name?: string; total?: number } = {}): Node {
  const url = pageUrl(path);
  return strip({
    "@type": "ItemList",
    "@id": `${url}#itemlist`,
    name: o.name,
    numberOfItems: o.total ?? urls.length, // عدد صحيح لا نص
    itemListElement: urls.map((u, i) => ({ "@type": "ListItem", position: i + 1, url: abs(u) })),
  });
}

/** رسم صفحة: مغلق على السجل، ومعرّفات الـ layout معتبرة معرّفة. */
export const graph = (...nodes: unknown[]) => ({
  "@context": "https://schema.org",
  "@graph": closeGraph(nodes, { external: LAYOUT_IDS }),
});

/** رسم الـ layout: مغلق وحده. */
export const siteGraph = (...nodes: unknown[]) => ({ "@context": "https://schema.org", "@graph": closeGraph(nodes) });

/** نص <script type="application/ld+json"> آمن: «<» → < حتى لا يغلق نص حر الوسم. */
export function jsonLdString(o: unknown): string {
  return JSON.stringify(o).replace(/</g, "\\u003c");
}
