import { Metadata } from "next";
import { bwMeta } from "@/lib/bw/meta";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Disclaimer, ListingCard, LiveStamp } from "@/components/bw/BwParts";
import { getActiveListings, getAllDemand } from "@/lib/bw/listings";
import { getBwLive } from "@/lib/bw/live";
import { adsCount, fmtUsd, isLive, jsonLd, plotsCount, requestsCount } from "@/lib/bw/calc";
import { isPhase11 } from "@/lib/bw/publish";
import { MIN_POINTS } from "@/lib/bw/types";
import { BW_BASE, NO_DEPOSIT_LINE, PLATFORM_URL } from "@/lib/bw/constants";

export const revalidate = 300;

const TITLE = "بيع أرض بيت الوطن المرحلة 11 بعد التخصيص";
const DESC =
  "تقدر تبيع أو تشتري أرض بيت الوطن من المرحلة 11 بعد صدور خطاب التخصيص، بالتنازل الرسمي بموافقة جهاز المدينة. المحجوز والمتاح والسعر الرسمي في كل مدينة من بيانات حية، وإعلانات موثّقة فقط.";

export const metadata: Metadata = bwMeta({ title: TITLE, description: DESC, path: `${BW_BASE}/phase-11/` });

const FAQ = [
  {
    q: "هل أقدر أبيع حجزي في المرحلة 11 دلوقتي؟",
    a: "الحجز نفسه (كود الحجز أو المسلسل أو رصيد الحوالة) لا يُباع ولا يُنقل حسب كراسة الشروط. ما يُباع هو القطعة بعد صدور خطاب تخصيصها، بالتنازل الرسمي بموافقة جهاز المدينة. تقدر تسجل قطعتك من الآن، ونجهز ملفك وننشر الإعلان بعد وصول الخطاب والتحقق منه.",
  },
  {
    q: "إيه اللي يدفعه المشتري؟",
    a: "يدفع للبائع ما سدده للهيئة حتى تاريخه (المقدم وأي أقساط دفعها) مع الأوفر المتفق عليه، عند التوقيع أمام الجهاز. ويتحمل المشتري الأقساط المتبقية للهيئة في مواعيدها. رسوم التنازل حسب لائحة الهيئة وتُؤكَّد من الجهاز.",
  },
  {
    q: "هل المشتري لازم تنطبق عليه شروط الحجز؟",
    a: "شروط المشتري، مثل الجنسية والإقامة بالخارج والسداد بالدولار، تُؤكَّد من جهاز المدينة قبل التوقيع، ونراجعها معك قبل كشف رقم القطعة.",
  },
  {
    q: "إزاي بتتأكدوا إن القطعة محجوزة فعلًا؟",
    a: "نطابقها مع سجل الرصد في منصة التيسير: هل ظهرت محجوزة على موقع الهيئة ومتى، ونراجع خطاب التخصيص وإيصالات السداد وهوية البائع. ونعيد المطابقة في كل فحص للوحة الإدارة، ونوقف الإعلان تلقائيًا لو لم تعد القطعة محجوزة.",
  },
  {
    q: "هل في قطع لسه متاحة بالسعر الرسمي؟",
    a: "في مدن كثيرة نعم. قارن المتاح الآن من الهيئة بالسعر الرسمي في مدينتك قبل أن تدفع أوفر. نعرضه من بياناتنا الحية حين تتوفر، ولحظيًا في «التيسير — الحجز الذكي».",
  },
];

export default async function Phase11Page() {
  const now = Date.now();
  const [active, live, demand] = await Promise.all([getActiveListings(), getBwLive(), getAllDemand()]);
  const listings = active.filter((l) => isPhase11(l) && isLive(l, now)).sort((a, b) => b.verifiedAt.localeCompare(a.verifiedAt));
  const counts: Record<string, number> = {};
  for (const l of listings) counts[l.citySlug] = (counts[l.citySlug] || 0) + 1;
  const rows = live
    ? Object.values(live.cities)
        .map((c) => ({ ...c, booked: c.total - c.available }))
        .sort((a, b) => b.booked - a.booked || b.available - a.available)
    : [];
  const booked = live ? live.total - live.available : 0;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Breadcrumb items={[{ label: "الرئيسية", href: "/" }, { label: "أراضي بيت الوطن للبيع", href: `${BW_BASE}/` }, { label: "المرحلة 11" }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema) }} />

      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-emerald-900">
        <div className="container mx-auto px-4 py-12">
          <p className="text-emerald-300 text-sm font-medium mb-2">بيع وشراء بالتنازل الرسمي</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight max-w-3xl">أراضي بيت الوطن المرحلة 11 للبيع</h1>
          <p className="text-gray-200 text-lg mt-4 max-w-2xl leading-relaxed">
            البيع مفتوح لكل قطعة بعد صدور خطاب تخصيصها والتحقق منه. كود الحجز نفسه لا يُباع، والتنازل يتم بموافقة جهاز المدينة.
          </p>
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
            <h2 id="rules-h" className="text-xl font-bold text-gray-900 mb-3">يُباع</h2>
            <ul className="list-disc pr-5 space-y-2 text-gray-700">
              <li>القطعة بعد صدور خطاب تخصيصها أو التعاقد عليها.</li>
              <li>بالتنازل الرسمي: موافقة كتابية من جهاز المدينة وتوقيع الطرفين أمام الموظف المختص أو بتوكيل.</li>
              <li>ويحل المشتري محل البائع في الأقساط المتبقية ومهلة البناء.</li>
            </ul>
          </div>
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">لا يُباع</h2>
            <ul className="list-disc pr-5 space-y-2 text-gray-700">
              <li>كود الحجز أو المسلسل أو رصيد الحوالة، ولا أي حق قبل التخصيص.</li>
              <li>ولا تُحوَّل المبالغ بين الحاجزين، ولا ترتيبات «إلغاء ثم إعادة حجز».</li>
              <li>{NO_DEPOSIT_LINE}</li>
            </ul>
          </div>
        </section>

        <section aria-labelledby="ph-list-h" id="ph-listings">
          <h2 id="ph-list-h" className="text-2xl font-bold text-gray-900 mb-4">إعلانات المرحلة 11 الموثّقة</h2>
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
              الأرقام الحية غير متاحة في هذه اللحظة. تابع المتاح والمحجوز لحظيًا في{" "}
              <a href={PLATFORM_URL} className="text-emerald-700 underline">«التيسير — الحجز الذكي»</a>.
            </p>
          </section>
        )}

        {live && rows.length > 0 && (
          <section aria-labelledby="ph-live-h">
            <h2 id="ph-live-h" className="text-2xl font-bold text-gray-900 mb-2">المرحلة 11 الآن في كل مدينة</h2>
            <p className="text-gray-600 mb-4 max-w-3xl">
              حُجزت حتى الآن {plotsCount(booked)} من {live.total.toLocaleString("ar-EG")} حسب الرصد الحي، وهي القطع التي يمكن بيعها بالتنازل
              بعد تخصيصها. والمتاح من الهيئة ما زال بالسعر الرسمي بلا أوفر.
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <caption className="sr-only">المحجوز والمتاح وسعر المتر الرسمي وطلبات الشراء في المرحلة 11 لكل مدينة</caption>
                <thead className="bg-slate-800 text-white">
                  <tr>
                    <th scope="col" className="p-3 text-right">المدينة</th>
                    <th scope="col" className="p-3 text-right">محجوز</th>
                    <th scope="col" className="p-3 text-right">متاح من الهيئة</th>
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
                        <td className="p-3">{r.booked.toLocaleString("ar-EG")}</td>
                        <td className="p-3">{r.available.toLocaleString("ar-EG")}</td>
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
              <li>شوف الأول المتاح من الهيئة بالسعر الرسمي في مدينتك.</li>
              <li>لو المنطقة اللي عايزها نفدت، سجّل طلب شراء بالمدينة والميزانية.</li>
              <li>نبعتلك الإعلانات الموثّقة المطابقة، ونكشف رقم القطعة بعد التحقق من هويتك لتتحقق منها في الجهاز.</li>
            </ol>
            <a href={PLATFORM_URL} className="inline-block mt-4 text-emerald-700 font-semibold hover:underline">المتاح لحظيًا في «التيسير — الحجز الذكي»</a>
          </div>
        </section>

        <section aria-labelledby="ph-faq-h">
          <h2 id="ph-faq-h" className="text-2xl font-bold text-gray-900 mb-4">أسئلة عن بيع المرحلة 11</h2>
          <div className="space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="rounded-xl bg-white border border-gray-200 p-4">
                <summary className="font-bold text-gray-900 cursor-pointer">{f.q}</summary>
                <p className="text-gray-700 mt-2 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <Disclaimer />
      </main>
      <Footer />
    </div>
  );
}
