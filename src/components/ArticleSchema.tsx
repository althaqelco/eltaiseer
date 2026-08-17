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
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: image,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Organization",
      name: "التيسير للعقارات",
      url: "https://eltaiseer.com",
    },
    publisher: {
      "@type": "Organization",
      name: "التيسير للعقارات",
      logo: {
        "@type": "ImageObject",
        url: "https://eltaiseer.com/logo.png/",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    inLanguage: "ar",
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://eltaiseer.com/#website",
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
        item: "https://eltaiseer.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "المدونة",
        item: "https://eltaiseer.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: url,
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
