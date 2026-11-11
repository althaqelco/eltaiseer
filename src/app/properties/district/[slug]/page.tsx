import { notFound, permanentRedirect } from "next/navigation";
import { getCityByDistrict } from "@/lib/egyptPlaces";
import { SLUG_TO_DISTRICT } from "@/lib/districtSlugs";

// مسار قديم مكرر لصفحات الأحياء (53 صفحة بنفس محتوى /{city}/{district}/).
// كان يعرض نسخة ثانية ويكتفي بـ canonical؛ الآن تحويل دائم 308 للنسخة الأساسية
// حتى تتجمع كل الإشارات على رابط واحد ولا يضيع الزحف على نسخ مكررة.
export const dynamic = "force-dynamic";

export default function LegacyDistrictPage({ params }: { params: { slug: string } }) {
  const districtName = SLUG_TO_DISTRICT[params.slug];
  if (!districtName) notFound();
  const citySlug = getCityByDistrict(districtName)?.id || "new-damietta";
  permanentRedirect(`/${citySlug}/${params.slug}/`);
}
