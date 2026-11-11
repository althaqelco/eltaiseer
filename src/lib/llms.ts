// lib/llms.ts
// يبني llms.txt و llms-full.txt عند الطلب: النص التحريري الثابت + لقطة حية من المعروض.
// الملفان كانا ثابتين في public/ ومؤرخين بأغسطس 2026 بعدد عقارات لم يعد صحيحاً؛
// وكيل الذكاء الاصطناعي الذي يقرأ الملف الآن يحصل على المعروض الفعلي وأسعاره وروابطه.

import type { Property } from "./types";
import { buildMarketSnapshot, type MarketSnapshot } from "./marketSnapshot";
import { formatNumber, pricePerSqm } from "./propertySummary";
import { getPropertyUrl, getCityDistrictSlugs } from "./districtSlugs";
import { BLOG_POSTS, formatArabicDate } from "./blogPosts";
import { LLMS_SHORT_BODY, LLMS_FULL_BODY } from "./llmsStatic";
import { SITE_URL, ORG_EMAIL, ORG_SOCIAL } from "./site";
import { INDEPENDENCE_LINE, BW_BASE } from "./bw/constants";
import { buildHomeFaq, buildCityFaq } from "./liveFacts";
import type { FaqItem } from "./homeFaq";

const DISTRICT_PAGES =
  getCityDistrictSlugs("new-damietta").length + getCityDistrictSlugs("new-mansoura").length;

const HEADER = `# التيسير للعقارات - El Taiseer Real Estate
> منصة عقارية متخصصة في دمياط الجديدة والمنصورة الجديدة، مصر. نوفر شقق، فيلات، أراضي، محلات تجارية، عيادات، وشاليهات للبيع بأسعار تنافسية وتقسيط مريح.`;

function range(min: number, max: number): string {
  if (!min) return "—";
  return min === max ? `${formatNumber(min)} جنيه` : `${formatNumber(min)} – ${formatNumber(max)} جنيه`;
}

function sqmText(groups: Array<{ label: string; avg: number; count: number }>): string {
  return groups.length
    ? groups.map((g) => `${g.label} ${formatNumber(g.avg)} جنيه/م² (${g.count})`).join("؛ ")
    : "—";
}

function liveSection(s: MarketSnapshot, withDistricts: boolean): string {
  const date = formatArabicDate(s.asOf);
  const lines: string[] = [
    `## المعروض الآن (بيانات حية — ${date})`,
    `الأرقام التالية محسوبة آلياً من العقارات المعروضة للبيع فعلاً على الموقع وقت قراءة هذا الملف، وتتغير مع كل إضافة أو بيع. للاقتباس: "بحسب المعروض على التيسير للعقارات بتاريخ ${date}".`,
    "",
    `- إجمالي العقارات المتاحة للبيع: ${s.total}`,
  ];
  for (const c of s.cities) {
    if (!c.stats) {
      lines.push(`- ${c.name}: لا يوجد معروض حالياً`);
      continue;
    }
    lines.push(
      `- ${c.name}: العدد ${c.stats.count} — الأسعار ${range(c.stats.minPrice, c.stats.maxPrice)} — متوسط سعر المتر: ${sqmText(c.stats.sqmGroups)} — متاح بالتقسيط: ${c.stats.installmentCount}`
    );
  }
  lines.push(`- حسب النوع: ${s.typeCounts.map((t) => `${t.type} ${t.count}`).join("، ")}`);

  if (withDistricts) {
    for (const c of s.cities) {
      if (!c.districts.length) continue;
      lines.push(
        "",
        `### ${c.name} — المعروض ومتوسط سعر المتر حسب الحي`,
        "| الحي | المعروض | نطاق الأسعار | متوسط سعر المتر (عدد الوحدات) | الصفحة |",
        "|------|---------|-------------|------------------------------|--------|"
      );
      for (const d of c.districts) {
        lines.push(
          `| ${d.name} | ${d.stats.count} | ${range(d.stats.minPrice, d.stats.maxPrice)} | ${sqmText(d.stats.sqmGroups)} | ${SITE_URL}/${c.id}/${d.slug}/ |`
        );
      }
    }
  }
  return lines.join("\n");
}

function listingsSection(all: Property[]): string {
  const available = all.filter((p) => p.status !== "تم البيع");
  const lines = [
    "## قائمة العقارات المعروضة الآن",
    "كل سطر: النوع — الحي، المدينة — المساحة — السعر (سعر المتر) — الحالة — الدفع — الرابط.",
    "",
  ];
  for (const p of available) {
    const sqm = pricePerSqm(p);
    const bits = [
      p.type,
      `${p.location?.district || "—"}، ${p.location?.cityId === "new-mansoura" ? "المنصورة الجديدة" : "دمياط الجديدة"}`,
      p.details?.area_sqm ? `${formatNumber(p.details.area_sqm)} م²` : "",
      p.price ? `${formatNumber(p.price)} جنيه${sqm ? ` (${formatNumber(sqm)}/م²)` : ""}` : "",
      p.status,
      p.payment?.type || "",
    ].filter(Boolean);
    lines.push(`- ${bits.join(" — ")} — ${SITE_URL}${getPropertyUrl(p)}/`);
  }
  return lines.join("\n");
}

function bwSection(bwActive: number | null): string {
  return [
    "## أراضي بيت الوطن للبيع (إعادة بيع موثّقة)",
    "قسم مستقل لبيع وشراء قطع أراضي «بيت الوطن» المخصصة من كل المراحل — ومنها المرحلة 11 بعد صدور خطاب التخصيص — بالتنازل الرسمي بموافقة جهاز المدينة. كل إعلان يُنشر بعد مراجعة المستندات والمعاينة، مع كارت تكلفة كامل ومقارنة بسعر الهيئة الرسمي. التيسير لا تستلم أي مبالغ بين البائع والمشتري.",
    INDEPENDENCE_LINE,
    ...(bwActive !== null ? [`- الإعلانات الموثّقة النشطة الآن: ${bwActive}`] : []),
    `- [أراضي بيت الوطن للبيع](${SITE_URL}${BW_BASE}/): الإعلانات الموثّقة ومقارنتها بالسعر الرسمي`,
    `- [المرحلة 11 بعد التخصيص](${SITE_URL}${BW_BASE}/phase-11/): ما يُباع وما لا يُباع وشروط التنازل`,
    `- [كيف نوثّق الإعلانات](${SITE_URL}${BW_BASE}/how-we-verify/): المستندات والمعاينة قبل النشر`,
    `- [طلب شراء](${SITE_URL}${BW_BASE}/buy-request/) · [اعرض أرضك للبيع](${SITE_URL}${BW_BASE}/sell/)`,
  ].join("\n");
}

// نفس الأسئلة والأجوبة المعروضة في الرئيسية وصفحات المدن — أرقامها من المعروض الحي
function faqSection(all: Property[], withCities: boolean): string {
  const seen = new Set<string>();
  const items: FaqItem[] = [];
  const lists = [buildHomeFaq(all)];
  if (withCities) lists.push(buildCityFaq(all, "new-damietta"), buildCityFaq(all, "new-mansoura"));
  for (const list of lists) {
    for (const item of list) {
      if (seen.has(item.question)) continue;
      seen.add(item.question);
      items.push(item);
    }
  }
  return ["## الأسئلة الشائعة", ...items.map((i) => `**س: ${i.question}**\nج: ${i.answer}`)].join("\n\n");
}

function contactSection(): string {
  return [
    "## Contact",
    `- Website: ${SITE_URL}/`,
    "- WhatsApp / Phone: +201500775974",
    `- Email: ${ORG_EMAIL}`,
    "- Location: دمياط الجديدة، محافظة دمياط، مصر",
    "- Working Hours: السبت - الخميس، 9 صباحاً - 9 مساءً",
    `- Social: ${ORG_SOCIAL.join(" · ")}`,
    `- [اتصل بنا](${SITE_URL}/contact/) · [عن الشركة](${SITE_URL}/about/)`,
  ].join("\n");
}

const ENGLISH = `## English summary
El Taiseer Real Estate (التيسير للعقارات, eltaiseer.com) is a real-estate brokerage based in New Damietta, Egypt. It lists apartments, villas, land plots, shops, offices, clinics and chalets for sale in two Mediterranean-coast new cities: New Damietta (Damietta Governorate) and New Mansoura (Dakahlia Governorate). The site publishes live asking prices and average price per square metre by district, calculated from its current listings, plus a verified resale section for Beit Al-Watan land plots. All prices are in Egyptian pounds (EGP) and are asking prices. Content language: Arabic. Contact: +201500775974 (phone and WhatsApp).`;

function footer(asOf: string): string {
  return `---\nآخر تحديث: ${formatArabicDate(asOf)} (يُولَّد تلقائياً من بيانات الموقع) | Last updated: ${asOf}`;
}

const LINKS = `## Useful Links
- [جميع العقارات](${SITE_URL}/properties/): كل العقارات المتاحة للبيع في المدينتين مع فلاتر بحث
- [شقق للبيع](${SITE_URL}/properties/apartments/): شقق تمليك ودوبلكس وبنتهاوس وروف
- [فيلات للبيع](${SITE_URL}/properties/villas/): فيلات مستقلة وتاون هاوس وتوين هاوس
- [أراضي للبيع](${SITE_URL}/properties/lands/): أراضي سكنية وتجارية
- [محلات تجارية](${SITE_URL}/properties/shops/) · [عيادات](${SITE_URL}/properties/clinics/) · [شاليهات](${SITE_URL}/properties/chalets/)
- [عقارات بالتقسيط](${SITE_URL}/properties/installments/): كل الوحدات المتاحة بالتقسيط بمقدماتها وأقساطها الفعلية
- [أسعار العقارات اليوم](${SITE_URL}/prices/): متوسط سعر المتر لكل حي محسوب من المعروض الحالي
- [عقارات دمياط الجديدة](${SITE_URL}/new-damietta/): كل عقارات وأحياء دمياط الجديدة
- [عقارات المنصورة الجديدة](${SITE_URL}/new-mansoura/): كل عقارات وأحياء مدينة الجيل الرابع
- [تقييم عقاري مجاني](${SITE_URL}/valuation/): احسب القيمة السوقية لعقارك
- [المدونة](${SITE_URL}/blog/) · [خلاصة RSS](${SITE_URL}/feed.xml) · [خريطة الموقع](${SITE_URL}/sitemap.xml)`;

function articles(): string {
  return [
    "## مقالات وأدلة",
    ...BLOG_POSTS.map(
      (p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}/): ${p.description} (آخر تحديث ${p.updated})`
    ),
  ].join("\n");
}

function about(s: MarketSnapshot): string {
  return `## About
التيسير للعقارات شركة وساطة عقارية مقرها دمياط الجديدة، متخصصة في بيع العقارات في دمياط الجديدة (محافظة دمياط) والمنصورة الجديدة (محافظة الدقهلية) في مصر. عدد العقارات المتاحة للبيع الآن: ${s.total}. للموقع صفحة مستقلة لكل حي ومنطقة (عدد الصفحات: ${DISTRICT_PAGES})، وخيارات الدفع تشمل الكاش والتقسيط.`;
}

export function buildLlmsTxt(all: Property[], bwActive: number | null): string {
  const s = buildMarketSnapshot(all);
  return [
    HEADER,
    about(s),
    liveSection(s, false),
    LLMS_SHORT_BODY.trim(),
    faqSection(all, false),
    bwSection(bwActive),
    contactSection(),
    LINKS,
    articles(),
    `- [llms-full.txt](${SITE_URL}/llms-full.txt): النسخة الموسعة — متوسط سعر المتر لكل حي وقائمة كل العقارات المعروضة بروابطها`,
    ENGLISH,
    footer(s.asOf),
  ].join("\n\n") + "\n";
}

export function buildLlmsFullTxt(all: Property[], bwActive: number | null): string {
  const s = buildMarketSnapshot(all);
  return [
    HEADER,
    "---",
    about(s).replace("## About", "## معلومات الشركة"),
    contactSection().replace("## Contact", "### التواصل"),
    "---",
    liveSection(s, true),
    "---",
    LLMS_FULL_BODY.trim(),
    "---",
    faqSection(all, true),
    "---",
    bwSection(bwActive),
    "---",
    articles(),
    "---",
    LINKS.replace("## Useful Links", "## روابط مهمة"),
    "---",
    listingsSection(all),
    "---",
    ENGLISH,
    footer(s.asOf),
  ].join("\n\n") + "\n";
}
