// /llms-full.txt — يُبنى من بيانات الموقع الحية (راجع lib/llms.ts)
import { getPropertiesFromFirestore } from "@/lib/firestoreProperties";
import { getActiveListings } from "@/lib/bw/listings";
import { isLive } from "@/lib/bw/calc";
import { buildLlmsFullTxt } from "@/lib/llms";

// يُعاد بناؤه كل ساعة — نفس إيقاع الـ sitemap
export const revalidate = 3600;

export async function GET() {
  const properties = await getPropertiesFromFirestore();
  let bwActive: number | null = null;
  try {
    const now = Date.now();
    bwActive = (await getActiveListings()).filter((l) => isLive(l, now)).length;
  } catch {
    // فشل قسم بيت الوطن لا يمنع خروج الملف
  }
  return new Response(buildLlmsFullTxt(properties, bwActive), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
