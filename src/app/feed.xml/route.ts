// خلاصة RSS للمدونة — تسرّع اكتشاف المقالات الجديدة لدى محركات البحث ووكلاء الذكاء الاصطناعي

const BASE_URL = "https://eltaiseer.com";

const POSTS = [
  {
    slug: "buying-steps-legal",
    title: "خطوات شراء عقار في دمياط الجديدة والمنصورة الجديدة: الأوراق والإجراءات",
    description: "الخطوات السبع بالترتيب من فحص الأوراق حتى التسجيل، والأخطاء الشائعة التي تكلف المشترين.",
    date: "2026-08-17",
  },
  {
    slug: "damietta-vs-mansoura",
    title: "دمياط الجديدة أم المنصورة الجديدة؟ مقارنة شاملة بالأرقام 2026",
    description:
      "مقارنة تفصيلية بالأرقام: الأسعار، الخدمات، التسليم، وفرص الاستثمار، مع إجابة عملية مباشرة حسب هدفك.",
    date: "2026-08-17",
  },
  {
    slug: "new-mansoura-districts",
    title: "أفضل المناطق للسكن في المنصورة الجديدة 2026",
    description: "دليل شامل لأحياء المنصورة الجديدة من R1 إلى R7 وحي الفيلات وداون تاون والواجهة البحرية.",
    date: "2026-01-17",
  },
  {
    slug: "new-mansoura-investment",
    title: "الاستثمار العقاري في المنصورة الجديدة 2026: دليل المستثمر الذكي",
    description: "لماذا تعد المنصورة الجديدة من أفضل فرص الاستثمار العقاري، وأفضل المناطق والعوائد المتوقعة.",
    date: "2026-01-17",
  },
  {
    slug: "buying-apartment-guide",
    title: "دليلك الشامل لشراء شقة في دمياط الجديدة 2026",
    description: "كل ما تحتاج معرفته قبل شراء شقتك: اختيار المنطقة، التفاوض، والإجراءات القانونية.",
    date: "2026-01-15",
  },
  {
    slug: "best-districts",
    title: "أفضل الأحياء للسكن في دمياط الجديدة 2026",
    description: "مقارنة تفصيلية بين الحي الأول والثاني والثالث ومشاريع الإسكان القومي.",
    date: "2026-01-10",
  },
  {
    slug: "national-housing-projects",
    title: "مشاريع الإسكان القومية في دمياط الجديدة: دليلك الشامل 2026",
    description: "جنة ودار مصر وسكن مصر وبيت الوطن — الأسعار والمساحات وشروط الحجز.",
    date: "2026-01-05",
  },
  {
    slug: "investment-guide",
    title: "الاستثمار العقاري في دمياط الجديدة 2026",
    description: "أفضل المناطق للاستثمار والعوائد المتوقعة ونصائح الخبراء.",
    date: "2026-01-01",
  },
  {
    slug: "finishing-tips",
    title: "نصائح التشطيب في دمياط الجديدة 2026",
    description: "دليل تكلفة التشطيب ومستوياته من نصف تشطيب حتى الترا سوبر لوكس.",
    date: "2026-01-03",
  },
];

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const items = POSTS.map(
    (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${BASE_URL}/blog/${p.slug}/</link>
      <guid>${BASE_URL}/blog/${p.slug}/</guid>
      <description>${esc(p.description)}</description>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    </item>`
  ).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>مدونة التيسير للعقارات</title>
    <link>${BASE_URL}/blog/</link>
    <description>أدلة شراء واستثمار العقارات في دمياط الجديدة والمنصورة الجديدة</description>
    <language>ar</language>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
