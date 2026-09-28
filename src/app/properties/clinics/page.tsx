import CategoryListing, { categoryRobotsMetadata } from "../CategoryListing";
import ClinicsClient from "./ClinicsClient";

// ISR كل 5 دقائق — عقارات الفئة تظهر في HTML الخادم
// الصفحات 2+ (?page=N) يخدمها ./p/[n] عبر rewrite في next.config.mjs
export const revalidate = 300;

export async function generateMetadata() {
  return categoryRobotsMetadata("clinics");
}

export default async function Page() {
  return <CategoryListing slug="clinics" page={1} Client={ClinicsClient} />;
}
