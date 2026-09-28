import CityListing from "./CityListing";

// ISR كل 5 دقائق: العقارات تظهر في HTML الخادم للزواحف مع بقاء البيانات حديثة
// الصفحات 2+ (?page=N) يخدمها ./p/[n] عبر rewrite في next.config.mjs
export const revalidate = 300;
export const dynamicParams = true;

const VALID_CITIES = ["new-damietta", "new-mansoura"];

export function generateStaticParams() {
  return VALID_CITIES.map((city) => ({ city }));
}

export default async function CityPage({ params }: { params: { city: string } }) {
  return <CityListing city={params.city} page={1} />;
}
