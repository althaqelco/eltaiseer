import { Metadata } from "next";
import { bwMeta } from "@/lib/bw/meta";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Disclaimer, ListingCard, LiveStamp, liveIso } from "@/components/bw/BwParts";
import { getActiveListings, getAllDemand } from "@/lib/bw/listings";
import { getBwLive } from "@/lib/bw/live";
import { adsCount, fmtUsd, isLive, requestsCount } from "@/lib/bw/calc";
import { isPhase11 } from "@/lib/bw/publish";
import { MIN_POINTS } from "@/lib/bw/types";
import { BW_BASE, ELIGIBILITY_CAVEAT, NO_DEPOSIT_LINE } from "@/lib/bw/constants";
import { BrandPlatformLink, PlatformLink } from "@/lib/bw/platformLinks";
import { JsonLd } from "@/components/JsonLd";
import { AnswerSection, FaqList } from "@/components/Answers";
import { answersFor, faqFrom } from "@/lib/answers";
import { P11_LEDE } from "@/lib/answers/resale";
import { ID, ORG, breadcrumbNode, faqNode, graph, pageUrl, ref, webPage } from "@/lib/seo/schema";
import { cairoDateTime, cairoIso, cairoLocalToIso, maxIso } from "@/lib/seo/time";
import { editorialIso } from "@/lib/seo/editorial";
import { Freshness } from "@/components/Freshness";

export const revalidate = 300;

const TITLE = "بيع أرض بيت الوطن المرحلة 11 بعد التخصيص";
const DESC =
  "ننشر إعلانات أرض بيت الوطن من المرحلة 11 بعد صدور خطاب تخصيصها، والبيع بالتنازل الرسمي بموافقة جهاز المدينة. المتاح والسعر الرسمي في كل مدينة من بيانات حية، وإعلانات موثّقة فقط.";

export const metadata: Metadata = bwMeta({ title: TITLE, description: DESC, path: `${BW_BASE}/phase-11/` });

const PATH = `${BW_BASE}/phase-11/`;
// Q100 وQ101 أقسام بعنوان سؤال؛ الباقي أسئلة شائعة. كلها على مالكها هنا (faq-owners.json)
const SECTION_ANSWERS = ["Q100", "Q101"];
const FAQ_ANSWERS = ["Q119", "M-P11-01", "M-P11-02"];

function verifiedIso(d: string): string | null {
  try {
    return cairoLocalToIso(d.slice(0, 10));
  } catch {
    return null;
  }
}

export default async function Phase11Page() {
  const now = Date.now();
  const [active, live, demand] = await Promise.all([getActiveListings(), getBwLive(), getAllDemand()]);
  const listings = active.filter((l) => isPhase11(l) && isLive(l, now)).sort((a, b) => b.verifiedAt.localeCompare(a.verifiedAt));
  const counts: Record<string, number> = {};
  for (const l of listings) counts[l.citySlug] = (counts[l.citySlug] || 0) + 1;
  // ترتيب محايد بالاسم، وبلا عمود «محجوز» (spec-final A0.4 / §0.4 row 6)
  const rows = live ? Object.values(live.cities).sort((a, b) => a.nameAr.localeCompare(b.nameAr, "ar")) : [];
  const snapshotIso = live ? liveIso(live) : null;
  // آخر تغيير في بيانات الصفحة: لقطة الأرقام الحية أو أحدث توثيق لإعلان من المرحلة 11، وإلا آخر تعديل تحريري (A3.2)
  const lastVerified = maxIso(listings.map((l) => verifiedIso(l.verifiedAt)));
  const dataModified = maxIso([snapshotIso, lastVerified]);
  const editedAt = editorialIso(PATH, "modified");

  const sections = answersFor(PATH, {}, SECTION_ANSWERS);
  const faq = answersFor(PATH, {}, FAQ_ANSWERS);
  const pageGraph = graph(
    webPage({
      path: PATH,
      name: TITLE,
      about: [ref(ID.serviceResale), ref(ID.phase11)],
      hasPart: [ref(`${pageUrl(PATH)}#faq`)],
      dateModified: dataModified ? cairoIso(dataModified) : editedAt,
      lastReviewed: editorialIso(PATH, "reviewed"),
      reviewedBy: ORG,
    }),
    faqNode(PATH, faqFrom([...sections, ...faq])),
    breadcrumbNode(PATH, [
      { name: "الرئيسية", path: "/" },
      { name: "أراضي بيت الوطن للبيع", path: `${BW_BASE}/` },
      { name: "المرحلة 11", path: PATH },
    ])
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Breadcrumb
        items={[{ label: "الرئيسية", href: "/" }, { label: "أراضي بيت الوطن للبيع", href: `${BW_BASE}/` }, { label: "المرحلة 11" }]}
        path={PATH}
        schema={false}
      />
      <JsonLd graph={pageGraph} />

      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-emerald-900">
        <div className="container mx-auto px-4 py-12">
          <p className="text-emerald-300 text-sm font-medium mb-2">بيع وشراء بالتنازل الرسمي</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight max-w-3xl">أراضي بيت الوطن المرحلة 11 للبيع</h1>
          <p className="answer-lede text-gray-200 text-lg mt-4 max-w-2xl leading-relaxed">{P11_LEDE}</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href={`${BW_BASE}/sell/?phase=11`}>
              <Button className="bg-orange-600 hover:bg-orange-700 h-11 px-6 text-base">سجّل قطعتك للبيع</Button>
            </Link>
            <Link href={`${BW_BASE}/buy-request/?phase=11`}>
              <Button variant="outline" className="h-11 px-6 text-base bg-transparent text-white border-white/40 hover:bg-white/10 hover:text-white">
                طلب شراء من المرحلة 11
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-10 space-y-12">
        <section aria-labelledby="rules-h" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <h2 id="rules-h" className="text-xl font-bold text-gray-900 mb-3">ماذا يُباع في المرحلة 11؟</h2>
            <ul className="list-disc pr-5 space-y-2 text-gray-700">
              <li>القطعة بعد صدور خطاب تخصيصها أو التعاقد عليها.</li>
              <li>بالتنازل الرسمي: موافقة كتابية من جهاز المدينة وتوقيع الطرفين أمام الموظف المختص أو بتوكيل.</li>
              <li>ويحل المشتري محل البائع في الأقساط المتبقية ومهلة البناء.</li>
            </ul>
          </div>
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">ماذا لا يُباع؟</h2>
            <ul className="list-disc pr-5 space-y-2 text-gray-700">
              <li>كود الحجز والمبالغ المحوّلة (كراسة الشروط ص3).</li>
              <li>«مسلسل» أو «ترتيب»: لا يوجد في الكراسة ما يجيز بيعه.</li>
              <li>ترتيبات «إلغاء ثم إعادة حجز» لنقل قطعة لشخص آخر: لا ننشرها.</li>
              <li>{NO_DEPOSIT_LINE}</li>
            </ul>
          </div>
        </section>

        {sections.length > 0 && (
          <div className="rounded-xl bg-white border border-gray-200 p-6 space-y-8">
            {sections.map((item) => (
              <AnswerSection key={item.id} item={item} />
            ))}
          </div>
        )}

        <section aria-labelledby="ph-list-h" id="ph-listings">
          <h2 id="ph-list-h" className="text-2xl font-bold text-gray-900 mb-2">إعلانات المرحلة 11 الموثّقة</h2>
          {lastVerified ? (
            <Freshness data={lastVerified} dataLabel="آخر توثيق لإعلان" className="freshness text-sm text-gray-500 mb-3" />
          ) : !snapshotIso ? (
            <Freshness data={editedAt} dataLabel="آخر تحديث لهذه الصفحة" className="freshness text-sm text-gray-500 mb-3" />
          ) : null}
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {listings.map((l) => (
                <ListingCard key={l.id} l={l} live={live} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <p className="text-lg font-bold text-gray-900">لا توجد إعلانات موثّقة من المرحلة 11 الآن</p>
              <p className="text-gray-600 mt-2 max-w-xl mx-auto">
                ننشر إعلان كل قطعة بعد صدور خطاب تخصيصها والتحقق منه. سجّل طلبك ونبلغك أول ما تُنشر قطعة في المدينة التي تريدها.
              </p>
              <Link href={`${BW_BASE}/buy-request/?phase=11`} className="inline-block mt-4">
                <Button className="bg-orange-600 hover:bg-orange-700">سجّل طلب شراء</Button>
              </Link>
            </div>
          )}
        </section>

        {!live && (
          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-bold text-gray-900">المرحلة 11 الآن</h2>
            <p className="text-gray-700 mt-2">
              الأرقام الحية غير متاحة في هذه اللحظة. تابع المتاح لحظيًا في أداة{" "}
              <BrandPlatformLink className="text-emerald-700 underline" />.
            </p>
            {/* خطوات المشتري أدناه تعرض المتاح من الهيئة كخيار، فشرط الأهلية يظهر حتى بلا أرقام حية (§0.1.9) */}
            <p className="text-sm text-gray-600 mt-2 max-w-3xl">{ELIGIBILITY_CAVEAT}</p>
          </section>
        )}

        {live && rows.length > 0 && (
          <section aria-labelledby="ph-live-h" id="official-available">
            <h2 id="ph-live-h" className="text-2xl font-bold text-gray-900 mb-2">
              البديل: المتاح من الهيئة بالسعر الرسمي لمن له مسلسل في المرحلة 11
            </h2>
            <p className="text-gray-600 mb-2 max-w-3xl">
              حتى {snapshotIso ? <time dateTime={snapshotIso}>{cairoDateTime(snapshotIso)}</time> : "آخر لقطة"}، ما زالت{" "}
              {live.available.toLocaleString("en-US")} قطعة من {live.total.toLocaleString("en-US")} في المرحلة 11 متاحة من الهيئة
              بالسعر الرسمي، حسب رصد منصة «التيسير — الحجز الذكي» لموقع الهيئة. إن كان لك مسلسل في المرحلة 11، قارن المتاح في
              مدينتك قبل أن تدفع أوفر.
            </p>
            <p className="text-sm text-gray-600 mb-4 max-w-3xl">{ELIGIBILITY_CAVEAT}</p>
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <caption className="sr-only">المتاح من الهيئة وسعر المتر الرسمي وطلبات الشراء في المرحلة 11 لكل مدينة، مرتبة بالاسم</caption>
                <thead className="bg-slate-800 text-white">
                  <tr>
                    <th scope="col" className="p-3 text-right">المدينة</th>
                    <th scope="col" className="p-3 text-right">المتاح من الهيئة الآن</th>
                    <th scope="col" className="p-3 text-right">من إجمالي المطروح</th>
                    <th scope="col" className="p-3 text-right">سعر المتر الرسمي</th>
                    <th scope="col" className="p-3 text-right">طلبات شراء لدينا</th>
                    <th scope="col" className="p-3 text-right">إعلانات</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const d = demand[r.slug]?.phase11 || 0;
                    return (
                      <tr key={r.slug} className="border-t border-gray-100">
                        <th scope="row" className="p-3 text-right font-medium">{r.nameAr}</th>
                        <td className="p-3">{r.available.toLocaleString("en-US")}</td>
                        <td className="p-3">{r.total.toLocaleString("en-US")}</td>
                        <td className="p-3 whitespace-nowrap" dir="ltr" style={{ textAlign: "right" }}>
                          {r.ppmMin === r.ppmMax ? fmtUsd(r.ppmMin) : `${fmtUsd(r.ppmMin)} – ${fmtUsd(r.ppmMax)}`}
                        </td>
                        <td className="p-3">{d >= MIN_POINTS ? requestsCount(d) : <span className="text-gray-400">—</span>}</td>
                        <td className="p-3">
                          {counts[r.slug] ? (
                            <a href="#ph-listings" className="text-orange-600 font-semibold hover:underline">{adsCount(counts[r.slug])}</a>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <LiveStamp live={live} />
            <p className="text-xs text-gray-500 mt-1">طلبات الشراء تظهر للمدينة من 3 طلبات فأكثر.</p>
            <PlatformLink path="/baitelwatan/phase-11/" className="inline-block mt-2 text-emerald-700 font-semibold hover:underline">
              بيت الوطن المرحلة 11
            </PlatformLink>
          </section>
        )}

        <section aria-labelledby="ph-how-h" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <h2 id="ph-how-h" className="text-xl font-bold text-gray-900 mb-3">لو حاجز وعايز تبيع</h2>
            <ol className="list-decimal pr-5 space-y-2 text-gray-700">
              <li>سجّل قطعتك الآن، حتى لو خطاب التخصيص لسه موصلش.</li>
              <li>نطابق القطعة مع سجل الرصد، ونراجع إيصالات السداد وهويتك.</li>
              <li>بعد وصول خطاب التخصيص وتأكيد الجهاز لشروط التنازل، ننشر الإعلان بكارت تكلفة كامل.</li>
              <li>العمولة لا تُستحق إلا بعد اعتماد الجهاز للتنازل.</li>
            </ol>
          </div>
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">لو عايز تشتري</h2>
            <ol className="list-decimal pr-5 space-y-2 text-gray-700">
              <li>لو لك مسلسل في المرحلة 11، شوف الأول المتاح من الهيئة بالسعر الرسمي في مدينتك.</li>
              <li>لو المنطقة اللي عايزها نفدت، سجّل طلب شراء بالمدينة والميزانية.</li>
              <li>نبعتلك الإعلانات الموثّقة المطابقة، ونكشف رقم القطعة بعد التحقق من هويتك لتتحقق منها في الجهاز.</li>
            </ol>
            <p className="mt-4 text-gray-700">
              المتاح لحظيًا في أداة <BrandPlatformLink className="text-emerald-700 font-semibold hover:underline" />.
            </p>
          </div>
        </section>

        <FaqList items={faq} title="أسئلة عن بيع المرحلة 11" id="faq" className="" />

        <Disclaimer />
      </main>
      <Footer />
    </div>
  );
}
