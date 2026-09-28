import type { ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import CategoryListing, { pagedCanonicalMetadata } from "../../../CategoryListing";
import VillasClient from "../../VillasClient";
import { parsePageParam } from "@/lib/pagination";

// الصفحة N من الفئة — رابطها العام /properties/villas/?page=N (rewrite في next.config.mjs)
export const revalidate = 300;
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

type Props = { params: { n: string } };

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata) {
  return pagedCanonicalMetadata("/properties/villas/", params.n, parent);
}

export default async function PagedPage({ params }: Props) {
  const page = parsePageParam(params.n);
  if (!page) notFound();
  return <CategoryListing slug="villas" page={page} Client={VillasClient} />;
}
