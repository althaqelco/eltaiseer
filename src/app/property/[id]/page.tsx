import { notFound, permanentRedirect } from "next/navigation";
import { getPropertyServer } from "@/lib/serverProperties";
import { getPropertyUrl } from "@/lib/districtSlugs";

// مسار قديم /property/:id — كان يعرض نسخة عميل مكررة بحالة 200. الآن:
// - معرفات الموقع القديم التجريبية (prop-001…prop-100) تُحوَّل 301 إلى /properties/ من next.config.mjs قبل الوصول هنا
// - معرف Firestore حقيقي → 308 مباشرة إلى رابطه الأساسي /{city}/{district}/{id}/
// - معرف غير موجود → 404 حقيقي
// الصفحة ديناميكية (force-dynamic) عمداً: redirect داخل ISR يفقد رأس Location في Next 14.2 عند الخدمة من الكاش
export const dynamic = "force-dynamic";

export default async function LegacyPropertyPage({ params }: { params: { id: string } }) {
  const property = await getPropertyServer(params.id);
  if (!property) notFound();
  permanentRedirect(encodeURI(`${getPropertyUrl(property)}/`));
}
