import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { TrendingUp, LineChart } from "lucide-react";
import { getPropertiesServer } from "@/lib/serverProperties";
import { buildFaqSchema } from "@/lib/homeFaq";
import { formatNumber } from "@/lib/propertySummary";
import { buildMarketSnapshot, type CitySnapshot } from "@/lib/marketSnapshot";
import {
  buildCityFacts,
  sqmAnswer,
  groupFacts,
  inGroup,
  inCity,
  available,
  MIN_POINTS,
  TYPE_GROUPS,
  type TypeGroupKey,
} from "@/lib/liveFacts";
import { formatArabicDate } from "@/lib/blogPosts";
import { ORG_ID, SITE_URL } from "@/lib/site";

// ISR كل 5 دقائق — أسعار حية من العقارات المعروضة فعلاً
export const revalidate = 300;

export const metadata: Metadata = {
  title: "أسعار العقارات اليوم في دمياط الجديدة والمنصورة الجديدة",
  description:
    "أسعار العقارات المحدثة في دمياط الجديدة والمنصورة الجديدة: متوسط سعر المتر لكل حي محسوب من العقارات المعروضة فعلاً الآن (السكني والتجاري منفصلين)، مع نطاق أسعار كل نوع عقار.",
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
      "كل الأرقام في هذه الصفحة محسوبة آلياً من العقارات المعروضة للبيع فعلاً على الموقع الآن: سعر المتر لكل عقار = السعر ÷ المساحة، والمتوسط يُحسب لكل فئة على حدة (السكني منفصل عن التجاري) حتى لا يرفع سعر المحلات متوسط الشقق. لا نعرض متوسطاً من أقل من 3 وحدات، ونستبعد الإعلانات التي بها خطأ واضح في المساحة أو السعر. الأرقام أسعار طلب وليست أسعار تنفيذ، وتتحدث تلقائياً مع كل تغيير في المعروض.",
  },
  {
    question: "لماذا يختلف سعر المتر من حي لآخر؟",
    answer:
      "ثلاثة عوامل رئيسية: اكتمال الخدمات حول الوحدة، الموقع والقرب من البحر أو المحاور الرئيسية، ومستوى التشطيب السائد في الحي. والوحدات التجارية (محلات وعيادات ومقرات) سعر مترها أعلى بكثير من السكني في نفس الحي، لذلك نعرضهما منفصلين.",
  },
  {
    question: "هل الأسعار قابلة للتفاوض؟",
    answer:
      "غالباً نعم — خاصة في الدفع كاش حيث يقبل كثير من الملاك خصماً مقابل السداد الفوري. تواصل معنا على 01500775974 وسنساعدك في التفاوض على الوحدة التي تناسبك.",
  },
];

function range(min: number, max: number): string {
  if (!min) return "—";
  return min === max ? formatNumber(min) : `${formatNumber(min)} – ${formatNumber(max)}`;
}

function CityPriceTable({ city, accent }: { city: CitySnapshot; accent: "orange" | "emerald" }) {
  if (city.districts.length === 0) return null;
  const sqm = (d: CitySnapshot["districts"][number], label: string) => {
    const g = d.stats.sqmGroups.find((x) => x.label === label);
    return g ? `${formatNumber(g.avg)} (${g.count})` : "—";
  };
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm mb-4">
      <table className="w-full border-collapse bg-white text-sm md:text-base">
        <caption className="sr-only">
          المعروض ومتوسط سعر المتر ونطاق الأسعار لكل حي في {city.name}
        </caption>
        <thead className={accent === "orange" ? "bg-orange-600 text-white" : "bg-emerald-600 text-white"}>
          <tr>
            <th scope="col" className="p-4 text-right">الحي</th>
            <th scope="col" className="p-4 text-right">المعروض</th>
            <th scope="col" className="p-4 text-right">متوسط متر السكني (عدد الوحدات)</th>
            <th scope="col" className="p-4 text-right">متوسط متر التجاري (عدد الوحدات)</th>
            <th scope="col" className="p-4 text-right">نطاق الأسعار (جنيه)</th>
          </tr>
        </thead>
        <tbody>
          {city.districts.map((d, i) => (
            <tr key={d.slug} className={`border-b ${i % 2 ? "bg-gray-50" : ""}`}>
              <th scope="row" className="p-4 font-semibold text-right">
                <Link
                  href={`/${city.id}/${d.slug}`}
                  className={accent === "orange" ? "text-orange-700 hover:underline" : "text-emerald-700 hover:underline"}
                >
                  {d.name}
                </Link>
              </th>
              <td className="p-4">{d.stats.count}</td>
              <td className="p-4 font-semibold">{sqm(d, "الوحدات السكنية")}</td>
              <td className="p-4 font-semibold">{sqm(d, "الوحدات التجارية والإدارية")}</td>
              <td className="p-4" dir="ltr">{range(d.stats.minPrice, d.stats.maxPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const TYPE_ROWS: TypeGroupKey[] = ["apartments", "villas", "shops", "clinics", "lands", "chalets"];

export default async function PricesPage() {
  const all = await getPropertiesServer();
  const snapshot = buildMarketSnapshot(all);
  const [nd, nm] = snapshot.cities;
  const ndFacts = buildCityFacts(all, "new-damietta");
  const nmFacts = buildCityFacts(all, "new-mansoura");
  const live = available(all);
  const faqSchema = buildFaqSchema(PRICES_FAQ);
  const updatedAt = formatArabicDate(snapshot.asOf);

  // خلية "النوع × المدينة": العدد ونطاق السعر، والمتوسط فقط إذا كفت الوحدات
  const typeCell = (key: TypeGroupKey, cityId: string) => {
    const g = groupFacts(inCity(inGroup(live, key), cityId));
    if (g.count === 0) return "لا يوجد معروض حالياً";
    const avg = g.sqm && g.sqm.count >= MIN_POINTS ? ` — متوسط المتر ${formatNumber(g.sqm.avg)}` : "";
    return `العدد ${g.count} — ${range(g.minPrice, g.maxPrice)} جنيه${avg}`;
  };

  // Dataset: الصفحة جدول بيانات فعلي (متوسطات أسعار طلب) — يعرّفه لمحركات البحث والإجابة كمصدر أرقام قابل للاقتباس
  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${SITE_URL}/prices/#dataset`,
    name: "متوسط أسعار العقارات المعروضة للبيع في دمياط الجديدة والمنصورة الجديدة حسب الحي",
    description:
      "متوسط سعر المتر (السكني والتجاري منفصلين) ونطاق الأسعار وعدد العقارات المعروضة لكل حي في دمياط الجديدة والمنصورة الجديدة، محسوبة من إعلانات البيع النشطة على التيسير للعقارات. أسعار طلب بالجنيه المصري.",
    url: `${SITE_URL}/prices/`,
    inLanguage: "ar-EG",
    dateModified: snapshot.asOf,
    isAccessibleForFree: true,
    creator: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    spatialCoverage: [
      { "@type": "City", name: "دمياط الجديدة" },
      { "@type": "City", name: "المنصورة الجديدة" },
    ],
    variableMeasured: ["متوسط سعر المتر المربع (جنيه مصري)", "نطاق أسعار الطلب (جنيه مصري)", "عدد العقارات المعروضة"],
    measurementTechnique: "السعر ÷ المساحة لكل إعلان بيع نشط، ثم المتوسط لكل حي وفئة؛ لا يُنشر متوسط من أقل من 3 وحدات للمدينة",
    distribution: [
      { "@type": "DataDownload", encodingFormat: "text/plain", contentUrl: `${SITE_URL}/llms-full.txt` },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
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
                متوسطات محسوبة من {snapshot.total} عقاراً معروضاً فعلاً — آخر تحديث:{" "}
                <time dateTime={snapshot.asOf}>{updatedAt}</time>
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-10 max-w-5xl">
        {/* إجابة مباشرة أولاً (AEO) — كل رقم فيها من البيانات */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-10 border-r-4 border-orange-500 space-y-3">
          <p className="prices-summary text-gray-700 leading-loose">
            <strong>
              <Link href="/new-damietta" className="text-orange-600 hover:underline">دمياط الجديدة</Link>:
            </strong>{" "}
            {sqmAnswer(ndFacts)}
          </p>
          <p className="prices-summary text-gray-700 leading-loose">
            <strong>
              <Link href="/new-mansoura" className="text-emerald-600 hover:underline">المنصورة الجديدة</Link>:
            </strong>{" "}
            {sqmAnswer(nmFacts)}
          </p>
        </div>

        {/* جداول حية */}
        {nd.districts.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              متوسط سعر المتر بأحياء دمياط الجديدة
            </h2>
            <CityPriceTable city={nd} accent="orange" />
            <p className="text-sm text-gray-500">
              محسوب من {nd.stats?.count ?? 0} عقاراً معروضاً حالياً — متوسط المتر بالجنيه، وبين القوسين عدد الوحدات الداخلة في الحساب. اضغط اسم الحي لتصفح عقاراته.
            </p>
          </section>
        )}

        {nm.districts.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              متوسط سعر المتر بأحياء المنصورة الجديدة
            </h2>
            <CityPriceTable city={nm} accent="emerald" />
            <p className="text-sm text-gray-500">
              محسوب من {nm.stats?.count ?? 0} عقاراً معروضاً حالياً — متوسط المتر بالجنيه، وبين القوسين عدد الوحدات.
            </p>
          </section>
        )}

        {/* حسب نوع العقار — من المعروض الفعلي (كان جدولاً ثابتاً بأرقام لا تطابق أي إعلان) */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            الأسعار المعروضة حسب نوع العقار
          </h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full border-collapse bg-white text-sm md:text-base">
              <caption className="sr-only">عدد المعروض ونطاق الأسعار ومتوسط سعر المتر لكل نوع عقار في المدينتين</caption>
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th scope="col" className="p-4 text-right">النوع</th>
                  <th scope="col" className="p-4 text-right">دمياط الجديدة</th>
                  <th scope="col" className="p-4 text-right">المنصورة الجديدة</th>
                </tr>
              </thead>
              <tbody>
                {TYPE_ROWS.map((key, i) => (
                  <tr key={key} className={`border-b ${i % 2 ? "bg-gray-50" : ""}`}>
                    <th scope="row" className="p-4 font-semibold text-right">{TYPE_GROUPS[key].label}</th>
                    <td className="p-4">{typeCell(key, "new-damietta")}</td>
                    <td className="p-4">{typeCell(key, "new-mansoura")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            متوسط المتر يظهر فقط إذا توفرت 3 وحدات أو أكثر من النوع في المدينة.
          </p>
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
