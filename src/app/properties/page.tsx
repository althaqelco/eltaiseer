import PropertiesListing from "./PropertiesListing";

// ISR كل 5 دقائق — العقارات تظهر في HTML الخادم
// الصفحات 2+ (?page=N) يخدمها ./p/[n] عبر rewrite في next.config.mjs
export const revalidate = 300;

export default async function PropertiesPage() {
  return <PropertiesListing page={1} />;
}
