import { notFound } from "next/navigation";
import CategoryListing, { pagedCanonicalMetadata } from "../../../CategoryListing";
import ShopsClient from "../../ShopsClient";
import { parsePageParam } from "@/lib/pagination";

// الصفحة N من الفئة — رابطها العام /properties/shops/?page=N (rewrite في next.config.mjs)
export const revalidate = 300;
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

type Props = { params: { n: string } };

export async function generateMetadata({ params }: Props) {
  return pagedCanonicalMetadata("/properties/shops/", params.n);
}

export default async function PagedPage({ params }: Props) {
  const page = parsePageParam(params.n);
  if (!page) notFound();
  return <CategoryListing slug="shops" page={page} Client={ShopsClient} />;
}
