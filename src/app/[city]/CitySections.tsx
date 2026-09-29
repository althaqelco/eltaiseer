// أجزاء خادم مشتركة بين صفحة المدينة وصفحات أحيائها: روابط الأحياء، وصندوق «بيت الوطن»، والمقالات المرتبطة،
// ووجهة رابط إعادة البيع الموثّقة. لا "use client" هنا ولا في مستورديها (النصوص من src/lib/answers/local.ts).
import Link from "next/link";
import { CITY_DATA, type CityId } from "@/lib/egyptPlaces";
import { getDistrictSlug } from "@/lib/districtSlugs";
import { BW_BOX, CITY_POSTS, RESALE_ANCHOR } from "@/lib/answers/local";
import { PlatformLink, platformLive } from "@/lib/bw/platformLinks";
import { getActiveListings } from "@/lib/bw/listings";
import { isLive } from "@/lib/bw/calc";
import { MIN_POINTS } from "@/lib/bw/types";
import { BW_BASE } from "@/lib/bw/constants";

const LINK = "text-orange-700 hover:underline";

/**
 * وجهة رابط «أراضي بيت الوطن للبيع في {المدينة} (موثّقة)»: صفحة المدينة حين تكون قابلة للفهرسة
 * (نفس شرط صفحة مدينة إعادة البيع: 5 إعلانات حية، أو 3 في حي واحد)، وإلا المحور (spec-final A7).
 */
export async function resaleCityHref(citySlug: string): Promise<string> {
  const now = Date.now(); // للمقارنة بموعد إعادة التوثيق فقط، لا تاريخ محتوى
  const listings = (await getActiveListings()).filter((l) => l.citySlug === citySlug && isLive(l, now));
  const byDistrict: Record<string, number> = {};
  for (const l of listings) byDistrict[l.districtSlug || l.district] = (byDistrict[l.districtSlug || l.district] || 0) + 1;
  const indexable = listings.length >= 5 || Object.values(byDistrict).some((n) => n >= MIN_POINTS);
  return indexable ? `${BW_BASE}/${citySlug}/` : `${BW_BASE}/`;
}

/** رابط لكل حي في المدينة، مجمّعة بفئاتها */
export function DistrictLinks({ citySlug }: { citySlug: string }) {
  const data = CITY_DATA[citySlug as CityId];
  if (!data) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      {data.categories.map((category) => (
        <div key={category.id} className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2 text-gray-800">{category.nameAr}</h3>
          <ul className="text-sm space-y-1">
            {category.districts.map((district) => (
              <li key={district}>
                <Link href={`/${citySlug}/${getDistrictSlug(district)}/`} prefetch={false} className={LINK}>
                  عقارات {district}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

const BW_DISTRICTS = [
  { slug: "beit-al-watan-east", label: "بيت الوطن شرق" },
  { slug: "beit-al-watan-west", label: "بيت الوطن غرب" },
  { slug: "beit-al-watan-beach", label: "بيت الوطن امتداد الشاطئ" },
];

/**
 * صندوق «بيت الوطن في {المدينة}» (عنوان خبري، ليس في FAQPage، بلا أرقام حية ولا getBwLive).
 * skipDistrict: صفحة حي بيت الوطن الحالية لا تربط نفسها.
 * linksOnly: الروابط وحدها، داخل قسم Q163 على /new-damietta/ (القسم نفسه يحمل #beit-al-watan وعنوان السؤال).
 */
export function BeitAlWatanBox({
  citySlug,
  resaleHref,
  skipDistrict,
  withText = true,
  linksOnly = false,
}: {
  citySlug: string;
  resaleHref: string;
  skipDistrict?: string;
  withText?: boolean;
  linksOnly?: boolean;
}) {
  const box = BW_BOX[citySlug];
  if (!box) return null;
  const platformPath = `/baitelwatan/cities/${citySlug}/`;
  const [before, after] = box.text.split("{PLATFORM}");
  const links = (
    <ul className="mt-3 space-y-1 text-sm">
      {citySlug === "new-damietta" &&
        BW_DISTRICTS.filter((d) => d.slug !== skipDistrict).map((d) => (
          <li key={d.slug}>
            <Link href={`/new-damietta/${d.slug}/`} prefetch={false} className={LINK}>
              {d.label}
            </Link>
          </li>
        ))}
      <li>
        <Link href={resaleHref} prefetch={false} className={LINK}>
          {RESALE_ANCHOR[citySlug]}
        </Link>
      </li>
      {after === undefined && platformLive(platformPath) && (
        <li>
          <a href={platformPath} className={LINK}>
            {box.platformAnchor}
          </a>
        </li>
      )}
    </ul>
  );
  if (linksOnly) return links;
  return (
    <aside id="beit-al-watan" className="rounded-xl border border-orange-200 bg-orange-50 p-5 scroll-mt-24">
      <h2 className="text-xl font-bold text-gray-900 mb-2">{box.heading}</h2>
      {withText && (
        <p className="text-gray-700 leading-relaxed">
          {before}
          {after !== undefined && (
            <>
              <PlatformLink path={platformPath} className={LINK} fallback={box.platformFallback}>
                {box.platformAnchor}
              </PlatformLink>
              {after}
            </>
          )}
        </p>
      )}
      {links}
    </aside>
  );
}

/** مقالات مرتبطة بالمدينة، بعناوينها */
export function RelatedPosts({ citySlug, title = "اقرأ أيضًا" }: { citySlug: string; title?: string }) {
  const posts = CITY_POSTS[citySlug];
  if (!posts?.length) return null;
  return (
    <nav aria-label={title} className="mt-6">
      <p className="text-sm font-semibold text-gray-700 mb-2">{title}</p>
      <ul className="list-disc pr-5 space-y-1 text-sm">
        {posts.map((p) => (
          <li key={p.href}>
            <Link href={p.href} prefetch={false} className={LINK}>
              {p.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
