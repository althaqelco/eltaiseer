import { ORG_ID, WEBSITE_ID, ORG_NAME, SITE_URL, absUrl } from "@/lib/site";
import { getBlogPost } from "@/lib/blogPosts";

interface ArticleSchemaProps {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  isHowTo?: boolean;
  howToSteps?: Array<{ name: string; text: string }>;
}

export function ArticleSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  isHowTo,
  howToSteps,
}: ArticleSchemaProps) {
  // الصفحات تمرر الرابط بدون شرطة ختامية؛ الـ canonical بشرطة — نوحّدهما هنا مرة واحدة
  const pageUrl = absUrl(url);
  // التاريخان من سجل المدونة (نفس مصدر التاريخ المرئي والـ RSS والـ sitemap)؛ القيم الممررة احتياط لمقال غير مسجل
  const post = getBlogPost(pageUrl.replace(/\/$/, "").split("/").pop() || "");
  const published = post?.published || datePublished;
  const modified = post?.updated || dateModified || datePublished;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: image,
    datePublished: published,
    dateModified: modified,
    // الكاتب والناشر هما نفس الكيان المعرّف في الصفحة الرئيسية (@id) — لا كيان مجهول جديد في كل مقال
    author: {
      "@type": "RealEstateAgent",
      "@id": ORG_ID,
      name: ORG_NAME,
      url: `${SITE_URL}/about/`,
    },
    publisher: {
      "@type": "RealEstateAgent",
      "@id": ORG_ID,
      name: ORG_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    url: pageUrl,
    inLanguage: "ar-EG",
    isPartOf: {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "الرئيسية",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "المدونة",
        item: `${SITE_URL}/blog/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: pageUrl,
      },
    ],
  };

  const howToSchema = isHowTo && howToSteps ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    description: description,
    step: howToSteps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}
    </>
  );
}
