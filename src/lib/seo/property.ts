// src/lib/seo/property.ts
// رسم JSON-LD لصفحة العقار (spec-final A1.3 / templates T5): صفحة RealEstateListing بمعرّف #webpage،
// والوحدة #property بنوعها، والعرض #offer من #organization، داخل كيان الحي. لا وكيل مجهول ولا contentLocation.
// نقي بلا Next ولا Firebase.
import { ORG, breadcrumbNode, districtPlaceId, graphWith, pageUrl, ref, webPage } from "./schema";
import { TYPE_GROUP } from "./prices";
import { cairoIso } from "./time";
import { CITIES } from "../egyptPlaces";

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

/** نوع سكني من Accommodation (يقبل floorSize وnumberOfRooms وnumberOfBathroomsTotal)، أو null لغير السكني */
function residentialType(type: string): string | null {
  const g = TYPE_GROUP[type];
  if (g === "apartment") return "Apartment";
  if (g === "villa") return "SingleFamilyResidence";
  if (g === "chalet") return "Accommodation";
  return null;
}

/**
 * الوحدة #property: السكني بنوعه ومساحته وغرفه وحماماته؛ وغير السكني (محل، عيادة، مقر، أرض، مبنى) Place
 * بنوعه نصًا في additionalType ومساحته PropertyValue — Place لا يقبل floorSize ولا numberOfRooms ولا numberOfBathroomsTotal.
 */
function unitFields(p: PropertyGraphInput): Record<string, unknown> {
  const t = residentialType(p.type);
  const area = p.area > 0 ? { "@type": "QuantitativeValue", value: p.area, unitCode: "MTK" } : null;
  if (t) {
    return {
      "@type": t,
      ...(area ? { floorSize: area } : {}),
      ...(p.bedrooms > 0 ? { numberOfRooms: p.bedrooms } : {}),
      ...(p.bathrooms > 0 ? { numberOfBathroomsTotal: p.bathrooms } : {}),
    };
  }
  return {
    "@type": "Place",
    ...(p.type ? { additionalType: p.type } : {}),
    ...(p.area > 0
      ? { additionalProperty: [{ "@type": "PropertyValue", name: "المساحة", value: p.area, unitCode: "MTK", unitText: "م²" }] }
      : {}),
  };
}

/** العنوان: المدينة والمحافظة (الحي عبر containedInPlace، لا في addressLocality) */
function address(p: PropertyGraphInput): object {
  const gov = CITIES[p.cityId]?.governorate;
  return {
    "@type": "PostalAddress",
    addressLocality: p.cityName,
    ...(gov ? { addressRegion: `محافظة ${gov}` } : {}),
    addressCountry: "EG",
  };
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
      ...unitFields(p),
      "@id": `${u}#property`,
      name: p.title,
      address: address(p),
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
