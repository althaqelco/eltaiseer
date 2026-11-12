// نسخة Markdown لأي صفحة عامة: ‎/md/<المسار>‎ يعيد الصفحة نفسها نصاً نظيفاً لوكلاء الذكاء الاصطناعي.
//
// تفاوض المحتوى (‎Accept: text/markdown‎ على الرابط الأصلي) يتم على حافة Cloudflare بقاعدة URL Rewrite
// تعيد كتابة المسار إلى ‎/md/...‎ — وليس بـ middleware في Next: وجود middleware يجعل Firebase App Hosting
// يرسل ‎Cache-Control: no-store‎ لكل المسارات المطابقة، فيتوقف كاش الـ CDN لكل الصفحات العامة
// (حدث ذلك فعلاً يومي 11–12 نوفمبر 2026). لا تُعد إضافة src/middleware.ts.

import { NextRequest } from "next/server";
import { htmlToMarkdown } from "@/lib/htmlToMarkdown";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

// مصدر جلب الـ HTML: الموقع نفسه دائماً. لا يُؤخذ من ترويسات الطلب (Host / X-Forwarded-Host)
// حتى لا يمكن توجيه الخادم لجلب عنوان داخلي؛ MD_ORIGIN للاختبار المحلي فقط.
const ORIGIN = process.env.MD_ORIGIN || SITE_URL;

function markdown(body: string, status: number, canonical: string) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
      "Cache-Control": "public, max-age=300",
      Link: `<${canonical}>; rel="canonical"`,
      // نسخة بديلة للوكلاء وليست صفحة للفهرسة — الصفحة الأساسية هي الـ HTML
      "X-Robots-Tag": "noindex, follow",
      // تقدير تقريبي لعدد الرموز (نفس الترويسة التي يرسلها Cloudflare Markdown for Agents)
      "X-Markdown-Tokens": String(Math.ceil(body.length / 4)),
      "Content-Signal": "search=yes, ai-input=yes, ai-train=yes",
    },
  });
}

export async function GET(_req: NextRequest, { params }: { params: { path?: string[] } }) {
  const segments = (params.path || []).map((s) => encodeURIComponent(decodeURIComponent(s)));
  const pagePath = segments.length ? `/${segments.join("/")}/` : "/";
  const canonical = `${SITE_URL}${pagePath}`;

  let res: Response;
  try {
    res = await fetch(`${ORIGIN}${pagePath}`, {
      headers: { accept: "text/html", "user-agent": "eltaiseer-markdown/1.0" },
      redirect: "follow",
      cache: "no-store",
    });
  } catch {
    return markdown("# تعذر تحميل الصفحة\n\nحاول مرة أخرى بعد قليل.\n", 502, canonical);
  }

  const type = res.headers.get("content-type") || "";
  if (!res.ok || !type.includes("text/html")) {
    return markdown(
      `# الصفحة غير موجودة\n\nلا توجد صفحة على هذا الرابط. فهرس الموقع: ${SITE_URL}/llms.txt\n`,
      res.status === 200 ? 404 : res.status,
      canonical
    );
  }

  const { markdown: md } = htmlToMarkdown(await res.text(), canonical, SITE_URL);
  return markdown(md, 200, canonical);
}
