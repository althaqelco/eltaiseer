import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CityListing from "../../CityListing";
import { parsePageParam } from "@/lib/pagination";

// الصفحة N من قائمة المدينة — رابطها العام /{city}/?page=N (rewrite في next.config.mjs)،
// والمسار الداخلي /{city}/p/N/ يُحوَّل 301 إليه. ISR مثل الصفحة الأساسية.
export const revalidate = 300;
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

type Props = { params: { city: string; n: string } };

// canonical ذاتي لكل صفحة (لا يشير للصفحة الأولى) — بقية الـ metadata من layout المدينة
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = parsePageParam(params.n);
  if (!page) return {};
  return {
    alternates: { canonical: `https://eltaiseer.com/${params.city}/?page=${page}` },
  };
}

export default async function CityPagedPage({ params }: Props) {
  const page = parsePageParam(params.n);
  if (!page) notFound();
  return <CityListing city={params.city} page={page} />;
}
