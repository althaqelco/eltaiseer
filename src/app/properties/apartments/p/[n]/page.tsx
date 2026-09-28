import type { ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import CategoryListing, { pagedCanonicalMetadata } from "../../../CategoryListing";
import ApartmentsClient from "../../ApartmentsClient";
import { parsePageParam } from "@/lib/pagination";

// الصفحة N من الفئة — رابطها العام /properties/apartments/?page=N (rewrite في next.config.mjs)
export const revalidate = 300;
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

type Props = { params: { n: string } };

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata) {
  return pagedCanonicalMetadata("/properties/apartments/", params.n, parent);
}

export default async function PagedPage({ params }: Props) {
  const page = parsePageParam(params.n);
  if (!page) notFound();
  return <CategoryListing slug="apartments" page={page} Client={ApartmentsClient} />;
}
