// lib/blogPosts.ts
// سجل واحد لمقالات المدونة: العنوان والتاريخان (النشر وآخر تحديث).
// يغذي خلاصة RSS وخريطة الموقع وschema المقال والتاريخ المرئي في الصفحة معاً —
// كانت التواريخ مكتوبة يدوياً في أربعة أماكن ومتضاربة (مقال واحد بثلاثة تواريخ مختلفة).

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  /* تاريخ النشر ISO (YYYY-MM-DD) */
  published: string;
  /* آخر تعديل فعلي للمحتوى — يُحدَّث يدوياً عند تعديل نص المقال فقط */
  updated: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "buying-steps-legal",
    title: "خطوات شراء عقار في دمياط الجديدة والمنصورة الجديدة: الأوراق والإجراءات",
    description: "الخطوات السبع بالترتيب من فحص الأوراق حتى التسجيل، والأخطاء الشائعة التي تكلف المشترين.",
    published: "2026-08-17",
    updated: "2026-08-17",
  },
  {
    slug: "damietta-vs-mansoura",
    title: "دمياط الجديدة أم المنصورة الجديدة؟ مقارنة شاملة بالأرقام 2026",
    description:
      "مقارنة تفصيلية بالأرقام: الأسعار، الخدمات، التسليم، وفرص الاستثمار، مع إجابة عملية مباشرة حسب هدفك.",
    published: "2026-08-17",
    updated: "2026-11-11",
  },
  {
    slug: "finishing-tips",
    title: "نصائح التشطيب في دمياط الجديدة 2026",
    description: "دليل تكلفة التشطيب ومستوياته من نصف تشطيب حتى الترا سوبر لوكس.",
    published: "2026-01-28",
    updated: "2026-08-17",
  },
  {
    slug: "new-mansoura-districts",
    title: "أفضل المناطق للسكن في المنصورة الجديدة 2026",
    description: "دليل شامل لأحياء المنصورة الجديدة من R1 إلى R7 وحي الفيلات وداون تاون والواجهة البحرية.",
    published: "2026-01-17",
    updated: "2026-08-17",
  },
  {
    slug: "new-mansoura-investment",
    title: "الاستثمار العقاري في المنصورة الجديدة 2026: دليل المستثمر الذكي",
    description: "لماذا تعد المنصورة الجديدة من أفضل فرص الاستثمار العقاري، وأفضل المناطق والعوائد المتوقعة.",
    published: "2026-01-17",
    updated: "2026-08-17",
  },
  {
    slug: "buying-apartment-guide",
    title: "دليلك الشامل لشراء شقة في دمياط الجديدة 2026",
    description: "كل ما تحتاج معرفته قبل شراء شقتك: اختيار المنطقة، التفاوض، والإجراءات القانونية.",
    published: "2026-01-15",
    updated: "2026-08-17",
  },
  {
    slug: "best-districts",
    title: "أفضل الأحياء للسكن في دمياط الجديدة 2026",
    description: "مقارنة تفصيلية بين الحي الأول والثاني والثالث ومشاريع الإسكان القومي.",
    published: "2026-01-10",
    updated: "2026-08-17",
  },
  {
    slug: "national-housing-projects",
    title: "مشاريع الإسكان القومية في دمياط الجديدة: دليلك الشامل 2026",
    description: "جنة ودار مصر وسكن مصر وبيت الوطن — الأسعار والمساحات وشروط الحجز.",
    published: "2026-01-05",
    updated: "2026-08-17",
  },
  {
    slug: "investment-guide",
    title: "الاستثمار العقاري في دمياط الجديدة 2026",
    description: "أفضل المناطق للاستثمار والعوائد المتوقعة ونصائح الخبراء.",
    published: "2026-01-01",
    updated: "2026-08-17",
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

const AR_MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

// "2026-08-17" → "17 أغسطس 2026" — بدون Intl حتى لا تختلف الأرقام بين الخادم والمتصفح
export function formatArabicDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return `${d} ${AR_MONTHS[m - 1]} ${y}`;
}
