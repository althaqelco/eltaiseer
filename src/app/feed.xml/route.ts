// خلاصة RSS للمدونة — تسرّع اكتشاف المقالات الجديدة لدى محركات البحث ووكلاء الذكاء الاصطناعي

import { BLOG_POSTS } from "@/lib/blogPosts";

const BASE_URL = "https://eltaiseer.com";


function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const items = BLOG_POSTS.map(
    (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${BASE_URL}/blog/${p.slug}/</link>
      <guid>${BASE_URL}/blog/${p.slug}/</guid>
      <description>${esc(p.description)}</description>
      <pubDate>${new Date(p.published).toUTCString()}</pubDate>
    </item>`
  ).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>مدونة التيسير للعقارات</title>
    <link>${BASE_URL}/blog/</link>
    <description>أدلة شراء واستثمار العقارات في دمياط الجديدة والمنصورة الجديدة</description>
    <language>ar</language>
    <lastBuildDate>${new Date(Math.max(...BLOG_POSTS.map((p) => +new Date(p.updated)))).toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
