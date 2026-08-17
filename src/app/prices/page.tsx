import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { TrendingUp, LineChart } from "lucide-react";
import { getPropertiesServer } from "@/lib/serverProperties";
import { getDistrictSlug } from "@/lib/districtSlugs";
import { buildFaqSchema } from "@/lib/homeFaq";
import type { Property } from "@/lib/mockData";

// ISR كل 5 دقائق — أسعار حية من العقارات المعروضة فعلاً
export const revalidate = 300;

export const metadata: Metadata = {
  title: "أسعار العقارات اليوم في دمياط الجديدة والمنصورة الجديدة",
  description:
    "أسعار العقارات المحدثة في دمياط الجديدة والمنصورة الجديدة: متوسط سعر المتر لكل حي محسوب من العقارات المعروضة فعلاً الآن، مع نطاقات أسعار الشقق والفيلات والمحلات 2026.",
  keywords: [
    "أسعار العقارات دمياط الجديدة",
    "أسعار الشقق في دمياط الجديدة",
    "سعر المتر في دمياط الجديدة",
    "أسعار العقارات المنصورة الجديدة",
    "سعر المتر في المنصورة الجديدة",
    "أسعار الشقق 2026",
  ],
  openGraph: {
    title: "أسعار العقارات اليوم | دمياط الجديدة والمنصورة الجديدة",
    description: "متوسط سعر المتر لكل حي — محسوب من العقارات المعروضة فعلاً ويتحدث تلقائياً",
    url: "https://eltaiseer.com/prices/",
    type: "website",
    locale: "ar_EG",
    siteName: "التيسير للعقارات",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "https://eltaiseer.com/prices/",
  },
};

const PRICES_FAQ = [
  {
    question: "كيف تُحسب هذه الأسعار؟",
    answer:
      "متوسطات سعر المتر في الجداول محسوبة آلياً من العقارات المعروضة للبيع فعلاً على الموقع الآن (السعر ÷ المساحة لكل عقار متاح)، وتتحدث تلقائياً مع كل تغيير في المعروض. النطاقات العامة تعكس خبرتنا بسوق المدينتين في 2026.",
  },
  {
    question: "لماذا يختلف سعر المتر من حي لآخر؟",
    answer:
      "ثلاثة عوامل رئيسية: اكتمال الخدمات (الأحياء الأولى الأغلى)، الموقع والقرب من البحر أو المحاور، ومستوى التشطيب السائد في الحي. مشاريع الإسكان القومي أسعارها مدعومة فتقل عن أحياء الإسكان الحر المجاورة.",
  },
  {
    question: "هل الأسعار قابلة للتفاوض؟",
    answer:
      "غالباً نعم — خاصة في الدفع كاش حيث يقبل كثير من الملاك خصماً مقابل السداد الفوري. تواصل معنا على 01500775974 وسنساعدك في التفاوض على الوحدة التي تناسبك.",
  },
];

interface DistrictPriceRow {
  district: string;
  slug: string;
  count: number;
  avgPerSqm: number;
  minPrice: number;
  maxPrice: number;
}

function computeCityRows(properties: Property[], cityId: string): DistrictPriceRow[] {
  const byDistrict = new Map<string, Property[]>();
  for (const p of properties) {
    if ((p.location.cityId || "new-damietta") !== cityId) continue;
    if (p.status === "تم البيع") continue;
    const d = p.location.district?.trim();
    if (!d) continue;
    if (!byDistrict.has(d)) byDistrict.set(d, []);
    byDistrict.get(d)!.push(p);
  }
  const rows: DistrictPriceRow[] = [];
  Array.from(byDistrict.entries()).forEach(([district, props]) => {
    const perSqm = props
      .filter((p: Property) => p.price > 0 && p.details?.area_sqm > 0)
      .map((p: Property) => p.price / p.details.area_sqm);
    if (perSqm.length === 0) return;
    const prices = props.map((p: Property) => p.price);
    rows.push({
      district,
      slug: getDistrictSlug(district),
      count: props.length,
      avgPerSqm: Math.round(perSqm.reduce((a: number, b: number) => a + b, 0) / perSqm.length),
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    });
  });
  return rows.sort((a, b) => b.count - a.count);
}

function fmtM(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)} مليون`;
  return n.toLocaleString("ar-EG");
}

function CityPriceTable({
  rows,
  citySlug,
  accent,
}: {
  rows: DistrictPriceRow[];
  citySlug: string;
  accent: "orange" | "emerald";
}) {
  if (rows.length === 0) return null;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm mb-4">
      <table className="w-full border-collapse bg-white text-sm md:text-base">
        <thead className={accent === "orange" ? "bg-orange-600 text-white" : "bg-emerald-600 text-white"}>
          <tr>
            <th className="p-4 text-right">الحي</th>
            <th className="p-4 text-right">العقارات المتاحة</th>
            <th className="p-4 text-right">متوسط سعر المتر</th>
            <th className="p-4 text-right">نطاق الأسعار</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.slug} className={`border-b ${i % 2 ? "bg-gray-50" : ""}`}>
              <td className="p-4 font-semibold">
                <Link
                  href={`/${citySlug}/${row.slug}`}
                  className={accent === "orange" ? "text-orange-700 hover:underline" : "text-emerald-700 hover:underline"}
                >
                  {row.district}
                </Link>
              </td>
              <td className="p-4">{row.count}</td>
              <td className="p-4 font-semibold">{row.avgPerSqm.toLocaleString("ar-EG")} جنيه/م²</td>
              <td className="p-4" dir="ltr">
                {fmtM(row.minPrice)} - {fmtM(row.maxPrice)} جنيه
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function PricesPage() {
  const all = await getPropertiesServer();
  const ndRows = computeCityRows(all, "new-damietta");
  const nmRows = computeCityRows(all, "new-mansoura");
  const faqSchema = buildFaqSchema(PRICES_FAQ);
  const updatedAt = new Date().toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />

      <Breadcrumb
        items={[
          { label: "الرئيسية", href: "/" },
          { label: "أسعار العقارات" },
        ]}
      />

      {/* Hero */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-orange-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <LineChart className="h-10 w-10 text-orange-400" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                أسعار العقارات اليوم في دمياط الجديدة والمنصورة الجديدة
              </h1>
              <p className="text-gray-300 mt-2">
                متوسطات محسوبة من العقارات المعروضة فعلاً — آخر تحديث: {updatedAt}
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-10 max-w-5xl">
        {/* إجابة مباشرة أولاً (AEO) */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-10 border-r-4 border-orange-500">
          <p className="text-gray-700 leading-loose">
            <strong>الخلاصة السريعة:</strong> سعر متر الشقق في{" "}
            <Link href="/new-damietta" className="text-orange-600 hover:underline font-semibold">دمياط الجديدة</Link>{" "}
            يتراوح بين <strong>5,000 و20,000 جنيه</strong> حسب الحي (الحي الأول والسادس الأعلى)،
            وفي{" "}
            <Link href="/new-mansoura" className="text-emerald-600 hover:underline font-semibold">المنصورة الجديدة</Link>{" "}
            بين <strong>6,000 و25,000 جنيه</strong> (R1-R3 بين 8 و15 ألفاً). الشقق تبدأ من
            500,000 جنيه في دمياط الجديدة و600,000 جنيه في المنصورة الجديدة، والجداول
            التالية تعرض المتوسط الفعلي لكل حي من المعروض الحالي.
          </p>
        </div>

        {/* جداول حية */}
        {ndRows.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              متوسط الأسعار الحالي بأحياء دمياط الجديدة
            </h2>
            <CityPriceTable rows={ndRows} citySlug="new-damietta" accent="orange" />
            <p className="text-sm text-gray-500">
              محسوب من {ndRows.reduce((s, r) => s + r.count, 0)} عقاراً معروضاً حالياً — اضغط اسم الحي لتصفح عقاراته
            </p>
          </section>
        )}

        {nmRows.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              متوسط الأسعار الحالي بأحياء المنصورة الجديدة
            </h2>
            <CityPriceTable rows={nmRows} citySlug="new-mansoura" accent="emerald" />
            <p className="text-sm text-gray-500">
              محسوب من {nmRows.reduce((s, r) => s + r.count, 0)} عقاراً معروضاً حالياً
            </p>
          </section>
        )}

        {/* النطاقات العامة حسب النوع */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            النطاقات العامة حسب نوع العقار (2026)
          </h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full border-collapse bg-white text-sm md:text-base">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="p-4 text-right">النوع</th>
                  <th className="p-4 text-right">دمياط الجديدة</th>
                  <th className="p-4 text-right">المنصورة الجديدة</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4 font-semibold">شقق</td>
                  <td className="p-4">500 ألف - 5 مليون (5-20 ألف/م²)</td>
                  <td className="p-4">600 ألف - 8 مليون (6-25 ألف/م²)</td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="p-4 font-semibold">فيلات</td>
                  <td className="p-4">3 - 15 مليون (10-25 ألف/م²)</td>
                  <td className="p-4">5 - 20 مليون (15-35 ألف/م²)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-semibold">محلات تجارية</td>
                  <td className="p-4">800 ألف - 5 مليون (15-40 ألف/م²)</td>
                  <td className="p-4">1 - 8 مليون (20-50 ألف/م²)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-4 font-semibold">عيادات</td>
                  <td className="p-4">600 ألف - 3 مليون (12-25 ألف/م²)</td>
                  <td className="p-4">حسب الموقع</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">أسئلة شائعة عن الأسعار</h2>
          <div className="space-y-3">
            {PRICES_FAQ.map((item) => (
              <details key={item.question} className="group bg-gray-50 rounded-xl border border-gray-200 p-5">
                <summary className="cursor-pointer list-none font-semibold text-gray-800 flex items-center justify-between">
                  <h3 className="text-base font-semibold">{item.question}</h3>
                  <span className="text-orange-500 transition-transform group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-3 text-gray-600 leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center bg-gradient-to-l from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
          <TrendingUp className="h-10 w-10 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">عايز تعرف عقارك يساوي كام؟</h2>
          <p className="text-orange-100 mb-5">قيّم عقارك مجاناً بناءً على أسعار السوق الفعلية</p>
          <Button asChild size="lg" variant="secondary" className="font-bold">
            <Link href="/valuation">تقييم مجاني لعقارك</Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
