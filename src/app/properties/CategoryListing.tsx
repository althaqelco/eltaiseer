import type { ComponentType } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPropertiesServer,
  getPropertiesServerResult,
  serializeProperties,
  buildItemListSchema,
} from "@/lib/serverProperties";
import {
  categoryProperties,
  isAvailable,
  type CategorySlug,
  type TypeCategorySlug,
} from "@/lib/listingCategories";
import { isCategoryIndexable, NOINDEX_FOLLOW } from "@/lib/indexRules";
import { CATEGORY_PAGE_SIZE, parsePageParam, totalPages } from "@/lib/pagination";
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
  const available = categoryProperties(properties, slug).filter(isAvailable).length;
  return ok && !isCategoryIndexable(available) ? { robots: NOINDEX_FOLLOW } : {};
}

// canonical ذاتي لصفحة الترقيم N (لا يشير للصفحة الأولى)
export function pagedCanonicalMetadata(basePath: string, n: string): Metadata {
  const page = parsePageParam(n);
  if (!page) return {};
  return { alternates: { canonical: `https://eltaiseer.com${basePath}?page=${page}` } };
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
  const all = await getPropertiesServer();
  const filtered = categoryProperties(all, slug);
  // رقم صفحة أبعد من آخر صفحة = 404 (الصفحة الأولى تبقى دائماً)
  if (page > totalPages(filtered.length, CATEGORY_PAGE_SIZE)) {
    notFound();
  }

  const itemListSchema = buildItemListSchema(filtered.filter(isAvailable), LIST_NAMES[slug]);

  return (
    <>
      {filtered.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      <Client initialProperties={serializeProperties(filtered)} page={page} />
    </>
  );
}
