import { notFound, permanentRedirect } from "next/navigation";
import { getPropertyServer } from "@/lib/serverProperties";
import { getPropertyUrl } from "@/lib/districtSlugs";

// صفحة العقار ديناميكية (force-dynamic في page.tsx) — فالتحويل هنا يخرج 308 مع Location دائماً
export const dynamic = "force-dynamic";

function safeDecode(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

// الفحص هنا في layout وليس في page.tsx: loading.tsx لهذا المسار يغلف الصفحة وحدها،
// فأي notFound()/redirect() داخلها يخرج بعد بث 200. الـ layout فوق حد loading فتخرج 404 و308 حقيقية.
// - عقار محذوف أو معرف غير موجود (أو بحالة أحرف خاطئة) → 404 حقيقي بدل soft-404 بحالة 200
// - عقار موجود تحت مدينة أو حي غير رابطه الأساسي → 308 مباشرة إلى /{city}/{district}/{id}/
// - فشل الاتصال بـ Firestore يُرمى كخطأ (500) ولا يتحول 404 يُسقط إعلاناً حقيقياً من الفهرس
export default async function PropertyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { city: string; district: string; propertyId: string };
}) {
  const { city, district, propertyId } = params;

  const property = await getPropertyServer(propertyId);
  if (!property) notFound();

  const canonicalPath = getPropertyUrl(property);
  const requestedPath = `/${city}/${safeDecode(district)}/${propertyId}`;
  if (requestedPath !== canonicalPath) {
    permanentRedirect(encodeURI(`${canonicalPath}/`));
  }

  return children;
}
