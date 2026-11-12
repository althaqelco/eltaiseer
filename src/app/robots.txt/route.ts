// /robots.txt — يُكتب يدوياً (بدل MetadataRoute) لأنه يحمل توجيه Content-Signal الذي لا تدعمه أنواع Next.
//
// Content Signals (contentsignals.org) تعلن كيف يجوز للأنظمة الآلية استخدام المحتوى:
//   search   = الفهرسة والظهور في نتائج البحث
//   ai-input = استخدام المحتوى في إجابات الذكاء الاصطناعي (الاستشهاد والـ RAG) — هدف الـ AEO
//   ai-train = تدريب النماذج — "yes" لأن الملف يسمح أصلاً لزواحف التدريب (GPTBot, CCBot, Google-Extended...)
// الزاحف الذي له مجموعة باسمه يتجاهل مجموعة "*"، لذلك يتكرر التوجيه في كل مجموعة.

const BASE_URL = "https://eltaiseer.com";
const SIGNAL = "Content-Signal: search=yes, ai-input=yes, ai-train=yes";

// صفحات خاصة أو بلا محتوى للفهرسة. ‎/md/‎ (نسخة Markdown) مسموح للزواحف والوكلاء؛ ترويسة Link canonical
// و X-Robots-Tag: noindex في ردّه تمنع فهرسته كنسخة مكررة في محركات البحث
const PRIVATE = ["/dashboard/", "/login/", "/add-property/", "/api/"];
const AI_PRIVATE = ["/dashboard/", "/api/"];

const GROUPS: Array<{ agent: string; disallow: string[] }> = [
  { agent: "*", disallow: PRIVATE },
  { agent: "Googlebot", disallow: PRIVATE },
  { agent: "Googlebot-Image", disallow: [] },
  { agent: "Bingbot", disallow: PRIVATE },
  ...[
    "GPTBot",
    "ChatGPT-User",
    "OAI-SearchBot",
    "ClaudeBot",
    "Claude-SearchBot",
    "Claude-User",
    "anthropic-ai",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "GoogleOther",
    "Applebot-Extended",
    "Amazonbot",
    "Bytespider",
    "CCBot",
    "cohere-ai",
    "Meta-ExternalAgent",
    "DuckAssistBot",
    "MistralAI-User",
  ].map((agent) => ({ agent, disallow: AI_PRIVATE })),
];

export const dynamic = "force-static";

export function GET() {
  const body =
    [
      "# eltaiseer.com — usage preferences for crawlers and AI systems (https://contentsignals.org/)",
      "# search=yes: index and show in search results. ai-input=yes: may be used and cited in AI answers.",
      "# ai-train=yes: may be used for model training.",
      "",
      ...GROUPS.map(({ agent, disallow }) =>
        [`User-agent: ${agent}`, SIGNAL, "Allow: /", ...disallow.map((d) => `Disallow: ${d}`), ""].join("\n")
      ),
      `Sitemap: ${BASE_URL}/sitemap.xml`,
      "",
    ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
