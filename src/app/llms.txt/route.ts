// /llms.txt مولَّد من نفس مصادر الصفحات ويُفحص قبل تقديمه (src/lib/seo/llmsRoute.ts).
// ملاحظة نشر: Firebase Hosting يقدّم ملفات public/ الثابتة من آخر إصدار له قبل أي مسار في الدالة؛ ما دام إصدار
// Hosting عالقًا (آخر إصدار 14/1/2026) يظل llms.txt القديم يُقدَّم من هناك حتى يكتمل إصدار جديد بلا الملف الثابت.
import { llmsResponse } from "@/lib/seo/llmsRoute";

export const revalidate = 3600;

export async function GET() {
  return llmsResponse("llms");
}
