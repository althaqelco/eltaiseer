// رسم JSON-LD لمقالات المدونة (spec-final A1.3): WebPage + Article + BreadcrumbList في سكربت واحد مغلق على السجل.
// المؤلف والناشر = #organization حتى يقرر المالك محررًا باسمه [OWNER D1]. لا HowTo (نوع محظور في الخطة).
// التواريخ من سجل التحرير (lib/seo/editorial.ts): dateModified = آخر تعديل فعلي للنص، لا تاريخ النشر.
import { JsonLd } from "@/components/JsonLd";
import { EDITORIAL, editorialIso } from "@/lib/seo/editorial";
import { cairoLocalToIso, cairoDate } from "@/lib/seo/time";
import { IN_LANGUAGE, ORG, breadcrumbNode, cityId, graph, pageUrl, ref, webPage } from "@/lib/seo/schema";

type CitySlug = "new-damietta" | "new-mansoura";

interface ArticleSchemaProps {
  title: string;
  description: string;
  url: string;
  image: string;
  /** احتياطي لمسار بلا سجل تحرير */
  datePublished: string;
  cities?: CitySlug[];
  /** عقد إضافية في نفس الرسم (مثل FAQPage للمقال المالك لسؤال) */
  extra?: (object | null)[];
}

function postPath(url: string): string {
  const p = new URL(url, "https://eltaiseer.com").pathname;
  return p.endsWith("/") ? p : `${p}/`;
}

export function articleDates(path: string, fallback?: string): { published?: string; modified?: string } {
  if (EDITORIAL[path]) return { published: editorialIso(path, "published"), modified: editorialIso(path, "modified") };
  const d = fallback ? cairoLocalToIso(fallback) : undefined;
  return { published: d, modified: d };
}

export function ArticleSchema({ title, description, url, image, datePublished, cities, extra = [] }: ArticleSchemaProps) {
  const path = postPath(url);
  const u = pageUrl(path);
  const { published, modified } = articleDates(path, datePublished);
  const text = `${title} ${description}`;
  const about = (cities ?? (["new-damietta", "new-mansoura"] as CitySlug[]).filter((c) =>
    text.includes(c === "new-damietta" ? "دمياط الجديدة" : "المنصورة الجديدة")
  )).map((c) => ref(cityId(c)));

  const g = graph(
    webPage({
      path,
      name: title,
      description,
      mainEntity: ref(`${u}#article`),
      datePublished: published,
      dateModified: modified,
      primaryImage: image,
      hasPart: extra.some((n) => n && (n as { "@type"?: string })["@type"] === "FAQPage") ? [ref(`${u}#faq`)] : undefined,
    }),
    {
      "@type": "Article",
      "@id": `${u}#article`,
      headline: title.length > 110 ? `${title.slice(0, 107)}...` : title,
      description,
      image: { "@id": `${u}#primaryimage` },
      datePublished: published,
      dateModified: modified,
      author: ORG,
      publisher: ORG,
      inLanguage: IN_LANGUAGE,
      isPartOf: ref(`${u}#webpage`),
      mainEntityOfPage: ref(`${u}#webpage`),
      ...(about.length ? { about } : {}),
    },
    breadcrumbNode(path, [
      { name: "الرئيسية", path: "/" },
      { name: "المدونة", path: "/blog/" },
      { name: title, path },
    ]),
    ...extra
  );
  return <JsonLd graph={g} />;
}

/** سطر التاريخ الظاهر في رأس المقال: نُشر / آخر تحديث، بـ <time> يطابق dateModified في JSON-LD */
export function PostDates({ path, className = "flex items-center gap-1" }: { path: string; className?: string }) {
  const { published, modified } = articleDates(path);
  if (!published) return null;
  return (
    <span className={className}>
      نُشر <time dateTime={published}>{cairoDate(published)}</time>
      {modified && modified !== published && (
        <>
          {" "}· آخر تحديث <time dateTime={modified}>{cairoDate(modified)}</time>
        </>
      )}
    </span>
  );
}
