// src/lib/seo/property.ts
// رسم JSON-LD لصفحة العقار (spec-final A1.3 / templates T5): صفحة RealEstateListing بمعرّف #webpage،
// والوحدة #property بنوعها، والعرض #offer من #organization، داخل كيان الحي. لا وكيل مجهول ولا contentLocation.
// نقي بلا Next ولا Firebase.
import { ORG, breadcrumbNode, districtPlaceId, graphWith, pageUrl, ref, webPage } from "./schema";
import { TYPE_GROUP } from "./prices";
import { cairoIso } from "./time";

export interface PropertyGraphInput {
  id: string;
  title: string;
  description: string;
  type: string;
  cityId: string;
  cityName: string;
  district: string;
  districtSlug: string;
  /** false لحي غير معرّف في المدينة: لا كيان حي معرّف في الصفحة فلا نشير إليه */
  districtKnown: boolean;
  area: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  sold: boolean;
  images: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

function unitType(type: string): string {
  const g = TYPE_GROUP[type];
  if (g === "apartment") return "Apartment";
  if (g === "villa") return "SingleFamilyResidence";
  if (g === "chalet") return "Accommodation";
  return "Place";
}

export function propertyGraph(p: PropertyGraphInput): object {
  const path = `/${p.cityId}/${p.districtSlug}/${p.id}/`;
  const u = pageUrl(path);
  const placeId = districtPlaceId(p.cityId, p.districtSlug);
  const posted = p.createdAt ? cairoIso(p.createdAt) : undefined;
  const modified = p.updatedAt ? cairoIso(p.updatedAt) : posted;
  const page = webPage({
    path,
    type: "RealEstateListing",
    name: p.title,
    description: p.description,
    mainEntity: ref(`${u}#property`),
    dateModified: modified,
    primaryImage: p.images[0],
  });
  return graphWith(
    p.districtKnown ? [placeId] : [],
    { ...page, ...(posted ? { datePosted: posted } : {}), offers: ref(`${u}#offer`) },
    {
      "@type": unitType(p.type),
      "@id": `${u}#property`,
      name: p.title,
      ...(p.area > 0 ? { floorSize: { "@type": "QuantitativeValue", value: p.area, unitCode: "MTK" } } : {}),
      ...(p.bedrooms > 0 ? { numberOfRooms: p.bedrooms } : {}),
      ...(p.bathrooms > 0 ? { numberOfBathroomsTotal: p.bathrooms } : {}),
      address: {
        "@type": "PostalAddress",
        addressLocality: p.district,
        addressRegion: p.cityName,
        addressCountry: "EG",
      },
      ...(p.districtKnown ? { containedInPlace: ref(placeId) } : {}),
      ...(p.images.length ? { image: p.images.slice(0, 6) } : {}),
    },
    {
      "@type": "Offer",
      "@id": `${u}#offer`,
      url: u,
      price: p.price,
      priceCurrency: "EGP",
      availability: p.sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      itemOffered: ref(`${u}#property`),
      offeredBy: ORG,
    },
    breadcrumbNode(path, [
      { name: "الرئيسية", path: "/" },
      { name: "العقارات", path: "/properties/" },
      { name: p.cityName, path: `/${p.cityId}/` },
      ...(p.districtKnown ? [{ name: p.district, path: `/${p.cityId}/${p.districtSlug}/` }] : []),
      { name: p.title, path },
    ])
  );
}
