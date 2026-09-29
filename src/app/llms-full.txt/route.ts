// /llms-full.txt مولَّد ويُفحص قبل تقديمه (انظر src/app/llms.txt/route.ts وملاحظة إصدار Hosting)
import { llmsResponse } from "@/lib/seo/llmsRoute";

export const revalidate = 3600;

export async function GET() {
  return llmsResponse("full");
}
