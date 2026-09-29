import type { ComponentType } from "react";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getPropertiesForIsr, getPropertiesServerResult, serializeProperties } from "@/lib/serverProperties";
import { getPropertyUrl } from "@/lib/districtSlugs";
import { JsonLd } from "@/components/JsonLd";
import { graph, itemListNode, pageUrl, ref, webPage } from "@/lib/seo/schema";
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

export type CategoryClientProps = { initialProperties: Property[]; page?: number };

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
  const pageGraph =
    page === 1
      ? graph(
          webPage({
            path,
            type: "CollectionPage",
            name: LIST_NAMES[slug],
            breadcrumb: false, // BreadcrumbList يطبعه مكوّن المسار في الصفحة
            mainEntity: available.length ? ref(`${pageUrl(path)}#itemlist`) : undefined,
            dateModified: dataModified ? cairoIso(dataModified) : undefined,
          }),
          available.length
            ? itemListNode(path, available.slice(0, 20).map((p) => getPropertyUrl(p)), {
                name: LIST_NAMES[slug],
                total: available.length,
              })
            : null
        )
      : null;

  return (
    <>
      {pageGraph && <JsonLd graph={pageGraph} />}
      <Client initialProperties={serializeProperties(filtered)} page={page} />
    </>
  );
}
