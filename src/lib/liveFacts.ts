// lib/liveFacts.ts
// حقائق وأسئلة شائعة محسوبة من المعروض الفعلي للرئيسية وصفحات المدن والفئات.
// كانت الإجابات أرقاماً ثابتة ("الشقق من 500,000 جنيه"، "سعر المتر 5,000–20,000") لا تطابق أي إعلان على الموقع،
// فكان محرك الإجابة يقرأ رقماً في السؤال الشائع ونقيضه في قائمة العقارات بنفس الصفحة.
// القاعدة: أي رقم سعر يُكتب من البيانات، ولا يُنشر متوسط من أقل من MIN_POINTS وحدات.

import type { Property } from "./types";
import type { FaqItem } from "./homeFaq";
import { formatNumber, pricePerSqm, hasInstallment } from "./propertySummary";
import { formatArabicDate } from "./blogPosts";

export const MIN_POINTS = 3;

export const TYPE_GROUPS = {
  apartments: { label: "الشقق", types: ["شقة", "شقة فاخرة", "دوبلكس", "بنتهاوس", "روف"] },
  villas: { label: "الفيلات", types: ["فيلا منفصلة", "تاون هاوس", "توين هاوس"] },
  residential: {
    label: "الوحدات السكنية",
    types: ["شقة", "شقة فاخرة", "دوبلكس", "بنتهاوس", "روف", "فيلا منفصلة", "تاون هاوس", "توين هاوس", "شاليه"],
  },
  commercial: { label: "الوحدات التجارية والإدارية", types: ["محل تجاري", "مقر إداري", "مكتب", "عيادة"] },
  shops: { label: "المحلات والمقرات الإدارية", types: ["محل تجاري", "مقر إداري", "مكتب"] },
  clinics: { label: "العيادات", types: ["عيادة"] },
  lands: { label: "الأراضي", types: ["أرض"] },
  chalets: { label: "الشاليهات", types: ["شاليه"] },
} as const;

export type TypeGroupKey = keyof typeof TYPE_GROUPS;

export interface GroupFacts {
  count: number;
  minPrice: number;
  maxPrice: number;
  sqm: { avg: number; min: number; max: number; count: number } | null;
}

export function groupFacts(list: Property[]): GroupFacts {
  const prices = list.map((p) => p.price).filter((n) => n > 0);
  const sqm = list.map(pricePerSqm).filter((n): n is number => n !== null);
  return {
    count: list.length,
    minPrice: prices.length ? Math.min(...prices) : 0,
    maxPrice: prices.length ? Math.max(...prices) : 0,
    sqm: sqm.length
      ? {
          avg: Math.round(sqm.reduce((a, b) => a + b, 0) / sqm.length),
          min: Math.min(...sqm),
          max: Math.max(...sqm),
          count: sqm.length,
        }
      : null,
  };
}

const CITY_NAMES: Record<string, string> = {
  "new-damietta": "دمياط الجديدة",
  "new-mansoura": "المنصورة الجديدة",
};

export interface CityFacts {
  id: string;
  name: string;
  asOf: string;
  all: GroupFacts;
  groups: Record<TypeGroupKey, GroupFacts>;
  typeCounts: Array<{ type: string; count: number }>;
  installmentCount: number;
  minDownPayment: number | null;
  maxInstallmentYears: number | null;
}

export function available(all: Property[]): Property[] {
  return all.filter((p) => p.status !== "تم البيع");
}

export function inCity(list: Property[], cityId: string): Property[] {
  return list.filter((p) => (p.location?.cityId || "new-damietta") === cityId);
}

export function inGroup(list: Property[], key: TypeGroupKey): Property[] {
  const types = TYPE_GROUPS[key].types as readonly string[];
  return list.filter((p) => types.includes(p.type));
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function buildCityFacts(all: Property[], cityId: string): CityFacts {
  const list = inCity(available(all), cityId);
  const counts = new Map<string, number>();
  for (const p of list) counts.set(p.type, (counts.get(p.type) || 0) + 1);
  const inst = list.filter(hasInstallment);
  const downs = inst.map((p) => p.payment?.downPayment || 0).filter((n) => n > 0);
  const years = inst.map((p) => p.payment?.installmentYears || 0).filter((n) => n > 0);

  const groups = {} as Record<TypeGroupKey, GroupFacts>;
  (Object.keys(TYPE_GROUPS) as TypeGroupKey[]).forEach((k) => {
    groups[k] = groupFacts(inGroup(list, k));
  });

  return {
    id: cityId,
    name: CITY_NAMES[cityId] || cityId,
    asOf: today(),
    all: groupFacts(list),
    groups,
    typeCounts: Array.from(counts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count),
    installmentCount: inst.length,
    minDownPayment: downs.length ? Math.min(...downs) : null,
    maxInstallmentYears: years.length ? Math.max(...years) : null,
  };
}

// ===== جُمل جاهزة — كلها بصيغة "العدد: ن" لتصح نحوياً مع أي رقم =====

function priceRange(g: GroupFacts): string {
  if (!g.minPrice) return "";
  return g.minPrice === g.maxPrice
    ? `السعر ${formatNumber(g.minPrice)} جنيه`
    : `الأسعار بين ${formatNumber(g.minPrice)} و${formatNumber(g.maxPrice)} جنيه`;
}

const SOURCE = "بحسب المعروض الآن على التيسير للعقارات";

export function inventorySentence(c: CityFacts): string {
  if (c.all.count === 0) {
    return `لا توجد حالياً عقارات معروضة للبيع في ${c.name} على التيسير للعقارات؛ المعروض يتغير باستمرار.`;
  }
  const types = c.typeCounts.map((t) => `${t.type} (${t.count})`).join("، ");
  return `عدد العقارات المعروضة للبيع الآن في ${c.name} على التيسير للعقارات: ${c.all.count}. ${priceRange(c.all)}. الأنواع: ${types}.`;
}

// إجابة "كم أسعار كذا في المدينة": رقم من البيانات إن كفت، وإلا تصريح بعدم كفايتها + المعروض الفعلي
export function groupPriceAnswer(c: CityFacts, key: TypeGroupKey): string {
  const g = c.groups[key];
  const label = TYPE_GROUPS[key].label;
  const date = formatArabicDate(c.asOf);
  if (g.count >= MIN_POINTS) {
    let s = `${SOURCE} في ${c.name} (عدد ${label}: ${g.count})، ${priceRange(g)}`;
    if (g.sqm && g.sqm.count >= MIN_POINTS) s += `، ومتوسط سعر المتر ${formatNumber(g.sqm.avg)} جنيه`;
    s += `. السعر يختلف حسب الحي والمساحة والتشطيب، وهذه أسعار طلب تتغير مع المعروض (تحديث ${date}).`;
    return s;
  }
  return `عدد ${label} المعروضة حالياً في ${c.name} على التيسير للعقارات (${g.count}) لا يكفي لحساب نطاق سعري موثوق. ${inventorySentence(c)} (تحديث ${date})`;
}

export function sqmAnswer(c: CityFacts): string {
  const date = formatArabicDate(c.asOf);
  const parts: string[] = [];
  const thin: string[] = [];
  for (const key of ["residential", "commercial", "lands"] as const) {
    const g = c.groups[key];
    const label = TYPE_GROUPS[key].label;
    if (g.sqm && g.sqm.count >= MIN_POINTS) {
      parts.push(
        `${label}: ${formatNumber(g.sqm.avg)} جنيه للمتر في المتوسط (بين ${formatNumber(g.sqm.min)} و${formatNumber(g.sqm.max)}، عدد الوحدات: ${g.sqm.count})`
      );
    } else if (key !== "lands") {
      thin.push(label);
    }
  }
  if (parts.length === 0) {
    return `لا يتوفر حالياً عدد كافٍ من العقارات المعروضة في ${c.name} لحساب متوسط موثوق لسعر المتر. ${inventorySentence(c)} (تحديث ${date})`;
  }
  let s = `${SOURCE} في ${c.name} — ${parts.join("؛ ")}.`;
  if (thin.length) s += ` لا يتوفر عدد كافٍ من ${thin.join(" و")} المعروضة لحساب متوسط لها.`;
  s += ` سعر المتر يختلف حسب الحي والدور والتشطيب، وهذه أسعار طلب (تحديث ${date}).`;
  return s;
}

export function installmentAnswer(c: CityFacts): string {
  const date = formatArabicDate(c.asOf);
  if (c.installmentCount === 0) {
    return `العقارات المعروضة حالياً في ${c.name} على التيسير للعقارات بنظام الدفع الكاش. المعروض يتغير باستمرار، وصفحة "عقارات بالتقسيط" تجمع كل الوحدات المتاحة بالتقسيط وقت توفرها. (تحديث ${date})`;
  }
  let s = `نعم. عدد العقارات المتاحة بالتقسيط الآن في ${c.name} على التيسير للعقارات: ${c.installmentCount} من أصل ${c.all.count}`;
  if (c.minDownPayment) s += `، وأقل مقدم مطلوب ${formatNumber(c.minDownPayment)} جنيه`;
  if (c.maxInstallmentYears) s += `، وأطول مدة سداد معروضة (بالسنوات): ${c.maxInstallmentYears}`;
  s += `. المقدم والقسط ومدة السداد يحددها مالك كل وحدة ومكتوبة في صفحة العقار. (تحديث ${date})`;
  return s;
}

const NO_PROMISE =
  "لا يوجد عائد مضمون في العقار: العائد يتوقف على الموقع وسعر الشراء وتوقيت البيع واكتمال الخدمات حول الوحدة، والتيسير للعقارات لا تعد بنسبة ربح محددة.";

// ===== الرئيسية =====
export function buildHomeFaq(all: Property[]): FaqItem[] {
  const nd = buildCityFacts(all, "new-damietta");
  const nm = buildCityFacts(all, "new-mansoura");
  return [
    { question: "ما هي أسعار الشقق في دمياط الجديدة 2026؟", answer: groupPriceAnswer(nd, "apartments") },
    { question: "كم سعر المتر في دمياط الجديدة 2026؟", answer: sqmAnswer(nd) },
    {
      question: "ما هي أفضل الأحياء للسكن في دمياط الجديدة؟",
      answer:
        "يتوقف الاختيار على الميزانية والأولويات: الحي الأول والثاني للخدمات المكتملة والموقع المركزي، الحي الثالث للهدوء والقرب من الخدمات، الحي السادس (المتميز) للوحدات الأعلى مستوى، ومشاريع جنة ودار مصر وسكن مصر لمن يفضل مشروعاً حكومياً بتصميم موحد. لكل حي صفحة على الموقع تعرض معروضه الحالي ومتوسط سعر المتر فيه.",
    },
    { question: "هل يوجد تقسيط للعقارات في دمياط الجديدة؟", answer: installmentAnswer(nd) },
    { question: "ما هي أسعار الشقق في المنصورة الجديدة 2026؟", answer: groupPriceAnswer(nm, "apartments") },
    {
      question: "ما الفرق بين دمياط الجديدة والمنصورة الجديدة؟",
      answer:
        "دمياط الجديدة مدينة قائمة مكتملة البنية التحتية والخدمات على ساحل البحر المتوسط بمحافظة دمياط، وأغلب وحداتها جاهزة للسكن. المنصورة الجديدة مدينة جيل رابع بمحافظة الدقهلية ما زالت قيد التطوير وتُسلَّم مناطقها على مراحل. الأولى أنسب للسكن الفوري، والثانية يقصدها من يشتري بأفق زمني أطول.",
    },
    { question: "كم سعر المتر في المنصورة الجديدة 2026؟", answer: sqmAnswer(nm) },
    {
      question: "هل الاستثمار في المنصورة الجديدة مربح؟",
      answer: `المنصورة الجديدة مدينة جيل رابع ما زالت قيد التطوير، ولذلك يقصدها المشترون بأفق استثماري طويل. ${NO_PROMISE} ${inventorySentence(nm)}`,
    },
  ];
}

// ===== صفحات المدن =====
export function buildCityFaq(all: Property[], cityId: string): FaqItem[] {
  const c = buildCityFacts(all, cityId);
  if (cityId === "new-mansoura") {
    return [
      {
        question: "ما هي مناطق R1 إلى R7 في المنصورة الجديدة؟",
        answer:
          "مناطق R1 إلى R7 هي الأحياء السكنية الرئيسية في مخطط المنصورة الجديدة، وتضم وحدات سكنية متنوعة. R1 وR2 وR3 هي الأسبق في التنفيذ والتسليم، وباقي المناطق تُنفَّذ على مراحل.",
      },
      { question: "ما أسعار العقارات المعروضة الآن في المنصورة الجديدة؟", answer: `${inventorySentence(c)} (تحديث ${formatArabicDate(c.asOf)})` },
      { question: "كم سعر المتر في المنصورة الجديدة؟", answer: sqmAnswer(c) },
      { question: "هل يوجد تقسيط في المنصورة الجديدة؟", answer: installmentAnswer(c) },
      {
        question: "هل المنصورة الجديدة تستحق الاستثمار؟",
        answer: `المنصورة الجديدة مدينة جيل رابع قيد التطوير على ساحل البحر المتوسط، ويقصدها من يشتري بأفق زمني طويل مع اكتمال مراحلها. ${NO_PROMISE}`,
      },
      {
        question: "كم تبعد المنصورة الجديدة عن مدينة المنصورة؟",
        answer:
          "تبعد المنصورة الجديدة نحو 54 كم عن مدينة المنصورة، وتقع على ساحل البحر المتوسط بمحافظة الدقهلية بجوار مدينة جمصة، ويُوصَل إليها عبر الطريق الدولي الساحلي.",
      },
    ];
  }
  return [
    {
      question: "كم عدد الأحياء في دمياط الجديدة؟",
      answer:
        "تضم دمياط الجديدة 6 أحياء سكنية رئيسية (من الأول إلى السادس المتميز)، إضافة إلى مشاريع الإسكان القومي مثل جنة ودار مصر وسكن مصر وبيت الوطن، والمناطق المركزية ومنطقة الشاليهات. لكل منطقة صفحة على الموقع بمعروضها الحالي.",
    },
    { question: "ما هو سعر الشقة في دمياط الجديدة 2026؟", answer: groupPriceAnswer(c, "apartments") },
    { question: "كم سعر المتر في دمياط الجديدة؟", answer: sqmAnswer(c) },
    {
      question: "هل دمياط الجديدة مدينة مكتملة الخدمات؟",
      answer:
        "نعم، دمياط الجديدة مدينة قائمة مكتملة البنية التحتية: بها مدارس وجامعة ومستشفيات ومراكز تسوق وحدائق ومرافق رياضية، وتقع على ساحل البحر المتوسط بمحافظة دمياط.",
    },
    { question: "هل يوجد عقارات بالتقسيط في دمياط الجديدة؟", answer: installmentAnswer(c) },
  ];
}

// ===== صفحات الفئات (شقق / فيلات / محلات ...) =====
export function buildCategorySummary(all: Property[], key: TypeGroupKey): string {
  const label = TYPE_GROUPS[key].label;
  const list = inGroup(available(all), key);
  const date = formatArabicDate(today());
  if (list.length === 0) {
    return `لا يوجد حالياً معروض من فئة «${label}» للبيع على التيسير للعقارات في دمياط الجديدة أو المنصورة الجديدة. المعروض يتغير باستمرار — تواصل معنا على 01500775974 لنبلغك عند توفر ما يناسبك. (تحديث ${date})`;
  }
  const bits: string[] = [];
  for (const cityId of ["new-damietta", "new-mansoura"]) {
    const g = groupFacts(inCity(list, cityId));
    if (g.count === 0) continue;
    let b = `${g.count} في ${CITY_NAMES[cityId]} (${priceRange(g)}`;
    if (g.sqm && g.sqm.count >= MIN_POINTS) b += `، متوسط سعر المتر ${formatNumber(g.sqm.avg)} جنيه`;
    b += ")";
    bits.push(b);
  }
  return `عدد ${label} المعروضة للبيع الآن على التيسير للعقارات: ${list.length} — ${bits.join("، و")}. الأرقام أسعار طلب محسوبة من المعروض الفعلي بتاريخ ${date}.`;
}

// وصف الصفحة (meta description) للفئة — من نفس الأرقام
export function buildCategoryDescription(all: Property[], key: TypeGroupKey, lead: string): string {
  const list = inGroup(available(all), key);
  if (list.length === 0) return `${lead} تابع المعروض المحدّث على التيسير للعقارات.`;
  const g = groupFacts(list);
  return `${lead} المعروض الآن: ${list.length}، ${priceRange(g)}. أسعار ومواصفات كل وحدة وطريقة الدفع على التيسير للعقارات.`;
}
