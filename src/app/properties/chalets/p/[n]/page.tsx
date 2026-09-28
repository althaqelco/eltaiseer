import { notFound } from "next/navigation";
import CategoryListing, { pagedCanonicalMetadata } from "../../../CategoryListing";
import ChaletsClient from "../../ChaletsClient";
import { parsePageParam } from "@/lib/pagination";

// الصفحة N من الفئة — رابطها العام /properties/chalets/?page=N (rewrite في next.config.mjs)
export const revalidate = 300;
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

type Props = { params: { n: string } };

export async function generateMetadata({ params }: Props) {
  return pagedCanonicalMetadata("/properties/chalets/", params.n);
}

export default async function PagedPage({ params }: Props) {
  const page = parsePageParam(params.n);
  if (!page) notFound();
  return <CategoryListing slug="chalets" page={page} Client={ChaletsClient} />;
}
