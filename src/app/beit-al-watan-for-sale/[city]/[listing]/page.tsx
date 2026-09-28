import { Metadata } from "next";
import { bwMeta } from "@/lib/bw/meta";
import Link from "next/link";
import Image from "next/image";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { BadgeCheck, MessageCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { CostCardView, Disclaimer, OfficialCompareView, VerifyStamp } from "@/components/bw/BwParts";
import { getDemand, getListing } from "@/lib/bw/listings";
import { getBwLive } from "@/lib/bw/live";
import { areaLabel, costCard, fmtDate, fmtEgp, fmtUsd, idFromSlug, jsonLd, lifecycle, listingPath, listingSlug } from "@/lib/bw/calc";
import { cityBySlug, cityName } from "@/lib/bw/cities";
import { MIN_POINTS, STAGE_LABEL, type BwListing } from "@/lib/bw/types";
import { BW_BASE, NO_DEPOSIT_LINE, SITE } from "@/lib/bw/constants";
import { COMPANY_WHATSAPP } from "@/lib/format";

// ديناميكية لا ISR: Next 14.2 يخزّن رد permanentRedirect في كاش ISR بحالة 308 دون ترويسة Location،
// فكل زيارة بعد الأولى تصبح 308 بلا وجهة. الإعلان المباع/المنتهي والروابط غير الأساسية تعتمد على هذا التحويل
export const dynamic = "force-dynamic";

type Props = { params: { city: string; listing: string } };

function headline(l: BwListing): string {
  return `أرض بيت الوطن ${areaLabel(l)} في ${l.district}، ${cityName(l.citySlug)}`;
}

// التحويلات و404 تُحسم هنا (تُستدعى من generateMetadata والصفحة). تخرج بحالة HTTP صحيحة (308/404) فقط لأن
// لا loading.tsx ولا Suspense فوق هذا المسار — أي حد تحميل أعلاه يبث الصفحة أولاً فتصبح 200 مع meta refresh/noindex
async function resolve(params: Props["params"]): Promise<{ l: BwListing; sold: boolean }> {
  const l = await getListing(idFromSlug(params.listing));
  const lc = lifecycle(l, Date.now());
  if (!l || lc.kind === "not-found") notFound();
  const cityPage = cityBySlug(l.citySlug) ? `${BW_BASE}/${l.citySlug}/` : `${BW_BASE}/`;
  if (lc.kind === "gone-temp") redirect(cityPage); // قد يعود بعد إعادة التوثيق
  if (lc.kind === "gone-permanent") permanentRedirect(cityPage);
  // رابط واحد لكل إعلان: أي صيغة أخرى (مدينة أو حي أو مساحة مختلفة في الرابط) تُحوَّل للرابط الأساسي
  if (params.city !== l.citySlug || params.listing !== listingSlug(l)) permanentRedirect(listingPath(l));
  return { l, sold: lc.kind === "sold-visible" };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { l, sold } = await resolve(params);
  const c = costCard(l);
  const title = `${headline(l)} للبيع`;
  const description = `${STAGE_LABEL[l.stage]}${l.phase ? `، المرحلة ${l.phase}` : ""}. الأوفر المطلوب ${fmtEgp(l.premiumEgp)}، والتكلفة الفعلية للمتر ${fmtUsd(c.perM2Usd)} مقارنة بسعر الهيئة الرسمي الآن. إعلان موثّق في ${fmtDate(l.verifiedAt)}.`;
  return bwMeta({ title, description, path: listingPath(l), noindex: sold, images: l.photos });
}

export default async function ListingPage({ params }: Props) {
  const { l, sold } = await resolve(params);
  const [live, demand] = await Promise.all([getBwLive(), getDemand(l.citySlug)]);
  const c = costCard(l);
  const districtDemand = demand?.districts[l.districtSlug] || 0;
  const city = cityName(l.citySlug);

  const wa = `https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent(
    `مهتم بإعلان أرض بيت الوطن كود ${l.id}\n${headline(l)}\nأرجو التواصل لتحديد المعاينة وكشف رقم القطعة بعد التحقق من هويتي.`
  )}`;

  const askingUsd = c.officialTotalUsd !== null && c.usdEgp > 0 ? Math.round(c.officialTotalUsd + c.premiumEgp / c.usdEgp) : null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: headline(l),
    description: l.summary || headline(l),
    sku: l.id,
    category: "أرض سكنية",
    ...(l.photos.length ? { image: l.photos } : {}),
    offers: {
      "@type": "Offer",
      url: `${SITE}${listingPath(l)}`,
      availability: sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      ...(askingUsd ? { price: askingUsd, priceCurrency: "USD" } : {}),
      seller: { "@type": "RealEstateAgent", name: "التيسير للعقارات", url: SITE },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Breadcrumb
        items={[
          { label: "الرئيسية", href: "/" },
          { label: "أراضي بيت الوطن للبيع", href: `${BW_BASE}/` },
          { label: city, href: `${BW_BASE}/${l.citySlug}/` },
          { label: `${areaLabel(l)} ${l.district}` },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />

      {sold && (
        <div className="bg-gray-900 text-white">
          <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <p className="font-bold">بيعت هذه القطعة.</p>
            <Link href={`${BW_BASE}/${l.citySlug}/`} className="underline">شوف المتاح في {city}</Link>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        <header className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {!sold && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 text-white text-xs font-bold px-3 py-1">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden /> موثّق {fmtDate(l.verifiedAt)}
              </span>
            )}
            <span className="rounded-full bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1">{STAGE_LABEL[l.stage]}</span>
            {l.phase && l.phase >= 11 ? (
              <Link href={`${BW_BASE}/phase-11/`} className="rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium px-3 py-1 hover:underline">
                المرحلة {l.phase}
              </Link>
            ) : (
              l.phase && <span className="rounded-full bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1">المرحلة {l.phase}</span>
            )}
            {l.corner && <span className="rounded-full bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1">ناصية</span>}
            {l.garden && <span className="rounded-full bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1">على حديقة</span>}
            {l.sea && <span className="rounded-full bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1">على البحر</span>}
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight">{headline(l)}</h1>
          <p className="text-gray-600 mt-2">كود الإعلان {l.id}</p>
        </header>

        {l.photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
            {l.photos.slice(0, 8).map((p, i) => (
              <div key={p} className={`relative rounded-lg overflow-hidden bg-gray-200 ${i === 0 ? "col-span-2 row-span-2 aspect-[4/3]" : "aspect-[4/3]"}`}>
                <Image src={p} alt={`${headline(l)} صورة ${i + 1}`} fill className="object-cover" sizes={i === 0 ? "(max-width:768px) 100vw, 50vw" : "25vw"} priority={i === 0} />
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {l.summary && (
              <section className="rounded-xl border border-gray-200 bg-white p-5">
                <h2 className="text-xl font-bold text-gray-900 mb-2">عن القطعة</h2>
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">{l.summary}</p>
                <p className="text-sm text-gray-500 mt-3">لا ننشر رقم القطعة ولا موقعها الدقيق، ونكشفهما للمشتري بعد التحقق من هويته.</p>
              </section>
            )}
            <CostCardView l={l} />
            <OfficialCompareView l={l} city={live?.cities[l.citySlug]} />
            <VerifyStamp l={l} />
            {(districtDemand >= MIN_POINTS || (demand && demand.total >= MIN_POINTS)) && (
              <section className="rounded-xl border border-gray-200 bg-white p-5">
                <h2 className="text-xl font-bold text-gray-900 mb-1">الطلب على المنطقة</h2>
                <p className="text-gray-800">
                  عدد طلبات الشراء المسجلة لدينا في {districtDemand >= MIN_POINTS ? l.district : city}:{" "}
                  <b>{(districtDemand >= MIN_POINTS ? districtDemand : demand!.total).toLocaleString("ar-EG")}</b>
                </p>
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 h-fit space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-600">الأوفر المطلوب</p>
              <p className="text-3xl font-bold text-orange-700">{fmtEgp(l.premiumEgp)}</p>
              <p className="text-sm text-gray-600 mt-3">التكلفة الفعلية للمتر</p>
              <p className="text-xl font-bold text-slate-800" dir="ltr" style={{ textAlign: "right" }}>{fmtUsd(c.perM2Usd)}</p>
              {!sold && (
                <a href={wa} target="_blank" rel="noopener noreferrer" className="block mt-5">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 text-base gap-2">
                    <MessageCircle className="h-5 w-5" aria-hidden /> اطلب المعاينة ورقم القطعة
                  </Button>
                </a>
              )}
              <p className="text-xs text-gray-600 mt-3 leading-relaxed">{NO_DEPOSIT_LINE}</p>
            </div>
            <Link href={`${BW_BASE}/how-we-verify/`} className="block text-sm text-orange-600 hover:underline">كيف نوثّق الإعلانات</Link>
          </aside>
        </div>

        <div className="mt-10">
          <Disclaimer />
        </div>
      </main>
      <Footer />
    </div>
  );
}
