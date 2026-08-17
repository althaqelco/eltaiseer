import ShopsClient from "./ShopsClient";
import {
  getPropertiesServer,
  serializeProperties,
  filterByTypes,
  buildItemListSchema,
} from "@/lib/serverProperties";

// ISR كل 5 دقائق — عقارات الفئة تظهر في HTML الخادم
export const revalidate = 300;

const TYPES = ["محل تجاري", "مقر إداري", "مكتب"];

export default async function Page() {
  const all = await getPropertiesServer();
  const filtered = filterByTypes(all, TYPES);

  const itemListSchema = buildItemListSchema(
    filtered.filter((p) => p.status !== "تم البيع"),
    "محلات ومقرات تجارية للبيع في دمياط الجديدة والمنصورة الجديدة"
  );

  return (
    <>
      {filtered.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      <ShopsClient initialProperties={serializeProperties(filtered)} />
    </>
  );
}
