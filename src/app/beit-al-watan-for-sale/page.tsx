import { Metadata } from "next";
import { bwMeta } from "@/lib/bw/meta";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Disclaimer, ListingCard, LiveStamp, OfficialTable, TrustStrip } from "@/components/bw/BwParts";
import { resaleModified, verifiedIso } from "@/lib/bw/modified";
import { Freshness } from "@/components/Freshness";
import { getActiveListings, getSoldListings } from "@/lib/bw/listings";
import { getBwLive } from "@/lib/bw/live";
import { adsCount, fmtUsd, isLive, listingPath, marketByCity } from "@/lib/bw/calc";
import { cityName } from "@/lib/bw/cities";
import { MARKET_WINDOW_DAYS, type BwListing } from "@/lib/bw/types";
import { BW_BASE, ELIGIBILITY_CAVEAT, NO_DEPOSIT_LINE } from "@/lib/bw/constants";
import { BrandPlatformLink, PlatformLink, platformLive } from "@/lib/bw/platformLinks";
import { JsonLd } from "@/components/JsonLd";
import { AnswerSection, FaqList, TeaserLinks } from "@/components/Answers";
import { answersFor, faqFrom, teaser } from "@/lib/answers";
import { hubLede } from "@/lib/answers/resale";
import { fmtN, plots } from "@/lib/answers/format";
import {
  ID,
  IN_LANGUAGE,
  ORG,
  REG,
  breadcrumbNode,
  cityId,
  faqNode,
  graph,
  itemListNode,
  node,
  pageUrl,
  ref,
  webPage,
} from "@/lib/seo/schema";
import { cairoDateTime, cairoDay, cairoIso, maxIso } from "@/lib/seo/time";
import { editorialIso } from "@/lib/seo/editorial";
import { BOOKED_MIN_DISPLAY } from "@/lib/seo/owner-flags";

// الإعلانات من Firestore كل 5 دقائق؛ الأرقام الحية من المنصة لها ذاكرتها الخاصة (6 ساعات)
export const revalidate = 300;

const TITLE = "أراضي بيت الوطن للبيع: إعلانات موثّقة ومقارنة بالسعر الرسمي";
const DESC =
  "قطع أراضي بيت الوطن المخصصة من كل المراحل، ومنها المرحلة 11 بعد التخصيص، للبيع بالتنازل بعد مراجعة المستندات والمعاينة، مع كارت تكلفة كامل ومقارنة بسعر الهيئة الرسمي من بيانات حية. لا نستلم أي مبالغ بين البائع والمشتري.";

export const metadata: Metadata = bwMeta({ title: TITLE, description: DESC, path: `${BW_BASE}/`, absoluteTitle: true });

const PATH = `${BW_BASE}/`;
const PAGE_URL = pageUrl(PATH);
const DAY = 86400e3;

// المحور يملك هذه الأسئلة (faq-owners.json). أقسام بعنوان سؤال بترتيب الصفحة، ثم الأسئلة الشائعة الأصلية.
// Q103 (رسوم التنازل) وQ104 (العقد) وQ115 معلّقة حتى تأكيد الجهاز/المحامي: لا تُعرض ولا تدخل JSON-LD.
const SECTIONS = ["Q099", "Q118", "Q105", "Q102", "Q103", "Q104"] as const;
// «كيف تتأكدون أن الإعلان حقيقي؟» (كان M-RS-02) رابط إلى مالك نية التوثيق: how-we-verify/#verified-meaning
const FAQ_ITEMS = ["Q113", "Q114", "M-RS-01", "M-RS-05", "Q115"];
// FAQPage (≤ 6، spec-final A2.5): الأقسام الأربعة ثم Q113 وQ114؛ بقية الأسئلة مرئية بلا Question
const FAQ_SCHEMA = ["Q099", "Q118", "Q105", "Q102", "Q113", "Q114"];

/** تاريخ نقطة السعر في السوق: البيع للمباع، والتوثيق للنشط (كما في marketByCity) */
function marketPointIso(l: BwListing): string | null {
  if (l.status === "sold" && l.soldAt) return maxIso([l.soldAt]);
  return verifiedIso(l.verifiedAt);
}

export default async function BeitAlWatanForSalePage() {
  const now = Date.now();
  const [active, sold, live] = await Promise.all([getActiveListings(), getSoldListings(), getBwLive()]);
  const listings = active.filter((l) => isLive(l, now)).sort((a, b) => b.verifiedAt.localeCompare(a.verifiedAt));
  const counts: Record<string, number> = {};
  for (const l of listings) counts[l.citySlug] = (counts[l.citySlug] || 0) + 1;
  const marketInput = [...listings, ...sold];
  const market = marketByCity(marketInput, now);
  const marketCities = Object.values(market).sort((a, b) => cityName(a.citySlug).localeCompare(cityName(b.citySlug), "ar"));

  const booked = live ? live.total - live.available : 0;
  const reviewed = editorialIso(PATH, "reviewed");
  const editedAt = editorialIso(PATH, "modified");
  // dateModified = lastmod في sitemap.xml (نفس الدالة): أحدث توثيق أو لقطة حية، وإلا التحريري
  const { lastVerified, liveAt, dateModified } = resaleModified(PATH, listings, live);
  const dataModified = lastVerified || liveAt;

  const byId = new Map(answersFor(PATH, {}, [...SECTIONS, ...FAQ_ITEMS]).map((a) => [a.id, a]));
  const section = (id: string) => byId.get(id);
  const faqItems = FAQ_ITEMS.map((id) => byId.get(id)).filter((a): a is NonNullable<typeof a> => !!a);
  const faq = faqNode(
    PATH,
    faqFrom(FAQ_SCHEMA.map((id) => byId.get(id)).filter((a): a is NonNullable<typeof a> => !!a))
  );

  // مجموعة بيانات سوق إعادة البيع: فقط حين توجد مدينة فيها 3 إعلانات على الأقل خلال 90 يومًا (spec-final A1.3).
  // لا مجموعة بيانات للسعر الرسمي هنا: مالكها /baitelwatan/prices/ (§0.4 row 5).
  const marketModified = marketCities.length
    ? maxIso(
        marketInput
          .filter((l) => market[l.citySlug])
          .map(marketPointIso)
          .filter((t): t is string => !!t && now - Date.parse(t) <= MARKET_WINDOW_DAYS * DAY)
      )
    : null;
  const coverage = marketCities.map((m) => cityId(m.citySlug)).filter((id) => REG.stubs[id]);
  const dataset = marketCities.length
    ? {
        "@type": "Dataset",
        "@id": `${PAGE_URL}#dataset-resale-market`,
        name: "سعر المتر الفعلي في إعلانات إعادة بيع أراضي بيت الوطن الموثّقة على التيسير",
        description:
          "وسيط التكلفة الفعلية للمتر (المسدَّد للهيئة + الأوفر + الأقساط المتبقية ÷ المساحة، ومعها المصروفات الإدارية التقديرية إن ذُكرت) في إعلانات إعادة بيع أراضي بيت الوطن الموثّقة على التيسير، لكل مدينة فيها 3 إعلانات على الأقل نشطة أو مباعة خلال 90 يومًا. أسعار طلب من البائعين وليست أسعارًا رسمية، والمعلومات للاسترشاد وليست نصيحة مالية. التيسير منصة مستقلة غير تابعة لهيئة المجتمعات العمرانية.",
        url: PAGE_URL,
        inLanguage: IN_LANGUAGE,
        isAccessibleForFree: true,
        creator: ORG,
        publisher: ORG,
        about: [ref(ID.serviceResale), ref(ID.program)],
        spatialCoverage: coverage.map(ref),
        temporalCoverage: `${cairoDay(new Date(now - MARKET_WINDOW_DAYS * DAY))}/${cairoDay(new Date(now))}`,
        ...(marketModified ? { dateModified: cairoIso(marketModified) } : {}),
        variableMeasured: [
          { "@type": "PropertyValue", name: "وسيط التكلفة الفعلية للمتر", unitText: "USD/m²" },
          { "@type": "PropertyValue", name: "عدد الإعلانات الموثّقة (نشطة ومباعة خلال 90 يومًا)", unitText: "إعلان" },
        ],
        measurementTechnique:
          "لكل إعلان موثّق: (المسدَّد للهيئة + الأوفر محوَّلًا بسعر التحويل المذكور في الإعلان + الأقساط المتبقية + المصروفات الإدارية التقديرية إن ذُكرت) ÷ المساحة، ثم الوسيط لكل مدينة عند وجود 3 إعلانات على الأقل خلال 90 يومًا.",
        includedInDataCatalog: ref(ID.datacatalog),
        ...(platformLive("/baitelwatan/prices/") ? { isBasedOn: ref(ID.pricesDataset) } : {}),
      }
    : null;

  const pageGraph = graph(
    webPage({
      path: PATH,
      type: "CollectionPage",
      name: TITLE,
      about: ref(ID.serviceResale),
      mainEntity: listings.length ? ref(`${PAGE_URL}#itemlist`) : undefined,
      hasPart: [...(faq ? [ref(`${PAGE_URL}#faq`)] : []), ...(dataset ? [ref(`${PAGE_URL}#dataset-resale-market`)] : [])],
      // بلا إعلانات ولا لقطة حية: آخر تعديل تحريري للصفحة (يظهر في <time> تحت عنوان الإعلانات)
      dateModified,
      lastReviewed: reviewed,
      reviewedBy: ORG,
    }),
    listings.length
      ? itemListNode(PATH, listings.slice(0, 30).map((l) => listingPath(l)), { total: listings.length })
      : null,
    node(ID.serviceResale, {
      serviceType: "وساطة إعادة بيع أراضي بيت الوطن بالتنازل الرسمي",
      areaServed: ref(ID.egypt),
      isRelatedTo: ref(ID.program),
      description:
        "لا نستلم أي مبالغ بين البائع والمشتري؛ الأوفر يُدفع للبائع عند التوقيع أمام جهاز المدينة، والعمولة يدفعها البائع بعد اعتماد التنازل.",
    }),
    dataset,
    faq,
    breadcrumbNode(PATH, [
      { name: "الرئيسية", path: "/" },
      { name: "أراضي بيت الوطن للبيع", path: PATH },
    ])
  );

  const q099 = section("Q099");
  const q118 = section("Q118");
  const q105 = section("Q105");
  const q102 = section("Q102");
  const q103 = section("Q103");
  const q104 = section("Q104");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Breadcrumb items={[{ label: "الرئيسية", href: "/" }, { label: "أراضي بيت الوطن للبيع" }]} path={PATH} schema={false} />
      <JsonLd graph={pageGraph} />

      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-emerald-900">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <p className="text-emerald-300 text-sm font-medium mb-2">وساطة موثّقة من التيسير للعقارات</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight max-w-3xl">أراضي بيت الوطن للبيع</h1>
          <p className="answer-lede text-gray-200 text-lg mt-4 max-w-3xl leading-relaxed">
            {hubLede({ n: listings.length, lastVerified, reviewed })}
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href={`${BW_BASE}/buy-request/`}>
              <Button className="bg-orange-600 hover:bg-orange-700 h-11 px-6 text-base">سجّل طلب شراء</Button>
            </Link>
            <Link href={`${BW_BASE}/sell/`}>
              <Button variant="outline" className="h-11 px-6 text-base bg-transparent text-white border-white/40 hover:bg-white/10 hover:text-white">
                عايز أبيع أرضي
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-10 space-y-12">
        <TrustStrip />

        <section aria-labelledby="p11-h" className="rounded-xl bg-white border border-emerald-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 id="p11-h" className="text-xl font-bold text-gray-900">المرحلة 11: ننشر إعلانات القطع المخصصة فقط</h2>
            <p className="text-gray-700 mt-1">
              لا ننشر إعلانًا لقطعة من المرحلة 11 قبل خطاب تخصيصها، وكود الحجز نفسه لا ينتقل لشخص آخر (كراسة الشروط ص3).
              {live && booked >= BOOKED_MIN_DISPLAY
                ? ` حُجز من طرح الهيئة في المرحلة 11 حتى الآن ${plots(booked)} حسب الرصد العام لموقع الهيئة (ليست حجوزات عبر التيسير).`
                : ""}
            </p>
          </div>
          <Link href={`${BW_BASE}/phase-11/`} className="shrink-0">
            <Button className="bg-emerald-600 hover:bg-emerald-700">بيع وشراء المرحلة 11</Button>
          </Link>
        </section>

        <section aria-labelledby="listings" className="scroll-mt-24">
          <div className="flex items-end justify-between gap-4 mb-4">
            <h2 id="listings" className="text-2xl font-bold text-gray-900">ما أراضي بيت الوطن المعروضة للبيع بالتنازل الآن؟</h2>
            {listings.length > 0 && <span className="text-sm text-gray-600 shrink-0">{adsCount(listings.length)}</span>}
          </div>
          {dataModified ? (
            <Freshness data={lastVerified} dataLabel="آخر توثيق لإعلان" className="freshness text-sm text-gray-500 mb-3" />
          ) : (
            <Freshness data={editedAt} dataLabel="آخر تحديث لهذه الصفحة" className="freshness text-sm text-gray-500 mb-3" />
          )}
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {listings.map((l) => (
                <ListingCard key={l.id} l={l} live={live} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <p className="text-lg font-bold text-gray-900">لا توجد إعلانات موثّقة منشورة الآن</p>
              <p className="text-gray-600 mt-2 max-w-xl mx-auto">
                ننشر الإعلان بعد اكتمال التوثيق فقط. سجّل طلب الشراء ونبلغك أول ما تُوثَّق قطعة في المدينة التي تريدها.
              </p>
              <Link href={`${BW_BASE}/buy-request/`} className="inline-block mt-4">
                <Button className="bg-orange-600 hover:bg-orange-700">سجّل طلب شراء</Button>
              </Link>
            </div>
          )}
        </section>

        {q099 && (
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <AnswerSection item={q099} />
          </div>
        )}

        {q118 && (
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <AnswerSection item={q118}>
              <p className="text-sm text-gray-600 mt-3 max-w-3xl">{ELIGIBILITY_CAVEAT}</p>
              {live ? (
                <div className="mt-4">
                  <OfficialTable live={live} counts={counts} caption="البديل: المتاح والسعر الرسمي في المرحلة 11 لكل مدينة" />
                  <p className="text-gray-700 mt-3">
                    المتاح من الهيئة {fmtN(live.available)} من {plots(live.total)} حتى{" "}
                    <time dateTime={liveAt || undefined}>{liveAt ? cairoDateTime(liveAt) : "آخر لقطة"}</time>، حسب رصد منصة «التيسير —
                    الحجز الذكي» لموقع الهيئة.
                  </p>
                  <LiveStamp live={live} />
                  <PlatformLink path="/baitelwatan/prices/" className="inline-block mt-2 text-emerald-700 font-semibold hover:underline">
                    جدول أسعار بيت الوطن
                  </PlatformLink>
                </div>
              ) : (
                <p className="text-gray-700 mt-3">
                  أرقام المتاح الحية غير متاحة في هذه اللحظة؛ تابعها لحظيًا في أداة <BrandPlatformLink className="text-emerald-700 underline" />.
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">المعلومات للاسترشاد وليست نصيحة مالية أو استثمارية.</p>
            </AnswerSection>
          </div>
        )}

        {marketCities.length > 0 && (
          <section aria-labelledby="market" className="scroll-mt-24">
            <h2 id="market" className="text-2xl font-bold text-gray-900 mb-2">سعر المتر في إعلانات إعادة البيع الموثّقة (بالتنازل)</h2>
            <p className="text-gray-600 mb-4">
              التكلفة الفعلية للمتر شاملة الأوفر، من الإعلانات النشطة والمباعة خلال آخر {MARKET_WINDOW_DAYS} يومًا. تظهر المدينة من 3 إعلانات
              فأكثر. أسعار طلب من البائعين وليست أسعارًا رسمية، والمعلومات للاسترشاد وليست نصيحة مالية أو استثمارية.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketCities.map((m) => (
                <div key={m.citySlug} className="rounded-xl border border-gray-200 bg-white p-4">
                  <p className="font-bold text-gray-900">{cityName(m.citySlug)}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1" dir="ltr" style={{ textAlign: "right" }}>{fmtUsd(m.medianPerM2Usd)}</p>
                  <p className="text-sm text-gray-600">
                    وسيط التكلفة للمتر من {adsCount(m.n)}، والمدى <span dir="ltr">{fmtUsd(m.minPerM2Usd)}–{fmtUsd(m.maxPerM2Usd)}</span>
                  </p>
                  {live?.cities[m.citySlug] && (
                    <p className="text-sm text-emerald-700 mt-1">
                      الرسمي في المرحلة 11: <span dir="ltr">{fmtUsd(live.cities[m.citySlug].ppmMedian)}</span> للمتر
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {q105 && (
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <AnswerSection item={q105} />
          </div>
        )}

        {q102 && (
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <AnswerSection item={q102}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">لو أنت مشترٍ</h3>
                  <ol className="list-decimal pr-5 space-y-2 text-gray-700">
                    <li>اختر إعلانًا وراجع كارت التكلفة والمقارنة بالسعر الرسمي.</li>
                    <li>نتحقق من هويتك، ثم نكشف لك رقم القطعة لتتحقق منها بنفسك في جهاز المدينة.</li>
                    <li>التوقيع أمام الجهاز، والأوفر يُدفع للبائع مباشرة. {NO_DEPOSIT_LINE}</li>
                  </ol>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">لو أنت بائع</h3>
                  <ol className="list-decimal pr-5 space-y-2 text-gray-700">
                    <li>املأ طلب البيع، ونتواصل معك لطلب المستندات.</li>
                    <li>نراجع التخصيص والسداد وحسابك على بوابة الهيئة، ونعاين القطعة ونصورها.</li>
                    <li>بعد عقد الوساطة ننشر الإعلان بختم التوثيق. العمولة لا تُستحق إلا بعد اعتماد التنازل.</li>
                  </ol>
                  <Link href={`${BW_BASE}/how-we-verify/`} className="inline-block mt-4 text-orange-600 font-semibold hover:underline">
                    كيف نوثّق الإعلانات
                  </Link>
                </div>
              </div>
            </AnswerSection>
          </div>
        )}

        {q103 && (
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <AnswerSection item={q103} />
          </div>
        )}
        {q104 && (
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <AnswerSection item={q104} />
          </div>
        )}

        <FaqList items={faqItems} title="أسئلة شائعة" id="faq" className="" />
        <TeaserLinks
          title="أسئلة تجيب عنها صفحات أخرى"
          items={[
            teaser("Q101", "هل يجوز بيع كود الحجز أو المسلسل؟"),
            teaser("M-HV-02", "كيف تتأكدون أن الإعلان حقيقي؟"),
            teaser("Q112", "كيف تتأكد أن إعلان أرض بيت الوطن ليس نصبًا؟"),
          ]}
        />

        <section className="rounded-xl bg-emerald-50 border border-emerald-200 p-6">
          <h2 className="text-xl font-bold text-gray-900">تحجز أرضًا جديدة من الهيئة؟</h2>
          <p className="text-gray-700 mt-2">
            أداة «التيسير — الحجز الذكي» مجانية للحاجزين ومستقلة: تتابع المتاح لحظيًا في كل المدن، وتنبهك قبل نوافذ التسجيل.
          </p>
          <p className="text-gray-700 mt-2">
            الحجز نفسه يتم فقط على{" "}
            <a href="https://lands.nuca.gov.eg/" rel="noopener" className="text-emerald-700 underline">
              الموقع الرسمي للحجز (هيئة المجتمعات العمرانية)
            </a>
            .
          </p>
          <BrandPlatformLink className="inline-block mt-3 text-emerald-700 font-semibold hover:underline" />
        </section>

        <Disclaimer />
      </main>
      <Footer />
    </div>
  );
}
