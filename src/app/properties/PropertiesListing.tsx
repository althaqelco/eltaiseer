import { notFound } from "next/navigation";
import PropertiesClient from "./PropertiesClient";
import { getPropertiesForIsr, serializeProperties } from "@/lib/serverProperties";
import { getPropertyUrl } from "@/lib/districtSlugs";
import { JsonLd } from "@/components/JsonLd";
import { graph, itemListNode, pageUrl, ref, webPage } from "@/lib/seo/schema";
import { cairoIso, maxIso } from "@/lib/seo/time";
import { HUB_PAGE_SIZE, totalPages } from "@/lib/pagination";

// صفحة «جميع العقارات» (الأساسية أو ?page=N) — H1 وشريحة الصفحة وروابط الترقيم في HTML الخادم
export default async function PropertiesListing({ page }: { page: number }) {
  const all = await getPropertiesForIsr();
  if (page > totalPages(all.length, HUB_PAGE_SIZE)) {
    notFound();
  }

  const active = all.filter((p) => p.status !== "تم البيع");
  const name = "جميع العقارات للبيع في دمياط الجديدة والمنصورة الجديدة";
  const dataModified = maxIso(active.map((p) => p.updatedAt || p.createdAt));
  const pageGraph =
    page === 1
      ? graph(
          webPage({
            path: "/properties/",
            type: "CollectionPage",
            name,
            breadcrumb: false, // BreadcrumbList يطبعه مكوّن المسار في الصفحة
            mainEntity: active.length ? ref(`${pageUrl("/properties/")}#itemlist`) : undefined,
            dateModified: dataModified ? cairoIso(dataModified) : undefined,
          }),
          active.length
            ? itemListNode("/properties/", active.slice(0, 30).map((p) => getPropertyUrl(p)), { name, total: active.length })
            : null
        )
      : null;

  return (
    <>
      {pageGraph && <JsonLd graph={pageGraph} />}
      <PropertiesClient initialProperties={serializeProperties(all)} page={page} />
    </>
  );
}
