// src/lib/answers/local.ts
// أسئلة ونصوص عقارات دمياط الجديدة والمنصورة الجديدة (الرئيسية، الأسعار، المدينتان، التقسيط، الأحياء،
// المقالات). كل سؤال على صفحته المالكة فقط (faq-owners.json)؛ الأرقام محسوبة من
// الإعلانات النشطة وقت الطلب، وكل رقم آخر بمصدر وتاريخ. مكوّنات الخادم فقط — لا يُستورد من "use client".
// قواعد النص: لا وعد بعائد أو نمو سعري، ولا «مضمون»، ولا تفضيل مطلق («الأفضل») بلا معيار، ولا رقم بلا مصدر.

import type { Answer, PageData } from "./types";
import {
  AREA_BOUNDS,
  GROUP_LABEL,
  GROUP_ORDER,
  median,
  MIN_N,
  PPM_BOUNDS,
  type PriceRow,
  type PriceStats,
  type TypeGroup,
} from "../seo/prices";
import { apartments, asOf, count, districtsIn, fmtN, plots, years } from "./format";
import { cairoDate } from "../seo/time";
import { wordCount } from "../seo/lint";
import { BOOKLET_LONG } from "./resale";

type CitySlug = "new-damietta" | "new-mansoura";
const CITY_AR: Record<CitySlug, string> = { "new-damietta": "دمياط الجديدة", "new-mansoura": "المنصورة الجديدة" };
const cityAr = (c: string): string => CITY_AR[c as CitySlug] || "دمياط الجديدة";
/** «بدمياط الجديدة» / «بالمنصورة الجديدة» */
const inCity = (c: string): string => (c === "new-mansoura" ? "بالمنصورة الجديدة" : "بدمياط الجديدة");

const PRICES_SOURCE = "إعلانات البيع النشطة على eltaiseer.com (وسيط لكل حي ونوع عقار، 3 عقارات على الأقل)";
const join = (...xs: (string | false | null | undefined)[]) => xs.filter(Boolean).join(" ");

// ── المعدودات (أرقام لاتينية؛ التمييز حسب العدد) ─────────────────────────────
/** مبتدأ مؤخر في المقدمات: «عقار واحد، عقاران، 5 عقارات، 12 عقارًا» */
export const properties = (n: number) => count(n, { one: "عقار واحد", two: "عقاران", few: "عقارات", many: "عقارًا" });
const areas = (n: number) => count(n, { one: "منطقة واحدة", two: "منطقتين", few: "مناطق", many: "منطقة" });
const villas = (n: number) => count(n, { one: "فيلا واحدة", two: "فيلتين", few: "فيلات", many: "فيلا" });
const units = (n: number) => count(n, { one: "وحدة واحدة", two: "وحدتين", few: "وحدات", many: "وحدة" });
const chalets = (n: number) => count(n, { one: "شاليه واحد", two: "شاليهين", few: "شاليهات", many: "شاليهًا" });
const GROUP_COUNT: Record<TypeGroup, (n: number) => string> = {
  apartment: apartments,
  land: plots,
  villa: villas,
  commercial: units,
  chalet: chalets,
};
/** اسم المجموعة بعد «سعر متر»: «الشقق، الأراضي، الفيلات…» */
const GROUP_DEF: Record<TypeGroup, string> = {
  apartment: "الشقق",
  land: "الأراضي",
  villa: "الفيلات",
  commercial: "المحلات والمقرات والعيادات",
  chalet: "الشاليهات",
};

// ── أسعار المدينة (/prices/) ─────────────────────────────────────────────────
function cityApartments(city: CitySlug) {
  return (d: PageData): string | null => {
    const s = d.prices;
    if (!s) return null;
    const g = s.cityGroup[city]?.apartment;
    if (!g || g.medianPpm === null || g.medianPrice === null) {
      return `عدد الشقق المعروضة في ${CITY_AR[city]} الآن أقل من 3، فلا نحسب لها وسيطًا.`;
    }
    const p1 = join(
      `وسيط سعر الشقة المعروضة للبيع على التيسير في ${CITY_AR[city]} ${fmtN(g.medianPrice)} جنيه، ووسيط سعر المتر ${fmtN(g.medianPpm)} جنيه، من ${apartments(g.n)} معروضة`,
      asOf(s.dataModified)
    ) + ". هذه أسعار طلب وليست أسعار بيع منفذة.";
    const rows = s.rows.filter((r) => r.cityId === city && r.group === "apartment");
    if (rows.length < 2) return p1; // جملة النطاق تحتاج حيين على الأقل
    const ppm = rows.map((r) => r.medianPpm);
    return `${p1}\n\nفي ${districtsIn(rows.length)} فيها 3 شقق معروضة على الأقل يتراوح وسيط سعر المتر من ${fmtN(Math.min(...ppm))} إلى ${fmtN(Math.max(...ppm))} جنيه.`;
  };
}

function cityLand(city: CitySlug) {
  return (d: PageData): string | null => {
    const s = d.prices;
    if (!s) return null;
    const g = s.cityGroup[city]?.land;
    if (!g || g.medianPpm === null) {
      return `عدد الأراضي المعروضة في ${CITY_AR[city]} الآن أقل من 3، فلا نحسب لها وسيطًا.`;
    }
    const p1 = join(
      `وسيط سعر متر الأراضي المعروضة للبيع على التيسير في ${CITY_AR[city]} ${fmtN(g.medianPpm)} جنيه، من ${plots(g.n)} معروضة`,
      asOf(s.dataModified)
    ) + ". هذه أسعار طلب وليست أسعار بيع منفذة.";
    const rows = s.rows.filter((r) => r.cityId === city && r.group === "land");
    return rows.length === 0 ? `${p1}\n\nعدد الأراضي المعروضة الآن في كل حي أقل من 3، فلا نحسب وسيطًا لكل حي.` : p1;
  };
}

function cityInstallments(city: CitySlug) {
  return (d: PageData): string | null => {
    const f = d.installments?.[city];
    if (!f) return null;
    if (f.k === 0) {
      return `لا توجد شقق بالتقسيط معروضة في ${CITY_AR[city]} الآن؛ هذه الصفحة تتحدث تلقائيًا عند إضافة عقار بالتقسيط.`;
    }
    const parts = [`نعم. من الشقق المعروضة الآن على التيسير في ${CITY_AR[city]} ${f.k === 1 ? "شقة واحدة تقبل" : f.k === 2 ? "شقتان تقبلان" : `${apartments(f.k)} تقبل`} التقسيط`];
    if (f.maxYears) parts.push(`وأطول مدة يعرضها البائعون ${years(f.maxYears)}`);
    if (f.minDown) parts.push(`وأقل مقدم معلن ${fmtN(f.minDown)} جنيه`);
    const date = asOf(d.dataModified);
    return `${parts.join("، ")}${date ? ` (${date})` : ""}. شروط التقسيط يحددها كل بائع وتظهر في صفحة العقار.`;
  };
}

// ── مشروعات الإسكان القومي في دمياط الجديدة (Q171 على /prices/#national-housing) ─────
export const ND_PROJECTS = [
  "مشروع جنة",
  "دار مصر - موقع 1",
  "دار مصر - موقع 2",
  "سكن مصر - جنوب الحي الأول",
  "سكن مصر - غرب الجامعات",
];

function ndProjects(d: PageData): string | null {
  const s = d.prices;
  if (!s) return null;
  const rows = ND_PROJECTS.map((name) =>
    s.rows.find((r) => r.cityId === "new-damietta" && r.district === name && r.group === "apartment")
  ).filter((r): r is PriceRow => !!r);
  const date = asOf(s.dataModified);
  if (rows.length === 0) {
    return `عدد الشقق المعروضة الآن على التيسير في كل مشروع من مشروعات جنة ودار مصر وسكن مصر بدمياط الجديدة أقل من 3، فلا نحسب لها وسيطًا${date ? ` (${date})` : ""}. العروض الحالية في صفحة كل مشروع.`;
  }
  const parts = rows.map((r) => `${r.district} ${fmtN(r.medianPpm)} جنيه (من ${apartments(r.n)})`);
  const missing = ND_PROJECTS.length - rows.length;
  return join(
    `وسيط سعر متر الشقق المعروضة للبيع على التيسير في مشروعات الإسكان القومي بدمياط الجديدة: ${parts.join("، و")}${date ? `، ${date}` : ""}.`,
    missing > 0 ? "وباقي المشروعات فيها أقل من 3 شقق معروضة، فلا نحسب لها وسيطًا." : "",
    "هذه أسعار طلب وليست أسعار بيع منفذة."
  );
}

/** كل فئات مناطق دمياط الجديدة في نص Q169 — يتحقق منها test:seo مقابل egyptPlaces */
export const ND_DISTRICTS_SENTENCE_PARTS = [
  "الأحياء من الأول إلى السادس",
  "جنة",
  "دار مصر",
  "سكن مصر",
  "بيت الوطن",
  "المنطقة المركزية",
  "شمال الجامعة",
  "المنطقة الصناعية",
  "منطقة الشاليهات",
];

export const LOCAL: Answer[] = [
  // ── /prices/ (Q165, Q166, Q175, Q176 + M-PR) ─────────────────────────────
  {
    id: "Q166",
    q: "كم أسعار الشقق في دمياط الجديدة الآن؟",
    a: cityApartments("new-damietta"),
    sources: [PRICES_SOURCE],
    status: "verified",
    owner: "/prices/",
    anchor: "new-damietta-apartments",
  },
  {
    id: "Q165",
    q: "كم سعر متر الأرض في دمياط الجديدة؟",
    a: cityLand("new-damietta"),
    sources: [PRICES_SOURCE],
    status: "verified",
    owner: "/prices/",
    anchor: "new-damietta-land",
  },
  {
    id: "Q176",
    q: "كم أسعار الشقق في المنصورة الجديدة الآن؟",
    a: cityApartments("new-mansoura"),
    sources: [PRICES_SOURCE],
    status: "verified",
    owner: "/prices/",
    anchor: "new-mansoura-apartments",
  },
  {
    id: "Q175",
    q: "كم سعر متر الأرض في المنصورة الجديدة؟",
    a: cityLand("new-mansoura"),
    sources: [PRICES_SOURCE],
    status: "verified",
    owner: "/prices/",
    anchor: "new-mansoura-land",
  },
  {
    id: "M-PR-01",
    q: "كيف نحسب هذه الأسعار؟",
    a: () =>
      "نأخذ كل إعلان بيع نشط على التيسير، ونحسب سعر المتر (السعر ÷ المساحة) لكل نوع عقار على حدة، ونستبعد القيم خارج النطاق المنطقي لكل نوع، ثم نعرض الوسيط لا المتوسط حتى لا يرفعه إعلان واحد شاذ، ولا نعرض أي خانة من أقل من 3 عقارات. «آخر تحديث» هو تاريخ آخر تغيير في الإعلانات، لا تاريخ فتح الصفحة.",
    sources: [],
    status: "verified",
    owner: "/prices/",
    anchor: "method",
  },
  {
    id: "M-PR-02",
    q: "لماذا يختلف سعر المتر من حي لآخر؟",
    a: () =>
      "يختلف سعر المتر بالموقع والقرب من البحر والخدمات، وعمر المبنى والتشطيب، والدور والمساحة. قارن وسيط سعر المتر لكل حي في الجداول أعلاه.",
    sources: [],
    status: "verified",
    owner: "/prices/",
  },
  {
    id: "M-PR-03",
    q: "هل الأسعار قابلة للتفاوض؟",
    a: () =>
      "السعر المعروض سعر طلب يحدده البائع، والتفاوض يتم بين الطرفين. ننشر سعر الطلب كما هو، ولا ننشر أسعار البيع المنفذة.",
    sources: [],
    status: "verified",
    owner: "/prices/",
    faq: false,
  },

  // ── /new-damietta/ (Q169, Q170, Q183 + M-ND) ──────────────────────────────
  {
    id: "Q169",
    q: "ما هي أحياء دمياط الجديدة؟",
    a: (d) =>
      d.ndDistrictCount
        ? `تنقسم عقارات دمياط الجديدة على التيسير إلى ${areas(d.ndDistrictCount)}: الأحياء من الأول إلى السادس، ومشروعات الإسكان القومي (جنة، ودار مصر موقعا 1 و2، وسكن مصر جنوب الحي الأول وغرب الجامعات)، ومناطق بيت الوطن (شرق وغرب وامتداد الشاطئ)، والمنطقة المركزية أ وب وج، وشمال الجامعة، والمنطقة الصناعية، ومنطقة الشاليهات.`
        : null,
    sources: [],
    status: "verified",
    owner: "/new-damietta/",
    anchor: "districts",
  },
  {
    // haversine Q12211943 P625[0] (31.4368, 31.667) ↔ Q189383 (31.41667, 31.82139) = 14.8 km, Wikidata fetched 2026-09-29
    id: "Q170",
    q: "أين تقع دمياط الجديدة؟",
    a: () =>
      "تقع دمياط الجديدة على ساحل البحر المتوسط غرب مدينة دمياط بنحو 15 كم خطًا مستقيمًا (حسب إحداثيات Wikidata، حساب 29/9/2026)، وتتبع محافظة دمياط.",
    sources: ["Wikidata: دمياط الجديدة (Q12211943) ومدينة دمياط (Q189383)، الإحداثيات P625، جُلبت 29/9/2026"],
    status: "verified",
    owner: "/new-damietta/",
    anchor: "map",
  },
  {
    // [VERIFY] Appendix 2: عنوان الجهاز يحتاج مصدرًا رسميًا مسجلًا — لا يُعرض قبله
    id: "Q183",
    q: "أين يقع جهاز تعمير دمياط الجديدة؟",
    a: () => null,
    sources: [],
    status: "pending",
    owner: "/new-damietta/",
    anchor: "services",
  },
  {
    id: "M-ND-01",
    q: "هل دمياط الجديدة مدينة مكتملة الخدمات؟",
    a: () =>
      "أحياء دمياط الجديدة الرئيسية مأهولة وفيها مدارس ومستشفيات ونطاق جامعي وخدمات تجارية، ومستوى اكتمال الخدمات يختلف من حي لآخر؛ راجع صفحة الحي قبل الشراء.",
    sources: [],
    status: "verified",
    owner: "/new-damietta/",
  },

  // ── /new-mansoura/ (Q178, Q179 + M-NM) ────────────────────────────────────
  {
    id: "Q178",
    q: "المنصورة الجديدة تتبع أي محافظة؟",
    a: () =>
      "تتبع المنصورة الجديدة محافظة الدقهلية، وهي من مدن الجيل الرابع وتطل على البحر المتوسط بطول نحو 15 كم.",
    sources: [
      "Wikidata: المنصورة الجديدة (Q63122627)، المحافظة P131 = الدقهلية (Q31068)، جُلبت 29/9/2026",
      "وصف هيئة المجتمعات العمرانية للمدينة (لقطة شجرة المشروعات 21/9/2026)",
    ],
    status: "verified",
    owner: "/new-mansoura/",
    anchor: "governorate",
  },
  {
    id: "Q179",
    q: "هل المنصورة الجديدة على البحر؟",
    a: () => "نعم، تطل المنصورة الجديدة على البحر المتوسط بطول نحو 15 كم (وصف هيئة المجتمعات العمرانية للمدينة).",
    sources: ["وصف هيئة المجتمعات العمرانية للمدينة (لقطة شجرة المشروعات 21/9/2026)"],
    status: "verified",
    owner: "/new-mansoura/",
    anchor: "sea",
  },
  {
    // haversine Q223587 (31.05, 31.38333) ↔ Q63122627 (31.47969, 31.43267) = 48.0 km, Wikidata P625 fetched 2026-09-29
    id: "M-NM-01",
    q: "كم تبعد المنصورة الجديدة عن المنصورة؟",
    a: () =>
      "المسافة بين مركزي المنصورة والمنصورة الجديدة نحو 48 كم خطًا مستقيمًا حسب إحداثيات Wikidata (حساب 29/9/2026)، ومسافة الطريق أطول وتختلف حسب المسار.",
    sources: ["Wikidata: المنصورة (Q223587) والمنصورة الجديدة (Q63122627)، الإحداثيات P625، جُلبت 29/9/2026"],
    status: "verified",
    owner: "/new-mansoura/",
    anchor: "distance",
  },
  {
    id: "M-NM-02",
    q: "ما هي مناطق R1 إلى R7 في المنصورة الجديدة؟",
    a: () =>
      "مناطق R1 إلى R7 هي الأحياء السكنية المرقّمة في المنصورة الجديدة، ومواعيد التسليم فيها تختلف من حي لآخر. لكل حي منها صفحة على التيسير بعروضه الحالية.\n\nللمقارنة بين المناطق: [أفضل مناطق السكن في المنصورة الجديدة](/blog/new-mansoura-districts/)",
    sources: [],
    status: "verified",
    owner: "/new-mansoura/",
  },
  {
    // «تم تسليم أجزاء من R1–R3» يبقى [VERIFY] حتى مصدر مؤرخ (Appendix 2) — لا يُكتب هنا
    id: "M-NM-03",
    q: "متى يتم تسليم شقق المنصورة الجديدة؟",
    a: () => "التسليم يتم على مراحل حسب كل مشروع؛ راجع جهاز المدينة أو المطور لموعد وحدتك.",
    sources: [],
    status: "verified",
    owner: "/new-mansoura/",
  },

  // ── /properties/installments/ (Q168, Q180) ────────────────────────────────
  {
    id: "Q168",
    q: "هل توجد شقق بالتقسيط في دمياط الجديدة وكم المقدم؟",
    a: cityInstallments("new-damietta"),
    sources: ["حقول التقسيط (المقدم والمدة) في إعلانات الشقق النشطة على eltaiseer.com"],
    status: "verified",
    owner: "/properties/installments/",
    anchor: "new-damietta",
  },
  {
    id: "Q180",
    q: "هل توجد شقق بالتقسيط في المنصورة الجديدة؟",
    a: cityInstallments("new-mansoura"),
    sources: ["حقول التقسيط (المقدم والمدة) في إعلانات الشقق النشطة على eltaiseer.com"],
    status: "verified",
    owner: "/properties/installments/",
    anchor: "new-mansoura",
  },
  {
    id: "M-IN-01",
    q: "هل التقسيط مباشر مع المالك أم عن طريق بنك؟",
    a: () =>
      "شروط التقسيط يحددها كل بائع وتظهر في صفحة العقار: المقدم والقسط والمدة. اسأل البائع إن كان التقسيط مباشرًا معه أو عبر تمويل عقاري، واطلب الشروط مكتوبة قبل الاتفاق.",
    sources: [],
    status: "verified",
    owner: "/properties/installments/",
    faq: false,
  },

  // ── صفحات الأحياء ذات الأسئلة الخاصة ─────────────────────────────────────
  {
    id: "Q163",
    q: "ما هو بيت الوطن في دمياط الجديدة وأين يقع؟",
    a: () =>
      "«بيت الوطن» في دمياط الجديدة اسم ثلاث مناطق سكنية قائمة في المدينة: بيت الوطن - شرق، وبيت الوطن - غرب، وبيت الوطن - امتداد الشاطئ. العقارات المعروضة فيها على التيسير بيع بين أفراد، ولكل منطقة صفحة بعروضها الحالية.\n\nويحمل الاسم أيضًا قطاعان من طرح المرحلة 11 في المدينة (بيت الوطن بالساحل، وبيت الوطن غرب المدينة) وفق كراسة الشروط، وقطعهما تُحجز فقط من موقع هيئة المجتمعات العمرانية لمن سجّل في المرحلة 11 وفق نوافذ المسلسل.",
    sources: [`${BOOKLET_LONG}: أسماء قطاعات المرحلة 11 في دمياط الجديدة`],
    status: "verified",
    // صفحة بيت الوطن - شرق noindex ما دامت بلا عروض: المالك صفحة المدينة (قسم #beit-al-watan)، وصفحات الأحياء الثلاثة رابط إليه
    owner: "/new-damietta/",
    anchor: "beit-al-watan",
  },
  {
    // [VERIFY] Appendix 2: تسمية «غرب حورس» تحتاج مصدرًا (جهاز المدينة أو خريطة موثقة) قبل أي نص
    id: "Q164",
    q: "أين أجد خريطة بيت الوطن دمياط الجديدة (غرب حورس)؟",
    a: () => null,
    sources: [],
    status: "pending",
    owner: "/new-damietta/beit-al-watan-west/",
  },
  {
    id: "Q171",
    q: "كم سعر شقق دار مصر وجنة وسكن مصر في دمياط الجديدة؟",
    a: ndProjects,
    sources: [PRICES_SOURCE],
    status: "verified",
    // صفحات المشروعات noindex ما دامت بلا عروض: المالك /prices/ (جدول الأحياء نفسه)، وصفحات المشروعات رابط إليه
    owner: "/prices/",
    anchor: "national-housing",
  },

  // ── /new-damietta/#lands (Q182) ───────────────────────────────────────────
  {
    // /properties/lands/ noindex ما دامت بلا أراضٍ متاحة: المالك صفحة المدينة، وصفحة الأراضي رابط إليه
    id: "Q182",
    q: "أين أجد أراضي للبيع في دمياط الجديدة؟",
    a: (d) => {
      const n = d.landCounts?.["new-damietta"];
      if (n === undefined) return null;
      const date = asOf(d.dataModified);
      const first =
        n === 0
          ? `لا توجد أراضٍ معروضة للبيع في دمياط الجديدة على التيسير الآن${date ? ` (${date})` : ""}، وتظهر في هذه الصفحة وفي [صفحة الأراضي للبيع](/properties/lands/) عند إضافتها. ووسيط سعر متر الأرض في المدينة حين يتوفر في [صفحة أسعار العقارات](/prices/#new-damietta-land).`
          : `المعروض للبيع من الأراضي في دمياط الجديدة على التيسير: ${landPlots(n)}${date ? ` (${date})` : ""}، تجدها في هذه الصفحة وفي [صفحة الأراضي للبيع](/properties/lands/)، ولكل قطعة صفحة بمساحتها وسعرها وطريقة الدفع. ووسيط سعر متر الأرض في المدينة في [صفحة أسعار العقارات](/prices/#new-damietta-land).`;
      return `${first}\n\nأما أراضي بيت الوطن المخصصة فتُشترى بالتنازل الرسمي في جهاز المدينة، وإعلاناتها الموثّقة في [أراضي بيت الوطن للبيع](/beit-al-watan-for-sale/).`;
    },
    sources: ["إعلانات البيع النشطة على eltaiseer.com"],
    status: "verified",
    owner: "/new-damietta/",
    anchor: "lands",
  },

  // ── المقالات ──────────────────────────────────────────────────────────────
  {
    // [VERIFY] Appendix 2: خطوات الشراء القانونية تنتظر مراجعة محامٍ — لا كتلة إجابة ولا Question قبلها
    id: "Q172",
    q: "ما خطوات شراء شقة في دمياط الجديدة والأوراق المطلوبة؟",
    a: () => null,
    sources: [],
    status: "pending",
    owner: "/blog/buying-steps-legal/",
  },
  {
    id: "Q174",
    q: "دمياط الجديدة أم المنصورة الجديدة: أيهما أنسب للسكن؟",
    a: () =>
      "للسكن الفوري دمياط الجديدة أنسب لأن أحياءها الرئيسية مأهولة؛ والمنصورة الجديدة لمن يقبل استلامًا لاحقًا في مدينة ما زالت تُستكمل.",
    sources: [],
    status: "verified",
    owner: "/blog/damietta-vs-mansoura/",
  },
  {
    // لا مصدر رسمي مؤرخ لموعد الطرح القادم — لا نخمّن موعدًا (Q184 guardrails)
    id: "Q184",
    q: "متى موعد طرح أراضي هيئة المجتمعات العمرانية ووزارة الإسكان القادم؟",
    a: () => null,
    sources: [],
    status: "pending",
    owner: "/blog/national-housing-projects/",
  },
];

/** مجموعة نوع العقار التي تُحسب منها «شقق بالتقسيط» (نفس تعريف الشقق في /prices/) */
export const INSTALLMENT_GROUP: TypeGroup = "apartment";

// ═════════════════════════════════════════════════════════════════════════════
// نصوص الصفحات غير السؤالية: مقدمات (answer-lede) وجمل وصناديق بعناوين خبرية — بلا Question.
// ═════════════════════════════════════════════════════════════════════════════

/** «حتى 29 سبتمبر 2026» → «29 سبتمبر 2026»، أو "" */
const dateOf = (iso?: string | null): string => (iso ? cairoDate(iso) : "");

/** مقدمة الرئيسية (spec-final A2.1) */
export function homeLede(o: { n: number; nD: number; nM: number; dataModified: string | null }): string {
  const date = dateOf(o.dataModified);
  const offer =
    o.n > 0
      ? `المعروض الآن على الموقع ${properties(o.n)} للبيع: ${fmtN(o.nD)} في دمياط الجديدة و${fmtN(o.nM)} في المنصورة الجديدة${date ? `، وآخر تحديث للعروض ${date}` : ""}.`
      : `لا توجد عروض منشورة على الموقع الآن${date ? ` (آخر تحديث ${date})` : ""}.`;
  return `التيسير للعقارات وسيط عقاري في دمياط الجديدة والمنصورة الجديدة. ${offer} ونعرض كذلك إعلانات موثّقة لإعادة بيع أراضي بيت الوطن. التيسير منصة مستقلة غير تابعة لهيئة المجتمعات العمرانية.`;
}

/** جملة «أسعار العروض الحالية باختصار» في الرئيسية (خبرية؛ مالك أسئلة الأسعار /prices/) */
export function homePricesSentence(s: PriceStats): string {
  const part = (c: CitySlug) => {
    const g = s.cityGroup[c]?.apartment;
    return g && g.medianPpm !== null
      ? `${fmtN(g.medianPpm)} جنيه في ${CITY_AR[c]} (من ${apartments(g.n)})`
      : null;
  };
  const d = part("new-damietta");
  const m = part("new-mansoura");
  const date = dateOf(s.dataModified);
  const low = (c: CitySlug) => `عدد الشقق المعروضة في ${CITY_AR[c]} أقل من 3، فلا نحسب لها وسيطًا`;
  if (!d && !m) return `${low("new-damietta")}، و${low("new-mansoura")}${date ? ` (حتى ${date})` : ""}.`;
  const main = [d, m].filter(Boolean).join(" و");
  const tail = !d ? `؛ و${low("new-damietta")}` : !m ? `؛ و${low("new-mansoura")}` : "";
  return `وسيط سعر متر الشقق المعروضة للبيع على التيسير ${main}${tail}${date ? `، حتى ${date}` : ""}. هذه أسعار طلب من البائعين وليست أسعار بيع منفذة.`;
}

/** مقدمة صفحة المدينة (spec-final A2.3 / A2.4) */
export function cityLede(city: string, o: { n: number; k: number; prices: PriceStats | null; dataModified: string | null }): string {
  const date = dateOf(o.dataModified);
  const g = o.prices?.cityGroup[city]?.apartment;
  const hasPpm = !!g && g.medianPpm !== null;
  if (city === "new-mansoura") {
    const head = "المنصورة الجديدة مدينة جديدة من مدن الجيل الرابع على ساحل البحر المتوسط، وتتبع محافظة الدقهلية.";
    const stock = `على التيسير الآن ${properties(o.n)} للبيع فيها`;
    return hasPpm
      ? `${head} ${stock}، ووسيط سعر متر الشقق المعروضة ${fmtN(g!.medianPpm!)} جنيه (من ${apartments(g!.n)}${date ? `، آخر تحديث ${date}` : ""}).`
      : `${head} ${stock}، وعدد الشقق المعروضة أقل من أن نحسب منه وسيطًا لسعر المتر${date ? ` (آخر تحديث ${date})` : ""}.`;
  }
  // haversine Q12211943 P625[0] (31.4368, 31.667) ↔ Q189383 (31.41667, 31.82139) = 14.8 km, Wikidata fetched 2026-09-29
  const head =
    "دمياط الجديدة مدينة جديدة على ساحل البحر المتوسط تتبع محافظة دمياط، وتقع غرب مدينة دمياط بنحو 15 كم خطًا مستقيمًا.";
  const stock = `على التيسير الآن ${properties(o.n)} للبيع فيها موزعة على ${areas(o.k)}`;
  return hasPpm
    ? `${head} ${stock}، ووسيط سعر متر الشقق المعروضة ${fmtN(g!.medianPpm!)} جنيه (من ${apartments(g!.n)}${date ? `، آخر تحديث ${date}` : ""}).`
    : `${head} ${stock}${date ? ` (آخر تحديث ${date})` : ""}.`;
}

export const CITY_LEDE_SOURCES: Record<string, string> = {
  "new-damietta":
    "المصدر: Wikidata (دمياط الجديدة Q12211943 ومدينة دمياط Q189383، حساب المسافة 29/9/2026)؛ إعلانات التيسير النشطة.",
  "new-mansoura":
    "المصدر: وصف هيئة المجتمعات العمرانية للمدينة (لقطة 21/9/2026)؛ Wikidata (Q63122627)؛ إعلانات التيسير النشطة.",
};

/**
 * صندوق «بيت الوطن» على صفحتي المدينتين وصفحات أحياء بيت الوطن (عنوان خبري، ليس في FAQPage، بلا أرقام حية).
 * {PLATFORM} = موضع رابط صفحة المنصة للمدينة (PlatformLink) أو نصه البديل قبل إطلاقها.
 */
export const BW_BOX: Record<string, { heading: string; text: string; platformAnchor: string; platformFallback: string }> = {
  "new-damietta": {
    heading: "بيت الوطن في دمياط الجديدة",
    text:
      "اسم «بيت الوطن» في دمياط الجديدة يُطلق على مناطق سكنية قائمة (بيت الوطن شرق وغرب وامتداد الشاطئ)، والعقارات المعروضة فيها على التيسير بيع بين أفراد. ويحمل الاسم أيضًا قطاعان من طرح المرحلة 11 في المدينة (بيت الوطن بالساحل، وبيت الوطن غرب المدينة) وفق كراسة الشروط، وقطع المرحلة 11 تُحجز فقط من موقع هيئة المجتمعات العمرانية لمن سجّل في المرحلة 11 وفق نوافذ المسلسل.",
    platformAnchor: "أراضي المرحلة 11 في دمياط الجديدة: المتاح والأسعار الرسمية",
    platformFallback: "",
  },
  "new-mansoura": {
    heading: "بيت الوطن في المنصورة الجديدة: الحجز من الهيئة أو الشراء بالتنازل",
    text:
      "قطع المرحلة 11 من بيت الوطن في المنصورة الجديدة تُحجز فقط من موقع هيئة المجتمعات العمرانية لمن سجّل في المرحلة 11 وفق نوافذ المسلسل، والمتاح منها وأسعارها الرسمية في {PLATFORM}. أما القطع المخصصة سابقًا فتُشترى بالتنازل الرسمي في جهاز المدينة، ونعرض منها إعلانات موثّقة فقط.",
    platformAnchor: "صفحة أراضي بيت الوطن في المنصورة الجديدة",
    platformFallback: "صفحة أراضي بيت الوطن في المنصورة الجديدة على منصة التيسير — الحجز الذكي (قريبًا)",
  },
};

/** رابط إعادة البيع الموثّقة لكل مدينة (العنوان ثابت؛ الوجهة صفحة المدينة أو المحور حسب فهرستها) */
export const RESALE_ANCHOR: Record<string, string> = {
  "new-damietta": "أراضي بيت الوطن للبيع في دمياط الجديدة (موثّقة)",
  "new-mansoura": "أراضي بيت الوطن للبيع في المنصورة الجديدة (موثّقة)",
};

/** مقالات مرتبطة بكل مدينة (عناوين المقالات كما هي؛ spec-final A7) */
export const CITY_POSTS: Record<string, { href: string; label: string }[]> = {
  "new-damietta": [
    { href: "/blog/best-districts/", label: "أفضل الأحياء للسكن في دمياط الجديدة" },
    { href: "/blog/damietta-vs-mansoura/", label: "دمياط الجديدة أم المنصورة الجديدة؟" },
    { href: "/blog/buying-steps-legal/", label: "خطوات شراء عقار: الأوراق والإجراءات" },
  ],
  // «أفضل مناطق السكن في المنصورة الجديدة» رابطها داخل إجابة M-NM-02 على نفس الصفحة، فلا يتكرر هنا
  "new-mansoura": [
    { href: "/blog/damietta-vs-mansoura/", label: "دمياط الجديدة أم المنصورة الجديدة؟" },
    { href: "/blog/buying-steps-legal/", label: "خطوات شراء عقار: الأوراق والإجراءات" },
  ],
};

// ── صفحة الحي (spec-final A2.9) ─────────────────────────────────────────────
/** «الحي الأول» كما هو، و«R1» أو «بيت الوطن - شرق» بـ«حي» قبلها */
export function districtLabel(name: string): string {
  return /^(R\d|بيت الوطن)/.test(name) ? `حي ${name}` : name;
}

/** مقدمة صفحة الحي: النص التحريري ثم جملة المعروض الآن محسوبة */
export function districtLede(o: {
  intro?: string | null;
  districtName: string;
  cityId: string;
  n: number;
  minPrice: number;
  maxPrice: number;
  dataModified: string | null;
}): string {
  const date = dateOf(o.dataModified);
  const intro =
    o.intro ||
    `${o.districtName} منطقة في ${cityAr(o.cityId)}، ولكل عقار معروض فيها على التيسير صفحة بمساحته وتشطيبه وطريقة الدفع.`;
  const stock =
    o.n > 0
      ? `المعروض الآن على التيسير في ${o.districtName}: ${properties(o.n)}${
          o.minPrice > 0
            ? o.minPrice === o.maxPrice
              ? ` بسعر ${fmtN(o.minPrice)} جنيه`
              : `، من ${fmtN(o.minPrice)} إلى ${fmtN(o.maxPrice)} جنيه`
            : ""
        }${date ? ` (آخر تحديث ${date})` : ""}.`
      : `لا توجد عروض منشورة في ${o.districtName} الآن.`;
  const base = `${intro} ${stock}`;
  // مقدمة من 40 كلمة على الأقل (spec-final A2.0): جملة ثابتة صادقة عن الصفحة حين يقصر النص التحريري
  if (wordCount(base) >= 40) return base;
  return o.n > 0
    ? `${base} لكل عقار صفحة بمساحته وسعره وطريقة الدفع، والسعر المعروض سعر طلب يحدده البائع.`
    : `${base} تتحدث هذه الصفحة تلقائيًا عند إضافة عرض جديد، وتجد باقي عروض ${cityAr(o.cityId)} في صفحة المدينة.`;
}

export const districtPriceQuestion = (districtName: string, cityId: string): string =>
  `كم سعر المتر في ${districtLabel(districtName)} ${inCity(cityId)}؟`;

export const districtFitQuestion = (districtName: string): string => `لمن يناسب ${districtLabel(districtName)}؟`;

export type DistrictGroupStat = { group: TypeGroup; count: number; row: PriceRow | null };

/** إجابة «كم سعر المتر في {الحي}؟» من وسيط كل نوع (3 عروض على الأقل)، وإلا الجملة البديلة */
export function districtPriceAnswer(o: {
  districtName: string;
  cityId: string;
  groups: DistrictGroupStat[];
  dataModified: string | null;
  pricesHref: string;
}): string {
  const qualified = o.groups.filter((g) => g.row);
  const low = o.groups.filter((g) => !g.row && g.count > 0);
  const date = asOf(o.dataModified);
  const link = `[جدول سعر المتر لكل حي في ${cityAr(o.cityId)}](${o.pricesHref})`;
  if (qualified.length === 0) {
    return o.groups.length === 0
      ? `لا توجد عروض منشورة في ${o.districtName} الآن، فلا نحسب وسيطًا لسعر المتر فيه. قارن بباقي أحياء المدينة في ${link}.`
      : `عدد العروض المنشورة في ${o.districtName} الآن من كل نوع أقل من 3، فلا نحسب وسيطًا لسعر المتر فيه. قارن بباقي أحياء المدينة في ${link}.`;
  }
  const value = (g: DistrictGroupStat) => `${fmtN(g.row!.medianPpm)} جنيه (من ${GROUP_COUNT[g.group](g.row!.n)})`;
  const clauses = qualified.map((g, i) =>
    i === 0
      ? `وسيط سعر متر ${GROUP_DEF[g.group]} المعروضة للبيع على التيسير في ${o.districtName} ${value(g)}`
      : `ووسيط سعر متر ${GROUP_DEF[g.group]} ${value(g)}`
  );
  const p1 = `${clauses.join("، ")}${date ? `، ${date}` : ""}. هذه أسعار طلب وليست أسعار بيع منفذة.`;
  const lowLine = low.length
    ? ` وعروض ${low.map((g) => GROUP_LABEL[g.group]).join(" و")} فيه أقل من 3، فلا نحسب لها وسيطًا.`
    : "";
  return `${p1}${lowLine}\n\nقارن بباقي أحياء المدينة في ${link}.`;
}

/** كل مجموعات النوع الموجودة في عروض الحي، بترتيب ثابت */
export function districtGroups(
  available: { type: string }[],
  rows: PriceRow[],
  typeGroup: Record<string, TypeGroup | null>
): DistrictGroupStat[] {
  return GROUP_ORDER.map((group) => ({
    group,
    count: available.filter((p) => typeGroup[p.type] === group).length,
    row: rows.find((r) => r.group === group) || null,
  })).filter((g) => g.count > 0 || g.row);
}

// ── صفحات الأنواع /properties/{apartments,villas,lands,shops,clinics,chalets}/ (spec-final A2.9) ─────
const landPlots = (n: number) =>
  count(n, { one: "قطعة أرض واحدة", two: "قطعتا أرض", few: "قطع أراضٍ", many: "قطعة أرض" });
const clinics = (n: number) => count(n, { one: "عيادة واحدة", two: "عيادتان", few: "عيادات", many: "عيادة" });

export type HubSlug = "apartments" | "villas" | "lands" | "shops" | "clinics" | "chalets";

/** اسم النوع معرّفًا ونكرةً، وعدّه، ومجموعته لحدود سعر المتر المنطقية */
export const HUB: Record<
  HubSlug,
  { plural: string; none: string; count: (n: number) => string; group: TypeGroup; priceQuestion: boolean }
> = {
  apartments: { plural: "الشقق", none: "شقق", count: apartments, group: "apartment", priceQuestion: true },
  villas: { plural: "الفيلات", none: "فيلات", count: villas, group: "villa", priceQuestion: true },
  // سؤال سعر الأرض يملكه /prices/#…-land (Q165/Q175)؛ وQ182 يملكه /new-damietta/#lands (رابط من صفحة الأراضي)
  lands: { plural: "الأراضي", none: "أراضٍ", count: landPlots, group: "land", priceQuestion: false },
  shops: { plural: "المحلات والمقرات التجارية", none: "محلات أو مقرات تجارية", count: units, group: "commercial", priceQuestion: true },
  clinics: { plural: "العيادات", none: "عيادات", count: clinics, group: "commercial", priceQuestion: true },
  chalets: { plural: "الشاليهات", none: "شاليهات", count: chalets, group: "chalet", priceQuestion: true },
};

export type HubListing = { price: number; area: number; cityId: string };
export type HubCity = { n: number; medianPrice: number | null; medianPpm: number | null; valid: number };

/** وسيط السعر وسعر المتر لكل مدينة من عروض الصفحة نفسها (3 على الأقل، وبنفس حدود /prices/ للقيم الشاذة) */
export function hubCityStats(listings: HubListing[], group: TypeGroup, cityId: string): HubCity {
  const here = listings.filter((p) => p.cityId === cityId);
  const [lo, hi] = PPM_BOUNDS[group];
  const valid = here.filter(
    (p) => p.price > 0 && p.area >= AREA_BOUNDS[0] && p.area <= AREA_BOUNDS[1] && p.price / p.area >= lo && p.price / p.area <= hi
  );
  const ok = valid.length >= MIN_N;
  return {
    n: here.length,
    valid: valid.length,
    medianPrice: ok ? Math.round(median(valid.map((p) => p.price))) : null,
    medianPpm: ok ? Math.round(median(valid.map((p) => p.price / p.area))) : null,
  };
}

/** مقدمة صفحة النوع: العدد في المدينتين ونطاق السعر المطلوب وتاريخ آخر تحديث (40–60 كلمة) */
export function hubLede(
  slug: HubSlug,
  o: { nD: number; nM: number; minPrice: number; maxPrice: number; dataModified: string | null }
): string {
  const h = HUB[slug];
  const date = dateOf(o.dataModified);
  const n = o.nD + o.nM;
  if (n === 0) {
    return `لا توجد ${h.none} معروضة للبيع الآن على التيسير في دمياط الجديدة والمنصورة الجديدة${date ? ` (آخر تحديث ${date})` : ""}. تتحدث هذه الصفحة تلقائيًا عند إضافة عرض جديد، وتجد باقي العروض في صفحة كل العقارات وصفحتي المدينتين، ووسيط سعر المتر لكل حي ونوع عقار في صفحة أسعار العقارات.`;
  }
  const split =
    o.nM === 0 ? "كلها في دمياط الجديدة" : o.nD === 0 ? "كلها في المنصورة الجديدة" : `منها ${fmtN(o.nD)} في دمياط الجديدة و${fmtN(o.nM)} في المنصورة الجديدة`;
  const range =
    o.minPrice > 0
      ? o.minPrice === o.maxPrice
        ? `، بسعر مطلوب ${fmtN(o.minPrice)} جنيه`
        : `، وأسعارها المطلوبة من ${fmtN(o.minPrice)} إلى ${fmtN(o.maxPrice)} جنيه`
      : "";
  return `المعروض الآن على التيسير من ${h.plural} للبيع في دمياط الجديدة والمنصورة الجديدة: ${h.count(n)}، ${split}${range}${date ? ` (آخر تحديث ${date})` : ""}. لكل عقار صفحة بمساحته وسعره وطريقة الدفع، والسعر المعروض سعر طلب يحدده البائع وليس سعر بيع منفذًا.`;
}

export const hubPriceQuestion = (slug: HubSlug): string =>
  `كم سعر ${HUB[slug].plural} في دمياط الجديدة والمنصورة الجديدة؟`;

/** إجابة سؤال السعر في صفحة النوع: وسيط كل مدينة من 3 عروض على الأقل، وإلا الجملة البديلة */
export function hubPriceAnswer(
  slug: HubSlug,
  o: { cities: Record<CitySlug, HubCity>; dataModified: string | null }
): string {
  const h = HUB[slug];
  const part = (c: CitySlug) => {
    const s = o.cities[c];
    if (s.medianPrice === null || s.medianPpm === null) {
      return s.n === 0
        ? `لا توجد ${h.none} معروضة في ${CITY_AR[c]} الآن`
        : `عدد ${h.plural} المعروضة في ${CITY_AR[c]} أقل من 3، فلا نحسب لها وسيطًا`;
    }
    return `وسيط السعر في ${CITY_AR[c]} ${fmtN(s.medianPrice)} جنيه ووسيط سعر المتر ${fmtN(s.medianPpm)} جنيه (من ${h.count(s.valid)})`;
  };
  const date = asOf(o.dataModified);
  return `${h.plural} المعروضة للبيع على التيسير: ${part("new-damietta")}؛ و${part("new-mansoura")}${date ? `، ${date}` : ""}. هذه أسعار طلب من البائعين وليست أسعار بيع منفذة.\n\nوسيط سعر المتر لكل حي ونوع عقار في [صفحة أسعار العقارات](/prices/).`;
}
