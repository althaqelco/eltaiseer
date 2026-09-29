// src/lib/seo/prices.ts
// وسيط سعر المتر لكل (مدينة × حي × مجموعة نوع) من الإعلانات النشطة — نقي، بلا Next ولا Firebase.
// يحل محل المتوسط البسيط القديم في /prices/ الذي خلط الشقق بالأراضي والمحلات بلا حد أدنى ولا حارس للقيم
// الشاذة (فظهر «الحي الثالث 4,652,429 جنيه/م²»). القواعد: لا خانة من أقل من 3 عقارات، والقيم خارج النطاق
// المنطقي لكل نوع تُستبعد ولا تُعرض، والترتيب محايد بالاسم. (spec-final A0.3)

export type TypeGroup = "apartment" | "villa" | "commercial" | "land" | "chalet";

export const TYPE_GROUP: Record<string, TypeGroup | null> = {
  "شقة": "apartment",
  "شقة فاخرة": "apartment",
  "دوبلكس": "apartment",
  "بنتهاوس": "apartment",
  "روف": "apartment",
  "فيلا منفصلة": "villa",
  "تاون هاوس": "villa",
  "محل تجاري": "commercial",
  "مقر إداري": "commercial",
  "عيادة": "commercial",
  "أرض": "land",
  "شاليه": "chalet",
  "مبنى تحت الإنشاء": null, // لا يدخل الوسيط
};

export const GROUP_LABEL: Record<TypeGroup, string> = {
  apartment: "شقق",
  villa: "فيلات",
  commercial: "محلات ومقرات وعيادات",
  land: "أراضٍ",
  chalet: "شاليهات",
};

export const GROUP_ORDER: TypeGroup[] = ["apartment", "land", "villa", "commercial", "chalet"];

// حدود منطقية لسعر المتر بالجنيه — ما خارجها يُستبعد من الحساب ولا يُعرض أبدًا
export const PPM_BOUNDS: Record<TypeGroup, [number, number]> = {
  apartment: [2000, 150000],
  villa: [2000, 150000],
  chalet: [2000, 150000],
  commercial: [2000, 400000],
  land: [500, 150000],
};
export const AREA_BOUNDS: [number, number] = [20, 5000];
export const MIN_N = 3;

export interface PriceInput {
  id: string;
  price: number;
  area: number;
  type: string;
  cityId: string;
  district: string;
  status: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface PriceRow {
  cityId: string;
  district: string;
  group: TypeGroup;
  n: number;
  medianPpm: number;
  minPrice: number;
  maxPrice: number;
}

/** null عند n < MIN_N */
export type GroupStat = { n: number; medianPpm: number | null; medianPrice: number | null };

export interface PriceStats {
  rows: PriceRow[];
  cityGroup: Record<string, Partial<Record<TypeGroup, GroupStat>>>;
  excluded: { id: string; reason: string }[];
  /** أحدث updatedAt/createdAt بين الإعلانات النشطة (ISO) — «آخر تحديث» الحقيقي، لا وقت فتح الصفحة */
  dataModified: string | null;
  activeCount: Record<string, number>;
}

export function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function iso(d?: string | Date): string | null {
  if (!d) return null;
  const t = new Date(d);
  return isNaN(t.getTime()) ? null : t.toISOString();
}

/** شكل عقار الموقع (lib/types.ts) → مدخل الحساب. بنيوي عمدًا حتى يبقى الملف بلا استيراد. */
export function toPriceInput(p: {
  id: string;
  price: number;
  type: string;
  status: string;
  location: { cityId?: string; district?: string };
  details?: { area_sqm?: number };
  createdAt?: string | Date;
  updatedAt?: string | Date;
}): PriceInput {
  return {
    id: p.id,
    price: Number(p.price) || 0,
    area: Number(p.details?.area_sqm) || 0,
    type: p.type,
    cityId: p.location.cityId || "new-damietta",
    district: (p.location.district || "").trim(),
    status: p.status,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

export function computePriceStats(all: PriceInput[]): PriceStats {
  const active = all.filter((p) => p.status !== "تم البيع");
  const excluded: PriceStats["excluded"] = [];
  const buckets = new Map<string, PriceInput[]>();
  const valid: PriceInput[] = [];
  const activeCount: Record<string, number> = {};
  let dataModified: string | null = null;

  for (const p of active) {
    activeCount[p.cityId] = (activeCount[p.cityId] || 0) + 1;
    const t = iso(p.updatedAt) || iso(p.createdAt);
    if (t && (!dataModified || t > dataModified)) dataModified = t;
    const g = TYPE_GROUP[p.type];
    if (!g) continue;
    if (!(p.price > 0) || !(p.area >= AREA_BOUNDS[0] && p.area <= AREA_BOUNDS[1])) {
      excluded.push({ id: p.id, reason: "area/price" });
      continue;
    }
    const ppm = p.price / p.area;
    const [lo, hi] = PPM_BOUNDS[g];
    if (ppm < lo || ppm > hi) {
      excluded.push({ id: p.id, reason: `ppm ${Math.round(ppm)}` });
      continue;
    }
    valid.push(p);
    if (!p.district) continue;
    const k = `${p.cityId}|${p.district}|${g}`;
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k)!.push(p);
  }

  const rows: PriceRow[] = [];
  buckets.forEach((ps, k) => {
    if (ps.length < MIN_N) return; // لا خانة من أقل من 3 عقارات
    const [cityId, district, group] = k.split("|") as [string, string, TypeGroup];
    rows.push({
      cityId,
      district,
      group,
      n: ps.length,
      medianPpm: Math.round(median(ps.map((p) => p.price / p.area))),
      minPrice: Math.min(...ps.map((p) => p.price)),
      maxPrice: Math.max(...ps.map((p) => p.price)),
    });
  });
  // ترتيب محايد: اسم الحي ثم مجموعة النوع
  rows.sort(
    (a, b) =>
      a.district.localeCompare(b.district, "ar") || GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group)
  );

  // وسيط كل مدينة لكل مجموعة (الشقق → Q166/Q176، الأراضي → Q165/Q175) بعد استبعاد الشاذ
  const cityGroup: PriceStats["cityGroup"] = {};
  for (const c of Object.keys(activeCount)) {
    cityGroup[c] = {};
    for (const g of GROUP_ORDER) {
      const ps = valid.filter((p) => p.cityId === c && TYPE_GROUP[p.type] === g);
      if (ps.length === 0) continue;
      cityGroup[c][g] =
        ps.length >= MIN_N
          ? {
              n: ps.length,
              medianPpm: Math.round(median(ps.map((p) => p.price / p.area))),
              medianPrice: Math.round(median(ps.map((p) => p.price))),
            }
          : { n: ps.length, medianPpm: null, medianPrice: null };
    }
  }

  return { rows, cityGroup, excluded, dataModified, activeCount };
}

/** صفوف مدينة واحدة لمجموعة (أو مجموعات) معينة، بترتيب الحي */
export function cityRows(stats: PriceStats, cityId: string, groups: TypeGroup[]): PriceRow[] {
  return stats.rows.filter((r) => r.cityId === cityId && groups.includes(r.group));
}

export const fmtN = (n: number): string => n.toLocaleString("en-US");
