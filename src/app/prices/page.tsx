import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { TrendingUp, LineChart } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { Freshness } from "@/components/Freshness";
import { AnswerSection, FaqList } from "@/components/Answers";
import { getPropertiesForIsr } from "@/lib/serverProperties";
import { getDistrictSlug } from "@/lib/districtSlugs";
import { answersFor, faqFrom } from "@/lib/answers";
import {
  GROUP_LABEL,
  computePriceStats,
  cityRows,
  fmtN,
  toPriceInput,
  type PriceRow,
  type PriceStats,
  type TypeGroup,
} from "@/lib/seo/prices";
import { ID, breadcrumbNode, cityId, faqNode, graph, pageUrl, ref, webPage } from "@/lib/seo/schema";
import { IN_LANGUAGE, SITE_NAME } from "@/lib/seo/owner-flags";
import { cairoDate, cairoIso } from "@/lib/seo/time";
import { apartments as aptCount } from "@/lib/answers/format";
import { PlatformLink } from "@/lib/bw/platformLinks";

// ISR كل 5 دقائق — وسيط سعر المتر من العقارات المعروضة فعلاً (spec-final A0.3 / A2.2)
export const revalidate = 300;

const PATH = "/prices/";
const TITLE = "أسعار العقارات اليوم في دمياط الجديدة والمنصورة الجديدة";
const DESCRIPTION =
  "وسيط سعر المتر لكل حي ونوع عقار في دمياط الجديدة والمنصورة الجديدة، محسوب من العقارات المعروضة للبيع فعلًا، مع عدد العقارات ونطاق السعر وتاريخ آخر تحديث للبيانات.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "أسعار العقارات دمياط الجديدة",
    "أسعار الشقق في دمياط الجديدة",
    "سعر المتر في دمياط الجديدة",
    "سعر متر الأرض في دمياط الجديدة",
    "أسعار العقارات المنصورة الجديدة",
    "سعر المتر في المنصورة الجديدة",
  ],
  openGraph: {
    title: "أسعار العقارات اليوم | دمياط الجديدة والمنصورة الجديدة",
    description: "وسيط سعر المتر لكل حي ونوع عقار — محسوب من العقارات المعروضة فعلًا ويتحدث تلقائيًا",
    url: "https://eltaiseer.com/prices/",
    type: "website",
    locale: "ar_EG",
    siteName: SITE_NAME,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "https://eltaiseer.com/prices/",
  },
};

const CITIES = [
  { slug: "new-damietta", name: "دمياط الجديدة", accent: "orange" as const, apt: "Q166", land: "Q165" },
  { slug: "new-mansoura", name: "المنصورة الجديدة", accent: "emerald" as const, apt: "Q176", land: "Q175" },
];
const FAQ_ORDER = ["Q166", "Q165", "Q176", "Q175", "M-PR-01", "M-PR-02"];
const OTHER_GROUPS: TypeGroup[] = ["villa", "commercial", "chalet"];

const METHOD_STEPS = [
  "نأخذ كل إعلان بيع نشط على التيسير.",
  "نحسب سعر المتر = السعر ÷ المساحة.",
  "نفصل الأنواع: شقق، فيلات، محلات ومقرات وعيادات، أراضٍ، شاليهات.",
  "نستبعد القيم خارج النطاق المنطقي لكل نوع ونراجعها يدويًا.",
  "نعرض الوسيط لا المتوسط، حتى لا يرفعه إعلان واحد شاذ.",
  "لا نعرض أي خانة من أقل من 3 عقارات.",
  "«آخر تحديث» هو تاريخ آخر تغيير في الإعلانات، لا تاريخ فتح الصفحة.",
];

const isBwDistrict = (d: string) => d.startsWith("بيت الوطن");
const priceRange = (r: PriceRow) =>
  r.minPrice === r.maxPrice ? `${fmtN(r.minPrice)} جنيه` : `${fmtN(r.minPrice)} – ${fmtN(r.maxPrice)} جنيه`;

/** جدول صفوف (حي × نوع) لمدينة واحدة؛ المعرّف {districtSlug} لأول صف للحي في الصفحة كلها */
function PriceTable({
  rows,
  citySlug,
  caption,
  accent,
  seen,
}: {
  rows: PriceRow[];
  citySlug: string;
  caption: string;
  accent: "orange" | "emerald";
  seen: Set<string>;
}) {
  if (rows.length === 0) return null;
  const hasBw = rows.some((r) => isBwDistrict(r.district));
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm my-4">
      <table className="w-full border-collapse bg-white text-sm md:text-base">
        <caption className="text-right text-sm text-gray-600 p-3">
          {caption}
          {hasBw && " أحياء سكنية تحمل اسم بيت الوطن."}
          {hasBw && (
            <PlatformLink path="/baitelwatan/prices/" className="underline">
              {" "}
              سعر المتر الرسمي في كراسة المرحلة 11
            </PlatformLink>
          )}
        </caption>
        <thead className={accent === "orange" ? "bg-orange-600 text-white" : "bg-emerald-600 text-white"}>
          <tr>
            <th scope="col" className="p-3 text-right">الحي</th>
            <th scope="col" className="p-3 text-right">نوع العقار</th>
            <th scope="col" className="p-3 text-right">عدد العقارات</th>
            <th scope="col" className="p-3 text-right">وسيط سعر المتر</th>
            <th scope="col" className="p-3 text-right">نطاق السعر</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const slug = getDistrictSlug(r.district);
            const first = !seen.has(slug);
            seen.add(slug);
            return (
              <tr key={`${slug}-${r.group}`} id={first ? slug : `${slug}-${r.group}`} className={`border-b ${i % 2 ? "bg-gray-50" : ""}`}>
                <th scope="row" className="p-3 text-right font-semibold">
                  <Link
                    href={`/${citySlug}/${slug}/`}
                    prefetch={false}
                    className={accent === "orange" ? "text-orange-700 hover:underline" : "text-emerald-700 hover:underline"}
                  >
                    {isBwDistrict(r.district) ? `${r.district} (حي سكني بدمياط الجديدة)` : r.district}
                  </Link>
                </th>
                <td className="p-3">{GROUP_LABEL[r.group]}</td>
                <td className="p-3">{fmtN(r.n)}</td>
                <td className="p-3 font-semibold whitespace-nowrap">{fmtN(r.medianPpm)} جنيه/م²</td>
                <td className="p-3 whitespace-nowrap">{priceRange(r)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function lede(stats: PriceStats): string {
  const part = (slug: string, name: string) => {
    const g = stats.cityGroup[slug]?.apartment;
    return g && g.medianPpm !== null
      ? `${fmtN(g.medianPpm)} جنيه في ${name} (من ${aptCount(g.n)})`
      : `عدد الشقق المعروضة في ${name} أقل من 3 فلا نحسب لها وسيطًا`;
  };
  const date = stats.dataModified ? `، حتى ${cairoDate(stats.dataModified)}` : "";
  return `الخلاصة: وسيط سعر متر الشقق المعروضة للبيع على التيسير ${part("new-damietta", "دمياط الجديدة")}، و${part(
    "new-mansoura",
    "المنصورة الجديدة"
  )}${date}. نحسب الوسيط لكل حي ونوع عقار عند وجود 3 عقارات على الأقل، ونستبعد القيم غير المنطقية. هذه أسعار طلب من البائعين وليست أسعار بيع منفذة.`;
}

export default async function PricesPage() {
  const all = await getPropertiesForIsr();
  const stats = computePriceStats(all.map(toPriceInput));
  const data = { prices: stats, dataModified: stats.dataModified };
  const byId = new Map(answersFor(PATH, data, [...FAQ_ORDER, "M-PR-03"]).map((a) => [a.id, a]));
  const faqItems = FAQ_ORDER.map((id) => byId.get(id)).filter((a): a is NonNullable<typeof a> => !!a);
  const seen = new Set<string>();
  const modifiedIso = stats.dataModified ? cairoIso(stats.dataModified) : undefined;
  // stats.excluded لا يُعرض: قيم غير منطقية تُراجع يدويًا من لوحة التحكم

  const faq = faqNode(PATH, faqFrom(faqItems));
  const pageGraph = graph(
    webPage({
      path: PATH,
      name: TITLE,
      description: DESCRIPTION,
      about: [ref(cityId("new-damietta")), ref(cityId("new-mansoura"))],
      mainEntity: ref(`${pageUrl(PATH)}#dataset`),
      hasPart: faq ? [ref(`${pageUrl(PATH)}#faq`)] : undefined,
      dateModified: modifiedIso,
    }),
    {
      "@type": "Dataset",
      "@id": `${pageUrl(PATH)}#dataset`,
      name: "وسيط أسعار الطلب للعقارات المعروضة على التيسير في دمياط الجديدة والمنصورة الجديدة",
      description:
        "وسيط سعر المتر ونطاق السعر لكل حي ونوع عقار (شقق، فيلات، محلات ومقرات، أراضٍ، شاليهات) في دمياط الجديدة والمنصورة الجديدة، محسوب آليًا من إعلانات البيع النشطة على eltaiseer.com. لا تُعرض أي خانة من أقل من 3 عقارات، وتُستبعد القيم غير المنطقية قبل الحساب. هذه أسعار طلب من البائعين وليست أسعار بيع منفذة، والمعلومات للاسترشاد وليست نصيحة مالية.",
      url: pageUrl(PATH),
      inLanguage: IN_LANGUAGE,
      isAccessibleForFree: true,
      creator: ref(ID.organization),
      publisher: ref(ID.organization),
      spatialCoverage: [ref(cityId("new-damietta")), ref(cityId("new-mansoura"))],
      ...(modifiedIso ? { temporalCoverage: modifiedIso.slice(0, 10), dateModified: modifiedIso } : {}),
      variableMeasured: [
        { "@type": "PropertyValue", name: "وسيط سعر المتر المعروض", unitText: "EGP/m²" },
        { "@type": "PropertyValue", name: "عدد العقارات المعروضة", unitText: "عقار" },
        { "@type": "PropertyValue", name: "نطاق السعر المعروض", unitText: "EGP" },
      ],
      measurementTechnique:
        "لكل إعلان بيع نشط: السعر ÷ المساحة، ثم الوسيط لكل حي ونوع عقار عند وجود 3 إعلانات على الأقل بعد استبعاد القيم خارج النطاق المنطقي لكل نوع.",
      includedInDataCatalog: ref(ID.datacatalog),
    },
    faq,
    breadcrumbNode(PATH, [
      { name: "الرئيسية", path: "/" },
      { name: "أسعار العقارات", path: PATH },
    ])
  );

  const method = byId.get("M-PR-01");

  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLd graph={pageGraph} />
      <Header />

      <Breadcrumb items={[{ label: "الرئيسية", href: "/" }, { label: "أسعار العقارات" }]} path={PATH} schema={false} />

      {/* Hero */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-orange-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-3 mb-2">
            <LineChart className="h-10 w-10 text-orange-400 shrink-0" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{TITLE}</h1>
              <p className="answer-lede text-gray-200 mt-3 leading-loose max-w-4xl">{lede(stats)}</p>
              <Freshness
                data={stats.dataModified}
                dataLabel="وسيط محسوب من العقارات المعروضة فعلًا · آخر تحديث للبيانات"
                className="freshness text-sm text-gray-300 mt-2"
              />
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-10 max-w-5xl space-y-12">
        {CITIES.map((c) => {
          const apt = byId.get(c.apt);
          const land = byId.get(c.land);
          return (
            <section key={c.slug} id={c.slug} className="space-y-10 scroll-mt-24">
              {apt && (
                <AnswerSection item={apt}>
                  <PriceTable
                    rows={cityRows(stats, c.slug, ["apartment"])}
                    citySlug={c.slug}
                    caption={`وسيط سعر متر الشقق لكل حي في ${c.name} (3 شقق على الأقل)`}
                    accent={c.accent}
                    seen={seen}
                  />
                </AnswerSection>
              )}
              {land && (
                <AnswerSection item={land}>
                  <PriceTable
                    rows={cityRows(stats, c.slug, ["land"])}
                    citySlug={c.slug}
                    caption={`وسيط سعر متر الأراضي لكل حي في ${c.name} (3 قطع على الأقل)`}
                    accent={c.accent}
                    seen={seen}
                  />
                </AnswerSection>
              )}
            </section>
          );
        })}

        <section id="other-types" className="scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">كم سعر الفيلات والمحلات والشاليهات؟</h2>
          {CITIES.map((c) => {
            const rows = cityRows(stats, c.slug, OTHER_GROUPS);
            return rows.length > 0 ? (
              <PriceTable
                key={c.slug}
                rows={rows}
                citySlug={c.slug}
                caption={`وسيط سعر المتر للفيلات والمحلات والمقرات والشاليهات في ${c.name}`}
                accent={c.accent}
                seen={seen}
              />
            ) : (
              <p key={c.slug} className="text-gray-700 mb-2">
                {c.name}: لا يوجد الآن 3 عروض على الأقل من هذا النوع في حي واحد.
              </p>
            );
          })}
        </section>

        <p className="text-sm text-gray-600">المعلومات للاسترشاد وليست نصيحة مالية أو استثمارية.</p>

        {method && (
          <AnswerSection item={method}>
            <ol className="list-decimal pr-6 space-y-1 text-gray-700 mt-2">
              {METHOD_STEPS.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </AnswerSection>
        )}

        <FaqList
          items={["M-PR-02", "M-PR-03"].map((id) => byId.get(id)).filter((a): a is NonNullable<typeof a> => !!a)}
          title="أسئلة شائعة عن الأسعار"
          id="faq"
          className="bg-white rounded-xl p-6 md:p-8 shadow-sm"
        />

        <aside className="rounded-xl bg-white border border-gray-200 p-5 text-gray-700">
          هذه الصفحة لعقارات دمياط الجديدة والمنصورة الجديدة المعروضة على الموقع. لإعلانات إعادة بيع أراضي بيت الوطن
          الموثّقة:{" "}
          <Link href="/beit-al-watan-for-sale/" className="text-orange-700 underline">
            أراضي بيت الوطن للبيع
          </Link>
          .
        </aside>

        {/* CTA */}
        <div className="text-center bg-gradient-to-l from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
          <TrendingUp className="h-10 w-10 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">عايز تعرف عقارك يساوي كام؟</h2>
          <p className="text-orange-100 mb-5">نقارن عقارك بوسيط سعر المتر لنفس النوع في نفس الحي</p>
          <Button asChild size="lg" variant="secondary" className="font-bold">
            <Link href="/valuation">تقييم مجاني لعقارك</Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
