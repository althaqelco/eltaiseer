import { Metadata } from "next";
import { bwMeta } from "@/lib/bw/meta";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Disclaimer, ListingCard, LiveStamp, TrustStrip } from "@/components/bw/BwParts";
import { getActiveListings, getDemand } from "@/lib/bw/listings";
import { getBwLive } from "@/lib/bw/live";
import { fmtUsd, isLive, plotsCount } from "@/lib/bw/calc";
import { cityBySlug } from "@/lib/bw/cities";
import { MIN_POINTS, type BwListing } from "@/lib/bw/types";
import { BW_BASE, PLATFORM_PRICES_URL } from "@/lib/bw/constants";

export const revalidate = 300;
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

type Props = { params: { city: string } };

function cityListings(all: BwListing[], slug: string): BwListing[] {
  const now = Date.now();
  return all.filter((l) => l.citySlug === slug && isLive(l, now)).sort((a, b) => b.verifiedAt.localeCompare(a.verifiedAt));
}

// صفحة المدينة تُفهرس فقط إذا فيها 5 إعلانات، أو حي فيه 3 إعلانات — غير ذلك صفحة رقيقة تبقى خارج الفهرس
function indexable(listings: BwListing[]): boolean {
  if (listings.length >= 5) return true;
  const by: Record<string, number> = {};
  for (const l of listings) by[l.districtSlug || l.district] = (by[l.districtSlug || l.district] || 0) + 1;
  return Object.values(by).some((n) => n >= MIN_POINTS);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = cityBySlug(params.city);
  if (!city) notFound(); // 404 حقيقية ما دام لا loading.tsx فوق هذا المسار (حد التحميل يبث الصفحة بحالة 200 أولاً)
  const listings = cityListings(await getActiveListings(), city.slug);
  const title = `أراضي بيت الوطن للبيع في ${city.nameAr} (موثّقة)`;
  const description = `قطع أراضي بيت الوطن في ${city.nameAr} للبيع بالتنازل بعد مراجعة المستندات والمعاينة، مع التكلفة الفعلية للمتر ومقارنتها بسعر الهيئة الرسمي الآن.`;
  return bwMeta({ title, description, path: `${BW_BASE}/${city.slug}/`, noindex: !indexable(listings) });
}

export default async function CityResalePage({ params }: Props) {
  const city = cityBySlug(params.city);
  if (!city) notFound();
  const [all, live, demand] = await Promise.all([getActiveListings(), getBwLive(), getDemand(city.slug)]);
  const listings = cityListings(all, city.slug);
  const liveCity = live?.cities[city.slug];

  const groups = new Map<string, BwListing[]>();
  for (const l of listings) {
    const k = l.district || "أخرى";
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(l);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Breadcrumb
        items={[
          { label: "الرئيسية", href: "/" },
          { label: "أراضي بيت الوطن للبيع", href: `${BW_BASE}/` },
          { label: city.nameAr },
        ]}
      />
      <main className="container mx-auto px-4 py-10 space-y-10">
        <header className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">أراضي بيت الوطن للبيع في {city.nameAr}</h1>
          <p className="text-gray-700 mt-3 text-lg leading-relaxed">
            إعلانات موثّقة لقطع مخصصة أو مستلمة في {city.nameAr}، مع حساب التكلفة الفعلية للمتر ومقارنتها بسعر الهيئة الرسمي الآن.
          </p>
        </header>

        {(liveCity || (demand && demand.total >= MIN_POINTS)) && (
          <section aria-label={`أرقام ${city.nameAr} الحية`} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {liveCity && (
              <>
                <div className="rounded-xl bg-white border border-gray-200 p-4">
                  <p className="text-sm text-gray-600">سعر المتر الرسمي في الطرح الحالي</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1" dir="ltr" style={{ textAlign: "right" }}>
                    {liveCity.ppmMin === liveCity.ppmMax ? fmtUsd(liveCity.ppmMin) : `${fmtUsd(liveCity.ppmMin)} – ${fmtUsd(liveCity.ppmMax)}`}
                  </p>
                </div>
                <div className="rounded-xl bg-white border border-gray-200 p-4">
                  <p className="text-sm text-gray-600">المتاح الآن من الهيئة</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">
                    {plotsCount(liveCity.available)} <span className="text-base font-normal text-gray-600">من {liveCity.total.toLocaleString("ar-EG")}</span>
                  </p>
                </div>
              </>
            )}
            {demand && demand.total >= MIN_POINTS && (
              <div className="rounded-xl bg-white border border-gray-200 p-4">
                <p className="text-sm text-gray-600">طلبات شراء مسجلة لدينا</p>
                <p className="text-2xl font-bold text-orange-700 mt-1">{demand.total.toLocaleString("ar-EG")}</p>
              </div>
            )}
          </section>
        )}
        {live && liveCity && <LiveStamp live={live} />}

        {listings.length > 0 ? (
          Array.from(groups.entries()).map(([district, ls]) => (
            <section key={district} aria-labelledby={`d-${ls[0].id}`}>
              <h2 id={`d-${ls[0].id}`} className="text-2xl font-bold text-gray-900 mb-4">
                {district} <span className="text-base font-normal text-gray-500">({ls.length.toLocaleString("ar-EG")})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {ls.map((l) => (
                  <ListingCard key={l.id} l={l} live={live} />
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
            <p className="text-lg font-bold text-gray-900">لا توجد إعلانات موثّقة في {city.nameAr} الآن</p>
            <p className="text-gray-600 mt-2">سجّل طلبك ونبلغك أول ما تُوثَّق قطعة هنا.</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Link href={`${BW_BASE}/buy-request/?city=${city.slug}`}>
            <Button className="bg-orange-600 hover:bg-orange-700">سجّل طلب شراء في {city.nameAr}</Button>
          </Link>
          <Link href={`${BW_BASE}/sell/?city=${city.slug}`}>
            <Button variant="outline">عندك أرض في {city.nameAr}؟</Button>
          </Link>
          {listings.some((l) => l.phase !== null && l.phase >= 11) && (
            <Link href={`${BW_BASE}/phase-11/`} className="self-center text-sm text-orange-600 hover:underline">بيع وشراء المرحلة 11</Link>
          )}
          <a href={PLATFORM_PRICES_URL} className="self-center text-sm text-emerald-700 hover:underline">جدول أسعار بيت الوطن</a>
        </div>

        <TrustStrip />
        <Disclaimer />
      </main>
      <Footer />
    </div>
  );
}
