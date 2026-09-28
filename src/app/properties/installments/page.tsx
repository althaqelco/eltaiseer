import InstallmentsListing from "./InstallmentsListing";
import { categoryRobotsMetadata } from "../CategoryListing";

// ISR كل 5 دقائق — عقارات التقسيط تظهر في HTML الخادم
// الصفحات 2+ (?page=N) يخدمها ./p/[n] عبر rewrite في next.config.mjs
export const revalidate = 300;

export async function generateMetadata() {
  return categoryRobotsMetadata("installments");
}

export default async function InstallmentsPage() {
  return <InstallmentsListing page={1} />;
}
