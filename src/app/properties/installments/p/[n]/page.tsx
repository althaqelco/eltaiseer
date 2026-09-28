import { notFound } from "next/navigation";
import InstallmentsListing from "../../InstallmentsListing";
import { pagedCanonicalMetadata } from "../../../CategoryListing";
import { parsePageParam } from "@/lib/pagination";

// الصفحة N من عقارات التقسيط — رابطها العام /properties/installments/?page=N (rewrite في next.config.mjs)
export const revalidate = 300;
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

type Props = { params: { n: string } };

export async function generateMetadata({ params }: Props) {
  return pagedCanonicalMetadata("/properties/installments/", params.n);
}

export default async function InstallmentsPagedPage({ params }: Props) {
  const page = parsePageParam(params.n);
  if (!page) notFound();
  return <InstallmentsListing page={page} />;
}
