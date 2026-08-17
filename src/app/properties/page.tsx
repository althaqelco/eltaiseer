import PropertiesClient from "./PropertiesClient";
import {
  getPropertiesServer,
  serializeProperties,
  buildItemListSchema,
} from "@/lib/serverProperties";

// ISR كل 5 دقائق — كل العقارات تظهر في HTML الخادم
export const revalidate = 300;

export default async function PropertiesPage() {
  const all = await getPropertiesServer();

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
      <PropertiesClient initialProperties={serializeProperties(all)} />
    </>
  );
}
