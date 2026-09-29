import { Metadata } from "next";
import { bwMeta } from "@/lib/bw/meta";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Disclaimer, ListingCard, LiveStamp, OfficialTable, TrustStrip, liveIso } from "@/components/bw/BwParts";
import { Freshness } from "@/components/Freshness";
import { getActiveListings, getSoldListings } from "@/lib/bw/listings";
import { getBwLive } from "@/lib/bw/live";
import { adsCount, fmtUsd, isLive, listingPath, marketByCity, plotsCount } from "@/lib/bw/calc";
import { cityName } from "@/lib/bw/cities";
import { BW_BASE, ELIGIBILITY_CAVEAT, NO_DEPOSIT_LINE } from "@/lib/bw/constants";
import { BrandPlatformLink, PlatformLink } from "@/lib/bw/platformLinks";
import { JsonLd } from "@/components/JsonLd";
import { FaqList, TeaserLinks } from "@/components/Answers";
import { answersFor, faqFrom, teaser } from "@/lib/answers";
import { ID, breadcrumbNode, faqNode, graph, itemListNode, node, pageUrl, ref, webPage } from "@/lib/seo/schema";
import { cairoIso, cairoLocalToIso, maxIso } from "@/lib/seo/time";
import { BOOKED_MIN_DISPLAY } from "@/lib/seo/owner-flags";

// الإعلانات من Firestore كل 5 دقائق؛ الأرقام الحية من المنصة لها ذاكرتها الخاصة (6 ساعات)
export const revalidate = 300;

const TITLE = "أراضي بيت الوطن للبيع: إعلانات موثّقة ومقارنة بالسعر الرسمي";
const DESC =
  "قطع أراضي بيت الوطن المخصصة من كل المراحل، ومنها المرحلة 11 بعد التخصيص، للبيع بالتنازل بعد مراجعة المستندات والمعاينة، مع كارت تكلفة كامل ومقارنة بسعر الهيئة الرسمي من بيانات حية. لا نستلم أي مبالغ بين البائع والمشتري.";

export const metadata: Metadata = bwMeta({ title: TITLE, description: DESC, path: `${BW_BASE}/`, absoluteTitle: true });

const PATH = `${BW_BASE}/`;
// أسئلة يملكها المحور (faq-owners.json)؛ سؤال بيع كود الحجز مالكه صفحة المرحلة 11 فهنا رابط فقط
const HUB_ANSWERS = ["M-RS-01", "M-RS-02", "M-RS-03", "M-RS-04", "M-RS-05"];

function verifiedIso(d: string): string | null {
  try {
    return cairoLocalToIso(d.slice(0, 10));
  } catch {
    return null;
  }
}

export default async function BeitAlWatanForSalePage() {
  const now = Date.now();
  const [active, sold, live] = await Promise.all([getActiveListings(), getSoldListings(), getBwLive()]);
  const listings = active.filter((l) => isLive(l, now)).sort((a, b) => b.verifiedAt.localeCompare(a.verifiedAt));
  const counts: Record<string, number> = {};
  for (const l of listings) counts[l.citySlug] = (counts[l.citySlug] || 0) + 1;
  const market = marketByCity([...listings, ...sold], now);

  const booked = live ? live.total - live.available : 0;
  const faq = answersFor(PATH, {}, HUB_ANSWERS);
  const lastVerified = maxIso(listings.map((l) => verifiedIso(l.verifiedAt)));
  const dataModified = maxIso([lastVerified, live ? liveIso(live) : null]);
  const pageGraph = graph(
    webPage({
      path: PATH,
      type: "CollectionPage",
      name: TITLE,
      about: ref(ID.serviceResale),
      mainEntity: listings.length ? ref(`${pageUrl(PATH)}#itemlist`) : undefined,
      hasPart: [ref(`${pageUrl(PATH)}#faq`)],
      dateModified: dataModified ? cairoIso(dataModified) : undefined,
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
    faqNode(PATH, faqFrom(faq)),
    breadcrumbNode(PATH, [
      { name: "الرئيسية", path: "/" },
      { name: "أراضي بيت الوطن للبيع", path: PATH },
    ])
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Breadcrumb items={[{ label: "الرئيسية", href: "/" }, { label: "أراضي بيت الوطن للبيع" }]} path={PATH} schema={false} />
      <JsonLd graph={pageGraph} />

      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-emerald-900">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <p className="text-emerald-300 text-sm font-medium mb-2">وساطة موثّقة من التيسير للعقارات</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight max-w-3xl">أراضي بيت الوطن للبيع</h1>
          <p className="text-gray-200 text-lg mt-4 max-w-2xl leading-relaxed">
            قطع مخصصة أو متعاقد عليها من كل مراحل بيت الوطن، ومنها المرحلة 11 بعد خطاب التخصيص. راجعنا مستنداتها وعاينّاها قبل النشر،
            ومع كل إعلان حساب كامل للتكلفة ومقارنة بسعر الهيئة الرسمي من بياناتنا الحية.
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

        {(
          <section aria-labelledby="p11-h" className="rounded-xl bg-white border border-emerald-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 id="p11-h" className="text-xl font-bold text-gray-900">المرحلة 11: ننشر إعلانات القطع المخصصة فقط</h2>
              <p className="text-gray-700 mt-1">
                لا ننشر إعلانًا لقطعة من المرحلة 11 قبل خطاب تخصيصها، وكود الحجز نفسه لا ينتقل لشخص آخر (كراسة الشروط ص3).
                {live && booked >= BOOKED_MIN_DISPLAY
                  ? ` حُجز من طرح الهيئة في المرحلة 11 حتى الآن ${plotsCount(booked)} حسب الرصد العام لموقع الهيئة (ليست حجوزات عبر التيسير).`
                  : ""}
              </p>
            </div>
            <Link href={`${BW_BASE}/phase-11/`} className="shrink-0">
              <Button className="bg-emerald-600 hover:bg-emerald-700">بيع وشراء المرحلة 11</Button>
            </Link>
          </section>
        )}

        <section aria-labelledby="listings-h">
          <div className="flex items-end justify-between gap-4 mb-4">
            <h2 id="listings-h" className="text-2xl font-bold text-gray-900">الإعلانات الموثّقة</h2>
            {listings.length > 0 && <span className="text-sm text-gray-600">{adsCount(listings.length)}</span>}
          </div>
          <Freshness data={lastVerified} dataLabel="آخر توثيق لإعلان" className="freshness text-sm text-gray-500 mb-3" />
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

        {Object.keys(market).length > 0 && (
          <section aria-labelledby="market-h">
            <h2 id="market-h" className="text-2xl font-bold text-gray-900 mb-2">سعر السوق من إعلاناتنا الموثّقة</h2>
            <p className="text-gray-600 mb-4">التكلفة الفعلية للمتر شاملة الأوفر، من الإعلانات النشطة والمباعة خلال آخر 90 يومًا. تظهر المدينة من 3 إعلانات فأكثر.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(market).map((m) => (
                <div key={m.citySlug} className="rounded-xl border border-gray-200 bg-white p-4">
                  <p className="font-bold text-gray-900">{cityName(m.citySlug)}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1" dir="ltr" style={{ textAlign: "right" }}>{fmtUsd(m.medianPerM2Usd)}</p>
                  <p className="text-sm text-gray-600">
                    وسيط التكلفة للمتر من {adsCount(m.n)}، والمدى <span dir="ltr">{fmtUsd(m.minPerM2Usd)}–{fmtUsd(m.maxPerM2Usd)}</span>
                  </p>
                  {live?.cities[m.citySlug] && (
                    <p className="text-sm text-emerald-700 mt-1">
                      الرسمي في الطرح الحالي: <span dir="ltr">{fmtUsd(live.cities[m.citySlug].ppmMedian)}</span> للمتر
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {live && (
          <section aria-labelledby="official-h">
            <h2 id="official-h" className="text-2xl font-bold text-gray-900 mb-2">تكلفة البديل: الطرح الحالي من الهيئة</h2>
            <p className="text-gray-600 mb-4 max-w-3xl">
              لمن له مسلسل في المرحلة 11: قبل أن تدفع أوفر، قارن بسعر المتر الرسمي والمتاح من الهيئة في كل مدينة.
              <PlatformLink path="/baitelwatan/prices/" className="text-orange-600 underline">
                {" "}جدول أسعار بيت الوطن
              </PlatformLink>
            </p>
            <OfficialTable live={live} counts={counts} />
            <LiveStamp live={live} />
            <p className="text-sm text-gray-600 mt-2">{ELIGIBILITY_CAVEAT}</p>
          </section>
        )}

        <section aria-labelledby="how-h" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <h2 id="how-h" className="text-xl font-bold text-gray-900 mb-3">لو أنت مشترٍ</h2>
            <ol className="list-decimal pr-5 space-y-2 text-gray-700">
              <li>اختر إعلانًا وراجع كارت التكلفة والمقارنة بالسعر الرسمي.</li>
              <li>نتحقق من هويتك، ثم نكشف لك رقم القطعة لتتحقق منها بنفسك في جهاز المدينة.</li>
              <li>التوقيع أمام الجهاز، والأوفر يُدفع للبائع مباشرة. {NO_DEPOSIT_LINE}</li>
            </ol>
          </div>
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">لو أنت بائع</h2>
            <ol className="list-decimal pr-5 space-y-2 text-gray-700">
              <li>املأ طلب البيع، ونتواصل معك لطلب المستندات.</li>
              <li>نراجع التخصيص والسداد وحسابك على بوابة الهيئة، ونعاين القطعة ونصورها.</li>
              <li>بعد عقد الوساطة ننشر الإعلان بختم التوثيق. العمولة لا تُستحق إلا بعد اعتماد التنازل.</li>
            </ol>
            <Link href={`${BW_BASE}/how-we-verify/`} className="inline-block mt-4 text-orange-600 font-semibold hover:underline">
              كيف نوثّق الإعلانات
            </Link>
          </div>
        </section>

        <FaqList items={faq} title="أسئلة شائعة" id="faq" className="" />
        <TeaserLinks
          title="أسئلة تجيب عنها صفحات أخرى"
          items={[teaser("Q101", "هل يجوز بيع كود الحجز أو المسلسل؟")]}
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
