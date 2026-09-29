// src/lib/answers/local.ts
// أسئلة عقارات دمياط الجديدة والمنصورة الجديدة (الأسعار، المدينتان، التقسيط، المقارنة).
// كل سؤال على صفحته المالكة فقط (faq-owners.json)؛ الأرقام محسوبة من الإعلانات النشطة وقت الطلب.

import type { Answer, PageData } from "./types";
import type { TypeGroup } from "../seo/prices";
import { apartments, asOf, count, districtsIn, fmtN, plots, years } from "./format";

type CitySlug = "new-damietta" | "new-mansoura";
const CITY_AR: Record<CitySlug, string> = { "new-damietta": "دمياط الجديدة", "new-mansoura": "المنصورة الجديدة" };

const PRICES_SOURCE = "إعلانات البيع النشطة على eltaiseer.com (وسيط لكل حي ونوع عقار، 3 عقارات على الأقل)";
const join = (...xs: (string | false | null | undefined)[]) => xs.filter(Boolean).join(" ");

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

// المعدود في جملة أحياء دمياط الجديدة (Q169)
const areas = (n: number) => count(n, { one: "منطقة واحدة", two: "منطقتين", few: "مناطق", many: "منطقة" });

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

  // ── /blog/damietta-vs-mansoura/ (Q174) ────────────────────────────────────
  {
    id: "Q174",
    q: "دمياط الجديدة أم المنصورة الجديدة: أيهما أنسب للسكن؟",
    a: () =>
      "للسكن الفوري دمياط الجديدة أنسب لأن أحياءها الرئيسية مأهولة؛ والمنصورة الجديدة لمن يقبل استلامًا لاحقًا في مدينة ما زالت تُستكمل.",
    sources: [],
    status: "verified",
    owner: "/blog/damietta-vs-mansoura/",
  },
];

/** مجموعة نوع العقار التي تُحسب منها «شقق بالتقسيط» (نفس تعريف الشقق في /prices/) */
export const INSTALLMENT_GROUP: TypeGroup = "apartment";
