import type { ComponentType, ReactNode } from "react";
import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { filterByCity, getPropertiesForIsr, getPropertiesServerResult, serializeProperties } from "@/lib/serverProperties";
import { getPropertyUrl } from "@/lib/districtSlugs";
import { JsonLd } from "@/components/JsonLd";
import { Freshness } from "@/components/Freshness";
import { RichText, TeaserLinks } from "@/components/Answers";
import { teaser } from "@/lib/answers";
import { HUB, hubCityStats, hubLede, hubPriceAnswer, hubPriceQuestion } from "@/lib/answers/local";
import { breadcrumbNode, graph, itemListNode, pageUrl, ref, webPage } from "@/lib/seo/schema";
import { breadcrumbPresets } from "@/components/Breadcrumb";
import { cairoIso, maxIso } from "@/lib/seo/time";
import {
  categoryProperties,
  isAvailable,
  type CategorySlug,
  type TypeCategorySlug,
} from "@/lib/listingCategories";
import { isCategoryIndexable, NOINDEX_FOLLOW } from "@/lib/indexRules";
import { CATEGORY_PAGE_SIZE, pagedMetadata, parsePageParam, totalPages } from "@/lib/pagination";
import type { Property } from "@/lib/types";

const LIST_NAMES: Record<TypeCategorySlug, string> = {
  apartments: "شقق للبيع في دمياط الجديدة والمنصورة الجديدة",
  villas: "فيلات للبيع في دمياط الجديدة والمنصورة الجديدة",
  lands: "أراضي للبيع في دمياط الجديدة والمنصورة الجديدة",
  shops: "محلات ومقرات تجارية للبيع في دمياط الجديدة والمنصورة الجديدة",
  clinics: "عيادات للبيع في دمياط الجديدة والمنصورة الجديدة",
  chalets: "شاليهات للبيع في دمياط الجديدة والمنصورة الجديدة",
};

export type CategoryClientProps = {
  initialProperties: Property[];
  page?: number;
  /** مقدمة الإجابة (answer-lede): نص محسوب في الخادم يُعرض بعد H1 مباشرة (الصفحة الأولى) */
  lede?: string;
  /** سؤال السعر وسطر التحديث والروابط — عقد خادم جاهزة (الصفحة الأولى) */
  answersSlot?: ReactNode;
};

const LINK = "text-orange-700 underline";

/** مقدمة صفحة النوع وأقسامها (spec-final A2.9) — من العروض المتاحة نفسها التي تعرضها الصفحة */
function hubContent(slug: TypeCategorySlug, available: Property[], dataModified: string | null) {
  const path = `/properties/${slug}/`;
  const nd = filterByCity(available, "new-damietta");
  const nm = filterByCity(available, "new-mansoura");
  const prices = available.map((p) => Number(p.price) || 0).filter((n) => n > 0);
  const lede = hubLede(slug, {
    nD: nd.length,
    nM: nm.length,
    minPrice: prices.length ? Math.min(...prices) : 0,
    maxPrice: prices.length ? Math.max(...prices) : 0,
    dataModified,
  });
  const listings = available.map((p) => ({
    price: Number(p.price) || 0,
    area: Number(p.details?.area_sqm) || 0,
    cityId: p.location.cityId || "new-damietta",
  }));
  // لا Question مملوك هنا: سؤال السعر المحسوب بلا Question، وQ182 («أين أجد أراضي للبيع في دمياط الجديدة؟»)
  // مالكه /new-damietta/#lands لأن صفحة الأراضي noindex ما دامت بلا أراضٍ متاحة — هنا رابط إليه فقط
  const priceAnswer = HUB[slug].priceQuestion
    ? hubPriceAnswer(slug, {
        cities: {
          "new-damietta": hubCityStats(listings, HUB[slug].group, "new-damietta"),
          "new-mansoura": hubCityStats(listings, HUB[slug].group, "new-mansoura"),
        },
        dataModified,
      })
    : null;

  const answersSlot = (
    <div className="mt-12 bg-white rounded-xl p-6 shadow-sm space-y-8">
      {priceAnswer && (
        <section id="price" className="scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{hubPriceQuestion(slug)}</h2>
          {priceAnswer.split(/\n\n+/).map((para, i) => (
            <p key={i} className="text-gray-700 leading-relaxed mb-2">
              <RichText text={para} />
            </p>
          ))}
          <p className="sources text-xs text-gray-500 mt-2">
            المصدر: إعلانات البيع النشطة على eltaiseer.com (وسيط لكل مدينة من 3 عروض على الأقل).
          </p>
        </section>
      )}
      {slug === "lands" && <TeaserLinks title="أسئلة تجيب عنها صفحات أخرى" items={[teaser("Q182")]} />}
      {slug === "lands" && (
        <p className="text-gray-700">
          تبحث عن أرض بيت الوطن؟{" "}
          <Link href="/beit-al-watan-for-sale/" prefetch={false} className={LINK}>
            أراضي بيت الوطن للبيع (موثّقة)
          </Link>
        </p>
      )}
      <Freshness data={dataModified} dataLabel="آخر تحديث للعروض" className="freshness text-sm text-gray-500" />
    </div>
  );
  return { lede, answersSlot };
}


// فئة بلا عروض متاحة = noindex,follow (القاعدة وشرحها في lib/indexRules.ts)؛
// من نفس بيانات الخادم التي تعرضها الصفحة. العنوان والوصف والـ canonical من layout الفئة
export async function categoryRobotsMetadata(slug: CategorySlug): Promise<Metadata> {
  const { ok, properties } = await getPropertiesServerResult();
  // فشل الجلب في صفحة مخزنة (ISR): نرمي ليبقي Next آخر نسخة سليمة بدل تخزين قائمة فارغة (انظر getPropertiesForIsr)
  if (!ok && process.env.NEXT_PHASE !== "phase-production-build") throw new Error("Firestore unavailable: keeping the last good page");
  const available = categoryProperties(properties, slug).filter(isAvailable).length;
  return ok && !isCategoryIndexable(available) ? { robots: NOINDEX_FOLLOW } : {};
}

// canonical ذاتي لصفحة الترقيم N (لا يشير للصفحة الأولى)
export async function pagedCanonicalMetadata(basePath: string, n: string, parent: ResolvingMetadata): Promise<Metadata> {
  const page = parsePageParam(n);
  if (!page) return {};
  return pagedMetadata(parent, `https://eltaiseer.com${basePath}?page=${page}`, page);
}

// صفحة فئة أنواع (الأساسية أو ?page=N) — شريحة الصفحة وروابط الترقيم في HTML الخادم
export default async function CategoryListing({
  slug,
  page,
  Client,
}: {
  slug: TypeCategorySlug;
  page: number;
  Client: ComponentType<CategoryClientProps>;
}) {
  const all = await getPropertiesForIsr();
  const filtered = categoryProperties(all, slug);
  // رقم صفحة أبعد من آخر صفحة = 404 (الصفحة الأولى تبقى دائماً)
  if (page > totalPages(filtered.length, CATEGORY_PAGE_SIZE)) {
    notFound();
  }

  // رسم الصفحة الأولى فقط (رابطها الأساسي)؛ صفحات ?page=N بلا JSON-LD
  const available = filtered.filter(isAvailable);
  const path = `/properties/${slug}/`;
  const dataModified = maxIso(available.map((p) => p.updatedAt || p.createdAt));
  const content = page === 1 ? hubContent(slug, available, dataModified) : null;
  const pageGraph =
    page === 1
      ? graph(
          webPage({
            path,
            type: "CollectionPage",
            name: LIST_NAMES[slug],
            mainEntity: available.length ? ref(`${pageUrl(path)}#itemlist`) : undefined,
            dateModified: dataModified ? cairoIso(dataModified) : undefined,
          }),
          available.length
            ? itemListNode(path, available.slice(0, 20).map((p) => getPropertyUrl(p)), {
                name: LIST_NAMES[slug],
                total: available.length,
              })
            : null,
          // نفس حلقات مسار التنقل الظاهر (المكوّن بلا schema) داخل الرسم الواحد
          breadcrumbNode(
            path,
            breadcrumbPresets[slug].map((it) => ({ name: it.label, path: it.href || path }))
          )
        )
      : null;

  return (
    <>
      {pageGraph && <JsonLd graph={pageGraph} />}
      <Client
        initialProperties={serializeProperties(filtered)}
        page={page}
        lede={content?.lede}
        answersSlot={content?.answersSlot}
      />
    </>
  );
}
