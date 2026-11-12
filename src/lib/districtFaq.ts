// lib/districtFaq.ts
// إحصاءات حية + أسئلة وأجوبة لكل حي، مبنية من العقارات المعروضة فعلاً.
// مصدر واحد يولد القسم المرئي وschema الـ FAQPage معاً (نفس قاعدة homeFaq/cityFaq).
// كل رقم في الإجابات محسوب من بيانات الإعلانات — لا عبارات عامة مكررة في 53 صفحة.

import type { Property } from "./types";
import type { FaqItem } from "./homeFaq";
import type { DistrictEditorial } from "./districtContent";
import { formatNumber, hasInstallment, averagePerSqm } from "./propertySummary";
import { formatArabicDate } from "./blogPosts";

const RESIDENTIAL = ["شقة", "شقة فاخرة", "دوبلكس", "بنتهاوس", "روف", "فيلا منفصلة", "تاون هاوس", "شاليه"];
const COMMERCIAL = ["محل تجاري", "مقر إداري", "عيادة"];
const LAND = ["أرض"];

export interface SqmGroup {
  label: string;
  avg: number;
  count: number;
}

export interface DistrictStats {
  count: number;
  minPrice: number;
  maxPrice: number;
  /* متوسط كل المعروض — يبقى لصندوق الإحصاءات الحالي */
  avgPerSqm: number | null;
  types: string[];
  /* متوسط سعر المتر لكل فئة على حدة: خلط المحلات بالشقق في متوسط واحد يضلل القارئ */
  sqmGroups: SqmGroup[];
  typeCounts: Array<{ type: string; count: number }>;
  installmentCount: number;
  minDownPayment: number | null;
  readyCount: number;
  underConstructionCount: number;
  /* تاريخ حساب الأرقام (ISO) */
  asOf: string;
}

// available = عقارات الحي غير المباعة
// صيغة الجمع لكل نوع — لعنوان صفحة الحي (العنوان يذكر الأنواع المعروضة فعلاً، لا "شقق وفيلات" لحي كله محلات)
const TYPE_PLURAL: Record<string, string> = {
  "شقة": "شقق",
  "شقة فاخرة": "شقق",
  "دوبلكس": "دوبلكس",
  "بنتهاوس": "بنتهاوس",
  "روف": "روف",
  "فيلا منفصلة": "فيلات",
  "تاون هاوس": "تاون هاوس",
  "توين هاوس": "توين هاوس",
  "شاليه": "شاليهات",
  "محل تجاري": "محلات",
  "مقر إداري": "مقرات إدارية",
  "مكتب": "مكاتب",
  "عيادة": "عيادات",
  "أرض": "أراضي",
};

const BRAND_SUFFIX = " | التيسير للعقارات";

// عنوان صفحة الحي من المعروض الفعلي: أكثر نوعين عدداً + "للبيع في" + الحي والمدينة (صيغة ما يكتبه الباحث)
export function buildDistrictTitle(districtName: string, cityName: string, stats: DistrictStats | null): string {
  if (!stats) return `عقارات ${districtName} - ${cityName}`;
  const labels: string[] = [];
  for (const { type } of stats.typeCounts) {
    const label = TYPE_PLURAL[type];
    if (label && !labels.includes(label)) labels.push(label);
    if (labels.length === 2) break;
  }
  const what = labels.length ? labels.join(" و") : "عقارات";
  const title = `${what} للبيع في ${districtName} ${cityName}`;
  return title.length + BRAND_SUFFIX.length <= 70 ? title + BRAND_SUFFIX : title;
}

export function computeDistrictStats(available: Property[]): DistrictStats | null {
  if (available.length === 0) return null;
  const prices = available.map((p) => p.price).filter((n) => n > 0);

  const groups: SqmGroup[] = [];
  for (const [label, types] of [
    ["الوحدات السكنية", RESIDENTIAL],
    ["الوحدات التجارية والإدارية", COMMERCIAL],
    ["الأراضي", LAND],
  ] as const) {
    const r = averagePerSqm(available.filter((p) => (types as readonly string[]).includes(p.type)));
    if (r) groups.push({ label, avg: r.avg, count: r.count });
  }

  const counts = new Map<string, number>();
  for (const p of available) counts.set(p.type, (counts.get(p.type) || 0) + 1);

  const installments = available.filter(hasInstallment);
  const downs = installments
    .map((p) => p.payment?.downPayment || 0)
    .filter((n) => n > 0);

  return {
    count: available.length,
    minPrice: prices.length ? Math.min(...prices) : 0,
    maxPrice: prices.length ? Math.max(...prices) : 0,
    avgPerSqm: averagePerSqm(available)?.avg ?? null,
    types: Array.from(counts.keys()),
    sqmGroups: groups,
    typeCounts: Array.from(counts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count),
    installmentCount: installments.length,
    minDownPayment: downs.length ? Math.min(...downs) : null,
    readyCount: available.filter((p) => p.status === "جاهز").length,
    underConstructionCount: available.filter((p) => p.status === "تحت الإنشاء").length,
    asOf: new Date().toISOString().slice(0, 10),
  };
}

export function buildDistrictFaq(
  districtName: string,
  cityName: string,
  stats: DistrictStats | null,
  editorial: DistrictEditorial | null
): FaqItem[] {
  const items: FaqItem[] = [];
  const place = `${districtName} ب${cityName}`;

  if (stats) {
    const asOf = formatArabicDate(stats.asOf);

    // صياغة "العدد: ن" بدل تمييز العدد (عقاران/عقارات/عقاراً) — صحيحة نحوياً مع أي رقم
    if (stats.sqmGroups.length > 0) {
      const parts = stats.sqmGroups.map(
        (g) => `${g.label}: ${formatNumber(g.avg)} جنيه للمتر (عدد الوحدات: ${g.count})`
      );
      items.push({
        question: `كم سعر المتر في ${place}؟`,
        answer: `متوسط سعر المتر في ${place} حسب المعروض حالياً — ${parts.join("، ")}. الأرقام محسوبة من العقارات المعروضة للبيع على التيسير للعقارات بتاريخ ${asOf} وتتغير مع تغير المعروض.`,
      });
    }

    if (stats.minPrice > 0) {
      const types = stats.typeCounts.map((t) => `${t.type} (${t.count})`).join("، ");
      const range =
        stats.minPrice === stats.maxPrice
          ? `السعر ${formatNumber(stats.minPrice)} جنيه`
          : `الأسعار تبدأ من ${formatNumber(stats.minPrice)} جنيه وتصل إلى ${formatNumber(stats.maxPrice)} جنيه`;
      items.push({
        question: `ما أسعار العقارات المعروضة للبيع في ${districtName}؟`,
        answer: `عدد العقارات المعروضة للبيع الآن في ${place}: ${stats.count}. ${range}. الأنواع المتاحة: ${types}. (تحديث ${asOf})`,
      });
    }

    items.push({
      question: `هل توجد عقارات بالتقسيط في ${districtName}؟`,
      answer:
        stats.installmentCount > 0
          ? `نعم، عدد العقارات المتاحة بالتقسيط الآن في ${districtName}: ${stats.installmentCount} من أصل ${stats.count}${
              stats.minDownPayment ? `، وأقل مقدم مطلوب ${formatNumber(stats.minDownPayment)} جنيه` : ""
            }. تفاصيل المقدم والقسط مكتوبة في صفحة كل عقار.`
          : `العقارات المعروضة حالياً في ${districtName} بنظام الدفع الكاش. كل الوحدات المتاحة بالتقسيط في ${cityName} مجمّعة في صفحة "عقارات بالتقسيط" على الموقع.`,
    });

    if (stats.readyCount + stats.underConstructionCount > 0) {
      items.push({
        question: `هل عقارات ${districtName} جاهزة للاستلام؟`,
        answer: `من أصل ${stats.count} معروضة الآن في ${districtName}: جاهز للاستلام ${stats.readyCount}، وتحت الإنشاء ${stats.underConstructionCount}. حالة كل عقار موضحة في صفحته.`,
      });
    }
  }

  if (editorial?.bestFor?.length) {
    items.push({
      question: `لمن يناسب السكن أو الاستثمار في ${districtName}؟`,
      answer: `${districtName} يناسب: ${editorial.bestFor.join("، ")}.`,
    });
  }

  return items;
}
