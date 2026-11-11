import type { Metadata } from "next";
import { buildCategorySummary, buildCategoryDescription } from "@/lib/liveFacts";
import ClinicsClient from "./ClinicsClient";
import {
  getPropertiesServer,
  serializeProperties,
  filterByTypes,
  buildItemListSchema,
} from "@/lib/serverProperties";

// ISR كل 5 دقائق — عقارات الفئة تظهر في HTML الخادم
export const revalidate = 300;

const TYPES = ["عيادة"];

// وصف الصفحة من المعروض الفعلي؛ الفئة الفارغة لا تُفهرس (صفحة بلا عقارات = محتوى ضعيف) وتعود للفهرسة تلقائياً عند توفر معروض
export async function generateMetadata(): Promise<Metadata> {
  const all = await getPropertiesServer();
  const empty = filterByTypes(all, TYPES).filter((p) => p.status !== "تم البيع").length === 0;
  return {
    description: buildCategoryDescription(all, "clinics", "عيادات طبية للبيع في دمياط الجديدة والمنصورة الجديدة."),
    ...(empty ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function Page() {
  const all = await getPropertiesServer();
  const filtered = filterByTypes(all, TYPES);

  const itemListSchema = buildItemListSchema(
    filtered.filter((p) => p.status !== "تم البيع"),
    "عيادات للبيع في دمياط الجديدة والمنصورة الجديدة"
  );

  return (
    <>
      {filtered.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      <ClinicsClient
        initialProperties={serializeProperties(filtered)}
        summary={buildCategorySummary(all, "clinics")}
      />
    </>
  );
}
