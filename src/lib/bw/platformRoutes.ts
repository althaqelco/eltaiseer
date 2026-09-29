// src/lib/bw/platformRoutes.ts — مسارات منصة «التيسير — الحجز الذكي» الحية والمفهرسة (نقي، بلا JSX ولا Next)
// يستخدمه platformLinks.tsx (روابط الصفحات) وملفات llms واختبار test:seo. (spec-final A7 / A4.1)
import routes from "./platform-routes.json";

export const PLATFORM_ROOT = "/baitelwatan/";
export const PLATFORM_BRAND = "التيسير — الحجز الذكي";

/** نسخة من قائمة المنصة للمسارات الحية المفهرسة؛ يُضاف المسار في نفس الـ commit التالي لإطلاقه بعد أن يعيد 200 بلا noindex */
export const PLATFORM_ROUTES: readonly string[] = routes as string[];

export const platformLive = (path: string): boolean => PLATFORM_ROUTES.includes(path);
