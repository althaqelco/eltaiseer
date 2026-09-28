import { notFound } from "next/navigation";
import PropertiesClient from "./PropertiesClient";
import {
  getPropertiesForIsr,
  serializeProperties,
  buildItemListSchema,
} from "@/lib/serverProperties";
import { HUB_PAGE_SIZE, totalPages } from "@/lib/pagination";

// صفحة «جميع العقارات» (الأساسية أو ?page=N) — H1 وشريحة الصفحة وروابط الترقيم في HTML الخادم
export default async function PropertiesListing({ page }: { page: number }) {
  const all = await getPropertiesForIsr();
  if (page > totalPages(all.length, HUB_PAGE_SIZE)) {
    notFound();
  }

  const itemListSchema = buildItemListSchema(
    all.filter((p) => p.status !== "تم البيع"),
    "جميع العقارات للبيع في دمياط الجديدة والمنصورة الجديدة",
    30
  );

  return (
    <>
      {all.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      <PropertiesClient initialProperties={serializeProperties(all)} page={page} />
    </>
  );
}
