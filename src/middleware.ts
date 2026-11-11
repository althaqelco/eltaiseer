// تفاوض المحتوى لوكلاء الذكاء الاصطناعي: طلب يفضّل ‎text/markdown‎ على ‎text/html‎
// يُعاد توجيهه داخلياً إلى ‎/md/<المسار>‎ الذي يعيد الصفحة نفسها بصيغة Markdown.
// المتصفحات ومحركات البحث لا ترسل text/markdown فلا يتغير عليها شيء.

import { NextRequest, NextResponse } from "next/server";

function prefersMarkdown(accept: string): boolean {
  const a = accept.toLowerCase();
  const md = a.indexOf("text/markdown");
  if (md === -1) return false;
  const html = a.indexOf("text/html");
  return html === -1 || md < html;
}

export function middleware(req: NextRequest) {
  if ((req.method !== "GET" && req.method !== "HEAD") || req.headers.get("x-md-internal")) return NextResponse.next();
  if (!prefersMarkdown(req.headers.get("accept") || "")) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `/md${req.nextUrl.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // الصفحات العامة فقط: لا ملفات (فيها امتداد) ولا مسارات داخلية أو خاصة
  matcher: ["/((?!_next/|api/|md/|dashboard|login|add-property|favorites|.*\\.[a-zA-Z0-9]+$).*)"],
};
