export function OrganizationJsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": "https://eltaiseer.com/#organization",
    name: "التيسير للعقارات",
    alternateName: "El Taiseer Real Estate",
    description: "شركة التيسير للعقارات - أفضل عقارات دمياط الجديدة للبيع. شقق، فيلات، دوبلكس، محلات تجارية، أراضي بأسعار تنافسية.",
    url: "https://eltaiseer.com",
    logo: "https://eltaiseer.com/logo.png",
    image: "https://eltaiseer.com/og-image.jpg",
    telephone: "+201000000000",
    email: "info@eltaiseer.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "دمياط الجديدة",
      addressLocality: "دمياط الجديدة",
      addressRegion: "دمياط",
      addressCountry: "EG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "31.4175",
      longitude: "31.8144",
    },
    areaServed: {
      "@type": "City",
      name: "دمياط الجديدة",
      containedInPlace: {
        "@type": "State",
        name: "دمياط",
        containedInPlace: {
          "@type": "Country",
          name: "مصر",
        },
      },
    },
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "09:00",
      closes: "21:00",
    },
    sameAs: [
      "https://www.facebook.com/eltaiseer",
      "https://www.instagram.com/eltaiseer",
      "https://wa.me/201000000000",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
}

export function WebsiteJsonLd() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://eltaiseer.com/#website",
    url: "https://eltaiseer.com",
    name: "التيسير للعقارات",
    description: "أفضل عقارات دمياط الجديدة للبيع - شقق، فيلات، دوبلكس، محلات تجارية، أراضي",
    publisher: {
      "@id": "https://eltaiseer.com/#organization",
    },
    inLanguage: "ar-EG",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://eltaiseer.com/properties?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}

export function LocalBusinessJsonLd() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://eltaiseer.com/#localbusiness",
    name: "التيسير للعقارات",
    image: "https://eltaiseer.com/logo.png",
    telephone: "+201000000000",
    address: {
      "@type": "PostalAddress",
      streetAddress: "دمياط الجديدة",
      addressLocality: "دمياط الجديدة",
      addressRegion: "دمياط",
      postalCode: "34511",
      addressCountry: "EG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 31.4175,
      longitude: 31.8144,
    },
    url: "https://eltaiseer.com",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "09:00",
        closes: "21:00",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "150",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
    />
  );
}

interface PropertyJsonLdProps {
  property: {
    id: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    type: string;
    location: {
      district: string;
      address: string;
    };
    details: {
      area_sqm: number;
      bedrooms: number;
      bathrooms: number;
    };
  };
}

export function PropertyJsonLd({ property }: PropertyJsonLdProps) {
  const propertySchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `https://eltaiseer.com/property/${property.id}`,
    name: property.title,
    description: property.description,
    url: `https://eltaiseer.com/property/${property.id}`,
    datePosted: new Date().toISOString(),
    image: property.images,
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "EGP",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "RealEstateAgent",
        name: "التيسير للعقارات",
        url: "https://eltaiseer.com",
      },
    },
    about: {
      "@type": "Residence",
      name: property.title,
      description: property.description,
      floorSize: {
        "@type": "QuantitativeValue",
        value: property.details.area_sqm,
        unitCode: "MTK",
      },
      numberOfRooms: property.details.bedrooms,
      numberOfBathroomsTotal: property.details.bathrooms,
      address: {
        "@type": "PostalAddress",
        addressLocality: property.location.district,
        addressRegion: "دمياط الجديدة",
        addressCountry: "EG",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(propertySchema) }}
    />
  );
}

export function FAQJsonLd() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "ما هي أسعار الشقق في دمياط الجديدة؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "تتراوح أسعار الشقق في دمياط الجديدة من 500,000 جنيه إلى 5 مليون جنيه حسب المساحة والموقع والتشطيب. نوفر خيارات متنوعة تناسب جميع الميزانيات.",
        },
      },
      {
        "@type": "Question",
        name: "هل يتوفر تقسيط للشقق في دمياط الجديدة؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "نعم، نوفر خطط تقسيط مرنة تصل إلى 10 سنوات مع مقدم يبدأ من 10% فقط. تواصل معنا للحصول على أفضل عرض.",
        },
      },
      {
        "@type": "Question",
        name: "ما هي أفضل المناطق للسكن في دمياط الجديدة؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "تعتبر أحياء دمياط الجديدة من أفضل المناطق السكنية، خاصة الحي الأول والثاني والثالث. كما تتميز منطقة الكورنيش والمناطق القريبة من الخدمات.",
        },
      },
      {
        "@type": "Question",
        name: "ما أنواع العقارات المتوفرة في دمياط الجديدة؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "نوفر شقق سكنية، فيلات مستقلة، دوبلكس، بنتهاوس، روف، محلات تجارية، مكاتب إدارية، وأراضي بمختلف المساحات.",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}

export function ItemListJsonLd({ properties }: { properties: { id: string; title: string; price: number; images: string[] }[] }) {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: properties.slice(0, 10).map((property, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "RealEstateListing",
        name: property.title,
        url: `https://eltaiseer.com/property/${property.id}`,
        image: property.images[0],
        offers: {
          "@type": "Offer",
          price: property.price,
          priceCurrency: "EGP",
        },
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
    />
  );
}
