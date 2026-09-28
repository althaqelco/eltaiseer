// lib/bw/calc.ts
// حسابات نقية بلا Firestore ولا شبكة: كارت التكلفة، المقارنة بالسعر الرسمي، دورة حياة الإعلان، سعر السوق المجمّع.

import {
  BwListing,
  MARKET_WINDOW_DAYS,
  MIN_POINTS,
  REVERIFY_DAYS,
  SOLD_VISIBLE_DAYS,
} from "./types";
import type { BwLiveCity } from "./live-parse";

const DAY = 86400000;

function num(n: number | null | undefined): number | null {
  return typeof n === "number" && isFinite(n) && n >= 0 ? n : null;
}

export interface CostCard {
  officialTotalUsd: number | null;
  paidUsd: number | null;
  remainingUsd: number | null;
  premiumEgp: number;
  usdEgp: number;
  feesUsd: number | null;
  // ما يدفعه المشتري للبائع عند التوقيع: المسدد (يُسترد للبائع) + الأوفر
  toSellerUsd: number | null;
  // التكلفة الكلية على المشتري بما فيها الأقساط المتبقية للهيئة، بما يعادلها بالدولار
  totalUsdEquiv: number | null;
  perM2Usd: number | null;
  perM2Egp: number | null;
  premiumPerM2Usd: number | null;
}

export function costCard(l: BwListing): CostCard {
  const official = num(l.officialTotalUsd);
  const paid = num(l.paidUsd);
  const remaining = num(l.remainingUsd);
  const rate = num(l.usdEgp) || 0;
  const premium = num(l.premiumEgp) || 0;
  const premiumUsd = rate > 0 ? premium / rate : null;
  const fees = official !== null && l.feesPct > 0 ? (official * l.feesPct) / 100 : null;
  const total = official !== null && premiumUsd !== null ? official + premiumUsd + (fees || 0) : null;
  const area = l.area > 0 ? l.area : null;
  return {
    officialTotalUsd: official,
    paidUsd: paid,
    remainingUsd: remaining,
    premiumEgp: premium,
    usdEgp: rate,
    feesUsd: fees,
    toSellerUsd: paid !== null && premiumUsd !== null ? paid + premiumUsd : null,
    totalUsdEquiv: total,
    perM2Usd: total !== null && area ? total / area : null,
    perM2Egp: total !== null && area && rate ? (total * rate) / area : null,
    premiumPerM2Usd: premiumUsd !== null && area ? premiumUsd / area : null,
  };
}

export interface OfficialCompare {
  officialMin: number;
  officialMedian: number;
  officialMax: number;
  diffUsd: number; // التكلفة الفعلية للمتر − وسيط سعر المتر الرسمي في الطرح الحالي
  diffPct: number;
  available: number;
  total: number;
}

export function compareWithOfficial(perM2Usd: number | null, city: BwLiveCity | null | undefined): OfficialCompare | null {
  if (perM2Usd === null || !city || !city.ppmMedian) return null;
  const diff = perM2Usd - city.ppmMedian;
  return {
    officialMin: city.ppmMin,
    officialMedian: city.ppmMedian,
    officialMax: city.ppmMax,
    diffUsd: diff,
    diffPct: (diff / city.ppmMedian) * 100,
    available: city.available,
    total: city.total,
  };
}

export type Lifecycle =
  | { kind: "live" }
  | { kind: "sold-visible" }
  | { kind: "gone-temp" } // انتهت مدة التوثيق أو أُنهي الإعلان: تحويل مؤقت لصفحة المدينة (قد يعود بعد إعادة التوثيق)
  | { kind: "gone-permanent" } // بيعت منذ أكثر من 30 يومًا: تحويل دائم
  | { kind: "not-found" };

// تاريخ توثيق في المستقبل (خطأ كتابة مثل 2027) يُعامل كمنتهٍ، وإلا بقي الإعلان حيًا بلا نهاية
export function isStale(l: BwListing, now: number): boolean {
  const v = Date.parse(l.verifiedAt);
  return !isFinite(v) || v > now + DAY || now - v > REVERIFY_DAYS * DAY;
}

export function lifecycle(l: BwListing | null, now: number): Lifecycle {
  if (!l) return { kind: "not-found" };
  if (l.status === "active") return isStale(l, now) ? { kind: "gone-temp" } : { kind: "live" };
  if (l.status === "sold") {
    const s = l.soldAt ? Date.parse(l.soldAt) : NaN;
    return isFinite(s) && now - s <= SOLD_VISIBLE_DAYS * DAY ? { kind: "sold-visible" } : { kind: "gone-permanent" };
  }
  if (l.status === "expired") return { kind: "gone-temp" };
  return { kind: "not-found" }; // مسودة أو مسحوب
}

export function isLive(l: BwListing, now: number): boolean {
  return l.status === "active" && !isStale(l, now);
}

// سعر السوق لكل مدينة من إعلاناتنا الموثّقة (النشطة والمباعة) خلال 90 يومًا — يظهر فقط من 3 نقاط فأكثر
export interface MarketPoint {
  citySlug: string;
  n: number;
  medianPerM2Usd: number;
  minPerM2Usd: number;
  maxPerM2Usd: number;
}

function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export function marketByCity(listings: BwListing[], now: number): Record<string, MarketPoint> {
  const by: Record<string, number[]> = {};
  for (const l of listings) {
    if (l.status !== "active" && l.status !== "sold") continue;
    const at = Date.parse(l.status === "sold" && l.soldAt ? l.soldAt : l.verifiedAt);
    if (!isFinite(at) || now - at > MARKET_WINDOW_DAYS * DAY) continue;
    const c = costCard(l).perM2Usd;
    if (c === null) continue;
    (by[l.citySlug] ||= []).push(c);
  }
  const out: Record<string, MarketPoint> = {};
  for (const [citySlug, xs] of Object.entries(by)) {
    if (xs.length < MIN_POINTS) continue;
    out[citySlug] = {
      citySlug,
      n: xs.length,
      medianPerM2Usd: median(xs),
      minPerM2Usd: Math.min(...xs),
      maxPerM2Usd: Math.max(...xs),
    };
  }
  return out;
}

// ─── الروابط ───
export function listingSlug(l: Pick<BwListing, "id" | "districtSlug" | "area">): string {
  const area = Math.round(l.area);
  return [l.districtSlug || "plot", area > 0 ? `${area}m` : "", l.id.toLowerCase()].filter(Boolean).join("-");
}

export function listingPath(l: Pick<BwListing, "id" | "districtSlug" | "area" | "citySlug">): string {
  return `/beit-al-watan-for-sale/${l.citySlug}/${listingSlug(l)}/`;
}

// المعرّف آخر مقطع بعد الشرطة الأخيرة؛ الإعلانات تستخدم معرفات Firestore قصيرة بلا شرطات
export function idFromSlug(slug: string): string {
  const parts = (slug || "").split("-");
  return (parts[parts.length - 1] || "").toUpperCase();
}

// ─── تنسيق ───
// العدد مع المعدود بقواعد العربية: إعلان واحد، إعلانان، 3–10 إعلانات، 11–99 إعلانًا، ١٠٠–١٠٢ إعلان
export function arCount(n: number, f: { one: string; two: string; few: string; many: string; sing: string }): string {
  if (n === 1) return f.one;
  if (n === 2) return f.two;
  const d = n.toLocaleString("ar-EG");
  const r = n % 100;
  if (n >= 100 && r <= 2) return `${d} ${f.sing}`;
  return r >= 3 && r <= 10 ? `${d} ${f.few}` : `${d} ${f.many}`;
}

// JSON-LD داخل <script>: نص حر من لوحة التحكم فيه «</script>» كان سيغلق الوسم
export function jsonLd(o: unknown): string {
  return JSON.stringify(o).replace(/</g, "\\u003c");
}

// «نحو ٤٥٠ م²» للإعلانات المقرّبة
export function areaLabel(l: Pick<BwListing, "area" | "approx">): string {
  return `${l.approx ? "نحو " : ""}${l.area.toLocaleString("ar-EG")} م²`;
}

export const adsCount = (n: number) => arCount(n, { one: "إعلان واحد", two: "إعلانان", few: "إعلانات", many: "إعلانًا", sing: "إعلان" });
export const requestsCount = (n: number) =>
  arCount(n, { one: "طلب شراء واحد", two: "طلبا شراء", few: "طلبات شراء", many: "طلب شراء", sing: "طلب شراء" });
export const plotsCount = (n: number) => arCount(n, { one: "قطعة واحدة", two: "قطعتان", few: "قطع", many: "قطعة", sing: "قطعة" });
export function fmtUsd(n: number | null | undefined, digits = 0): string {
  if (n === null || n === undefined || !isFinite(n)) return "—";
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: digits, minimumFractionDigits: 0 })}`;
}

export function fmtEgp(n: number | null | undefined): string {
  if (n === null || n === undefined || !isFinite(n)) return "—";
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `${m.toLocaleString("ar-EG", { maximumFractionDigits: 2 })} مليون جنيه`;
  }
  return `${Math.round(n).toLocaleString("ar-EG")} جنيه`;
}

export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
  if (!isFinite(d.getTime())) return "—";
  return d.toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Cairo" });
}
