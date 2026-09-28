// components/bw/BwParts.tsx
// أجزاء عرض قسم «أراضي بيت الوطن للبيع» (مكونات خادم بلا حالة).

import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, Ban, HandCoins, MapPin, ShieldCheck } from "lucide-react";
import type { BwListing } from "@/lib/bw/types";
import { CHECK_LABEL, CHECK_ORDER, STAGE_LABEL } from "@/lib/bw/types";
import type { BwLive, BwLiveCity } from "@/lib/bw/live-parse";
import { cityName } from "@/lib/bw/cities";
import {
  adsCount,
  areaLabel,
  compareWithOfficial,
  costCard,
  plotsCount,
  fmtDate,
  fmtEgp,
  fmtUsd,
  listingPath,
} from "@/lib/bw/calc";
import { BW_BASE, BW_DISCLAIMER, INDEPENDENCE_LINE, PLATFORM_PRICES_URL, PLATFORM_URL } from "@/lib/bw/constants";
import { isPhase11 } from "@/lib/bw/publish";

export function TrustStrip() {
  const items = [
    { icon: ShieldCheck, title: "لا ننشر قبل التوثيق", text: "نراجع التخصيص والسداد وهوية البائع، ونعاين القطعة بأنفسنا." },
    { icon: HandCoins, title: "لا نستلم أموال الصفقة", text: "الأوفر يُدفع للبائع مباشرة عند التوقيع أمام جهاز المدينة." },
    { icon: Ban, title: "كود الحجز لا يُباع", text: "قطع المرحلة 11 تُعرض بعد خطاب التخصيص فقط، والتنازل بموافقة الجهاز." },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {items.map(({ icon: Icon, title, text }) => (
        <div key={title} className="flex gap-3 rounded-xl bg-white border border-gray-200 p-4">
          <Icon className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" aria-hidden />
          <div>
            <p className="font-bold text-gray-900">{title}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Chips({ l }: { l: BwListing }) {
  const chips = [
    STAGE_LABEL[l.stage],
    l.phase ? `المرحلة ${l.phase}` : null,
    l.corner ? "ناصية" : null,
    l.garden ? "على حديقة" : null,
    l.sea ? "على البحر" : null,
  ].filter(Boolean) as string[];
  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((c) => (
        <span key={c} className="text-xs font-medium rounded-full bg-gray-100 text-gray-700 px-2.5 py-0.5">
          {c}
        </span>
      ))}
    </div>
  );
}

export function ListingCard({ l, live }: { l: BwListing; live: BwLive | null }) {
  const c = costCard(l);
  const cmp = compareWithOfficial(c.perM2Usd, live?.cities[l.citySlug]);
  const sold = l.status === "sold";
  return (
    <Link
      href={listingPath(l)}
      className="group flex flex-col rounded-xl border border-gray-200 bg-white overflow-hidden hover:border-orange-300 hover:shadow-md transition"
    >
      <div className="relative aspect-[16/9] bg-gradient-to-br from-slate-100 to-slate-200">
        {l.photos[0] ? (
          <Image src={l.photos[0]} alt={`أرض بيت الوطن ${l.district} ${cityName(l.citySlug)}`} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-slate-400">
            <MapPin className="h-10 w-10" aria-hidden />
          </div>
        )}
        {sold ? (
          <span className="absolute top-3 right-3 rounded-full bg-gray-900/85 text-white text-xs font-bold px-3 py-1">بيعت</span>
        ) : (
          <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-emerald-600 text-white text-xs font-bold px-3 py-1">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden /> موثّق {fmtDate(l.verifiedAt)}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-3 p-4 flex-1">
        <div>
          <h3 className="font-bold text-gray-900 text-lg group-hover:text-orange-600">
            أرض {areaLabel(l)} · {l.district}
          </h3>
          <p className="text-sm text-gray-600">{cityName(l.citySlug)}</p>
        </div>
        <Chips l={l} />
        <dl className="grid grid-cols-2 gap-2 text-sm mt-auto">
          <div className="rounded-lg bg-orange-50 p-2.5">
            <dt className="text-gray-600 text-xs">الأوفر المطلوب</dt>
            <dd className="font-bold text-orange-700">{fmtEgp(l.premiumEgp)}</dd>
          </div>
          <div className="rounded-lg bg-slate-50 p-2.5">
            <dt className="text-gray-600 text-xs">التكلفة الفعلية للمتر</dt>
            <dd className="font-bold text-slate-800" dir="ltr">{fmtUsd(c.perM2Usd)}</dd>
          </div>
        </dl>
        {cmp && (
          <p className="text-xs text-gray-600">
            السعر الرسمي للطرح الحالي في المدينة: <span dir="ltr">{fmtUsd(cmp.officialMin)}–{fmtUsd(cmp.officialMax)}</span> للمتر
          </p>
        )}
      </div>
    </Link>
  );
}

function Row({ k, v, note, strong }: { k: string; v: React.ReactNode; note?: string; strong?: boolean }) {
  return (
    <tr className="border-b border-gray-100 last:border-0">
      <th scope="row" className="py-3 pl-3 text-right align-top font-medium text-gray-700 w-1/2">
        {k}
        {note && <span className="block text-xs font-normal text-gray-500 mt-0.5">{note}</span>}
      </th>
      <td className={`py-3 text-left align-top ${strong ? "font-bold text-gray-900 text-lg" : "text-gray-900"}`} dir="ltr">
        {v}
      </td>
    </tr>
  );
}

export function CostCardView({ l }: { l: BwListing }) {
  const c = costCard(l);
  return (
    <section aria-labelledby="cost-h" className="rounded-xl border border-gray-200 bg-white p-5">
      <h2 id="cost-h" className="text-xl font-bold text-gray-900 mb-1">كارت التكلفة الكاملة</h2>
      <p className="text-sm text-gray-600 mb-3">محسوب من مستندات البائع التي راجعناها، بسعر تحويل {l.usdEgp.toLocaleString("ar-EG")} جنيه للدولار بتاريخ {fmtDate(l.usdEgpDate)}.</p>
      {l.approx && (
        <p className="text-sm text-amber-800 bg-amber-50 rounded-lg p-2.5 mb-3">
          المساحة لأقرب 10 م² والأسعار لأقرب 5 آلاف دولار، حتى لا تُعرف القطعة قبل المعاينة. الأرقام الدقيقة من العقد عند المعاينة.
        </p>
      )}
      <table className="w-full text-sm">
        <tbody>
          <Row k="السعر الرسمي للقطعة" note="من العقد أو خطاب التخصيص" v={fmtUsd(c.officialTotalUsd)} />
          <Row k="المسدد حتى تاريخه" note="يُرد للبائع عند التنازل" v={fmtUsd(c.paidUsd)} />
          <Row k="الأقساط المتبقية" note="يتحملها المشتري للهيئة في مواعيدها" v={fmtUsd(c.remainingUsd)} />
          <Row k="الأوفر المطلوب" v={<span dir="rtl">{fmtEgp(c.premiumEgp)}</span>} />
          <Row
            k="المدفوع للبائع عند التوقيع"
            note="= المسدد + الأوفر"
            v={<span dir="rtl">{fmtUsd(c.paidUsd)} + {fmtEgp(c.premiumEgp)}</span>}
          />
          {c.feesUsd !== null && (
            <Row k={`مصروفات إدارية تقديرية (${l.feesPct.toLocaleString("ar-EG")}%)`} note="تُؤكَّد من جهاز المدينة" v={fmtUsd(c.feesUsd)} />
          )}
          <Row k="رسوم التنازل" v={<span dir="rtl" className="text-gray-600">حسب لائحة الهيئة، وتُؤكَّد من الجهاز</span>} />
          <Row k="التكلفة الكلية بما يعادلها بالدولار" v={fmtUsd(c.totalUsdEquiv)} />
          <Row
            k="التكلفة الفعلية للمتر"
            v={
              <span>
                {fmtUsd(c.perM2Usd)} <span className="text-gray-500 text-sm font-normal" dir="rtl">({fmtEgp(c.perM2Egp)})</span>
              </span>
            }
            strong
          />
        </tbody>
      </table>
    </section>
  );
}

function Phase11CompareView({ l, city }: { l: BwListing; city: BwLiveCity | null | undefined }) {
  const c = costCard(l);
  const officialPpm = c.officialTotalUsd !== null && l.area > 0 ? c.officialTotalUsd / l.area : null;
  if (officialPpm === null) return null;
  return (
    <section aria-labelledby="cmp-h" className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5">
      <h2 id="cmp-h" className="text-xl font-bold text-gray-900 mb-2">مقارنة بالسعر الرسمي الآن</h2>
      <p className="text-gray-800 leading-relaxed">
        السعر الرسمي لهذه القطعة {l.approx ? "نحو " : ""}<b dir="ltr">{fmtUsd(officialPpm)}</b> للمتر شاملًا علاوات الموقع، من العقد وسجل الرصد.
        {c.premiumPerM2Usd !== null && (
          <>
            {" "}والأوفر المطلوب يعادل <b dir="ltr">{fmtUsd(c.premiumPerM2Usd)}</b> للمتر فوقه.
          </>
        )}
      </p>
      {!city && (
        <p className="mt-2 text-gray-600">
          أرقام المتاح الحية غير متاحة الآن؛ تابعها لحظيًا في <a href={PLATFORM_URL} className="underline">«التيسير — الحجز الذكي»</a>.
        </p>
      )}
      {city && (
        <p className="mt-2 text-gray-800 leading-relaxed">
          {city.available > 0 ? (
            <>
              ولا يزال متاحًا من الهيئة في {city.nameAr} {plotsCount(city.available)} من {city.total.toLocaleString("ar-EG")} بالسعر الرسمي
              بلا أوفر
              {city.availPpmMin != null && city.availPpmMax != null && (
                <>
                  ، وسعر المتر الأساسي لها (قبل علاوات الناصية والحديقة) من <b dir="ltr">{fmtUsd(city.availPpmMin)}</b> إلى{" "}
                  <b dir="ltr">{fmtUsd(city.availPpmMax)}</b>
                </>
              )}
              . قارن بالموقع والمساحة قبل أن تقرر.
            </>
          ) : (
            <>لا توجد قطع متاحة الآن من الهيئة في {city.nameAr} حسب الرصد الحي.</>
          )}
        </p>
      )}
      {city && (
        <p className="mt-2 text-xs text-gray-600">
          المصدر: بيانات منصة «التيسير — الحجز الذكي» الحية، وتُحدَّث كل 6 ساعات. <a href={PLATFORM_URL} className="underline">المتاح لحظيًا</a>
        </p>
      )}
    </section>
  );
}

export function OfficialCompareView({ l, city }: { l: BwListing; city: BwLiveCity | null | undefined }) {
  if (isPhase11(l)) return <Phase11CompareView l={l} city={city} />;
  const c = costCard(l);
  const cmp = compareWithOfficial(c.perM2Usd, city);
  if (!cmp || !city) return null;
  const above = cmp.diffUsd >= 0;
  return (
    <section aria-labelledby="cmp-h" className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5">
      <h2 id="cmp-h" className="text-xl font-bold text-gray-900 mb-2">مقارنة بالسعر الرسمي الآن</h2>
      <p className="text-gray-800 leading-relaxed">
        أرض الطرح الحالي (المرحلة 11) في {city.nameAr} سعرها الرسمي من{" "}
        <b dir="ltr">{fmtUsd(cmp.officialMin)}</b> إلى <b dir="ltr">{fmtUsd(cmp.officialMax)}</b> للمتر، والوسيط{" "}
        <b dir="ltr">{fmtUsd(cmp.officialMedian)}</b> (سعر المتر الأساسي قبل علاوات الناصية والحديقة). المتاح منها الآن{" "}
        {plotsCount(cmp.available)} من {cmp.total.toLocaleString("ar-EG")}.
      </p>
      <p className="mt-2 text-gray-800">
        التكلفة الفعلية للمتر في هذا الإعلان {above ? "أعلى" : "أقل"} من الوسيط الرسمي بـ{" "}
        <b dir="ltr">{fmtUsd(Math.abs(cmp.diffUsd))}</b> ({Math.abs(cmp.diffPct).toLocaleString("ar-EG", { maximumFractionDigits: 0 })}%).
      </p>
      <p className="mt-2 text-xs text-gray-600">
        قطع المرحلة 11 في مواقع مختلفة ولم تُستلم بعد، فالمقارنة لتقدير الأوفر وليست تقييمًا. المصدر: بيانات منصة «التيسير — الحجز الذكي»
        الحية، وتُحدَّث كل 6 ساعات. <a href={PLATFORM_PRICES_URL} className="underline">جدول أسعار بيت الوطن</a>
      </p>
    </section>
  );
}

export function VerifyStamp({ l }: { l: BwListing }) {
  return (
    <section aria-labelledby="ver-h" className="rounded-xl border border-gray-200 bg-white p-5">
      <h2 id="ver-h" className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
        <BadgeCheck className="h-5 w-5 text-emerald-600" aria-hidden /> ختم التوثيق
      </h2>
      <p className="text-sm text-gray-600 mb-3">
        راجعنا هذا الإعلان في {fmtDate(l.verifiedAt)}، ونعيد التوثيق كل 45 يومًا وإلا ينتهي الإعلان.
      </p>
      <ul className="space-y-1.5 text-sm">
        {CHECK_ORDER.filter((k) => l.checks.includes(k)).map((k) => (
          <li key={k} className="flex gap-2">
            <span className="text-emerald-600" aria-hidden>✓</span>
            {CHECK_LABEL[k]}
          </li>
        ))}
        {l.platformMatched && (
          <li className="flex gap-2">
            <span className="text-emerald-600" aria-hidden>✓</span>
            مطابقة القطعة مع سجل الرصد في منصة التيسير
          </li>
        )}
      </ul>
      <p className="text-xs text-gray-500 mt-3">
        «موثّق» يعني أننا راجعنا المستندات في التاريخ المذكور، ولا يُعد ضمانًا قانونيًا. تحقق من القطعة لدى جهاز المدينة قبل أي سداد.
      </p>
    </section>
  );
}

export function OfficialTable({ live, counts }: { live: BwLive; counts: Record<string, number> }) {
  const rows = Object.values(live.cities).sort(
    (a, b) => (counts[b.slug] || 0) - (counts[a.slug] || 0) || b.total - a.total
  );
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <caption className="sr-only">سعر المتر الرسمي والمتاح في الطرح الحالي لكل مدينة</caption>
        <thead className="bg-slate-800 text-white">
          <tr>
            <th scope="col" className="p-3 text-right">المدينة</th>
            <th scope="col" className="p-3 text-right">سعر المتر الرسمي</th>
            <th scope="col" className="p-3 text-right">المتاح الآن</th>
            <th scope="col" className="p-3 text-right">إعلانات موثّقة</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.slug} className="border-t border-gray-100">
              <th scope="row" className="p-3 text-right font-medium">{r.nameAr}</th>
              <td className="p-3 whitespace-nowrap" dir="ltr" style={{ textAlign: "right" }}>
                {r.ppmMin === r.ppmMax ? fmtUsd(r.ppmMin) : `${fmtUsd(r.ppmMin)} – ${fmtUsd(r.ppmMax)}`}
              </td>
              <td className="p-3 whitespace-nowrap">
                {r.available.toLocaleString("ar-EG")} من {r.total.toLocaleString("ar-EG")}
              </td>
              <td className="p-3">
                {counts[r.slug] ? (
                  <Link href={`${BW_BASE}/${r.slug}/`} className="text-orange-600 font-semibold hover:underline">
                    {adsCount(counts[r.slug])}
                  </Link>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LiveStamp({ live }: { live: BwLive }) {
  return (
    <p className="text-xs text-gray-500 mt-2">
      من بيانات منصة «التيسير — الحجز الذكي» الحية، لقطة {live.generatedAt ? `${live.generatedAt} بتوقيت القاهرة` : fmtDate(live.fetchedAt)}.
      السعر هو سعر المتر الأساسي في الكراسة قبل علاوات الناصية والحديقة.
    </p>
  );
}

export function Disclaimer() {
  return (
    <aside className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs leading-relaxed text-slate-600">
      <p>{BW_DISCLAIMER}</p>
      <p className="mt-2">{INDEPENDENCE_LINE}</p>
    </aside>
  );
}
