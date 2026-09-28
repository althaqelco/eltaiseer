import { notFound } from "next/navigation";
import CategoryListing, { pagedCanonicalMetadata } from "../../../CategoryListing";
import LandsClient from "../../LandsClient";
import { parsePageParam } from "@/lib/pagination";

// الصفحة N من الفئة — رابطها العام /properties/lands/?page=N (rewrite في next.config.mjs)
export const revalidate = 300;
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

type Props = { params: { n: string } };

export async function generateMetadata({ params }: Props) {
  return pagedCanonicalMetadata("/properties/lands/", params.n);
}

export default async function PagedPage({ params }: Props) {
  const page = parsePageParam(params.n);
  if (!page) notFound();
  return <CategoryListing slug="lands" page={page} Client={LandsClient} />;
}
