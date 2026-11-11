// lib/marketSnapshot.ts
// لقطة حية من المعروض: إجمالي العقارات، نطاق الأسعار ومتوسط سعر المتر لكل مدينة ولكل حي.
// تغذي ملفات llms والملخص المرئي في الرئيسية — نفس الأرقام في كل سطح لأنها من دالة واحدة.

import type { Property } from "./types";
import { computeDistrictStats, type DistrictStats } from "./districtFaq";
import { getDistrictSlug } from "./districtSlugs";
import { formatNumber } from "./propertySummary";
import { formatArabicDate } from "./blogPosts";

export interface DistrictSnapshot {
  name: string;
  slug: string;
  stats: DistrictStats;
}

export interface CitySnapshot {
  id: "new-damietta" | "new-mansoura";
  name: string;
  stats: DistrictStats | null;
  districts: DistrictSnapshot[];
}

export interface MarketSnapshot {
  asOf: string;
  total: number;
  typeCounts: Array<{ type: string; count: number }>;
  cities: CitySnapshot[];
}

const CITY_LIST = [
  { id: "new-damietta", name: "دمياط الجديدة" },
  { id: "new-mansoura", name: "المنصورة الجديدة" },
] as const;

export function buildMarketSnapshot(all: Property[]): MarketSnapshot {
  const available = all.filter((p) => p.status !== "تم البيع");

  const cities: CitySnapshot[] = CITY_LIST.map(({ id, name }) => {
    const inCity = available.filter((p) => (p.location?.cityId || "new-damietta") === id);
    const byDistrict = new Map<string, Property[]>();
    for (const p of inCity) {
      const d = p.location?.district?.trim();
      if (!d) continue;
      if (!byDistrict.has(d)) byDistrict.set(d, []);
      byDistrict.get(d)!.push(p);
    }
    const districts: DistrictSnapshot[] = [];
    byDistrict.forEach((list, district) => {
      const stats = computeDistrictStats(list);
      if (stats) districts.push({ name: district, slug: getDistrictSlug(district), stats });
    });
    districts.sort((a, b) => b.stats.count - a.stats.count);
    return { id, name, stats: computeDistrictStats(inCity), districts };
  });

  const counts = new Map<string, number>();
  for (const p of available) counts.set(p.type, (counts.get(p.type) || 0) + 1);

  return {
    asOf: new Date().toISOString().slice(0, 10),
    total: available.length,
    typeCounts: Array.from(counts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count),
    cities,
  };
}

// فقرة "الإجابة المباشرة" أعلى الرئيسية: كم عقاراً معروضاً وبكم — جملة مكتملة قابلة للاقتباس
export function buildHomeSummary(s: MarketSnapshot): string | null {
  if (s.total === 0) return null;
  const cityBits = s.cities
    .filter((c) => c.stats)
    .map((c) => {
      const st = c.stats!;
      const prices =
        st.minPrice && st.minPrice !== st.maxPrice
          ? ` (الأسعار من ${formatNumber(st.minPrice)} إلى ${formatNumber(st.maxPrice)} جنيه)`
          : "";
      return `${st.count} في ${c.name}${prices}`;
    });
  const sqmBits = s.cities
    .map((c) => {
      const g = c.stats?.sqmGroups.find((x) => x.label === "الوحدات السكنية");
      return g ? `${formatNumber(g.avg)} جنيه في ${c.name}` : null;
    })
    .filter(Boolean);

  // "العدد: ن" بدل تمييز العدد — صحيحة نحوياً مع أي رقم
  let text = `عدد العقارات المعروضة للبيع الآن على التيسير للعقارات: ${s.total} — ${cityBits.join("، و")}.`;
  if (sqmBits.length) {
    text += ` متوسط سعر متر الوحدات السكنية المعروضة: ${sqmBits.join("، و")}.`;
  }
  text += ` (محسوب من المعروض الفعلي بتاريخ ${formatArabicDate(s.asOf)})`;
  return text;
}
