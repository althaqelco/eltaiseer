import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import PropertiesListing from "../../PropertiesListing";
import { pagedMetadata, parsePageParam } from "@/lib/pagination";

// الصفحة N من «جميع العقارات» — رابطها العام /properties/?page=N (rewrite في next.config.mjs)
export const revalidate = 300;
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

type Props = { params: { n: string } };

// canonical ذاتي لكل صفحة — بقية الـ metadata من layout صفحة العقارات
export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const page = parsePageParam(params.n);
  if (!page) return {};
  return pagedMetadata(parent, `https://eltaiseer.com/properties/?page=${page}`, page);
}

export default async function PropertiesPagedPage({ params }: Props) {
  const page = parsePageParam(params.n);
  if (!page) notFound();
  return <PropertiesListing page={page} />;
}
