import { MetadataRoute } from "next";
import { D5_OPEN_DATA_LIVE } from "@/lib/seo/owner-flags";

// سياسة الزواحف (spec-final A5.1). مجموعة مسماة تلغي "*"، فكل مجموعة تكرر القواعد كاملة (seo_final §8.4).
// /baitelwatan/api/ ممنوعة في كل المجموعات: الزواحف كانت تستطيع سحب /api/plots (3–4 MB) من الـ Durable Object.
// بلا "$" بعد *.json/*.csv حتى يطابق "/baitelwatan/events.json?limit=200" أيضًا.
const DISALLOW = [
  "/dashboard/",
  "/login/",
  "/add-property/",
  "/api/",
  "/baitelwatan/api/",
  "/baitelwatan/*.json",
  "/baitelwatan/*.csv",
  "/baitelwatan/old",
];
const ALLOW = ["/", "/baitelwatan/ui/*.json", "/baitelwatan/manifest.json"];
// [OWNER D5 — PLAN CHANGE] ملفات /baitelwatan/data/ بعد إطلاقها فقط
const DATA_ALLOW = ["/baitelwatan/data/*.csv", "/baitelwatan/data/*.json", "/baitelwatan/data/$"];
// true فقط بعد SEO_INDEX=1 على المنصة (seo_final §8.4)
const PLATFORM_SITEMAP_LIVE = false;
// [OWNER D2] التوصية: السماح لزواحف التدريب على المحتوى العام
const TRAINING_ALLOWED = true;

const SEARCH_AND_ANSWER = [
  "*",
  "Googlebot",
  "Googlebot-Image",
  "Bingbot",
  "Applebot",
  "GoogleOther",
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "DuckAssistBot",
  "MistralAI-User",
];
const TRAINING = ["GPTBot", "ClaudeBot", "CCBot", "Google-Extended", "Applebot-Extended", "Meta-ExternalAgent", "Amazonbot"];

export default function robots(): MetadataRoute.Robots {
  const allow = [...ALLOW, ...(D5_OPEN_DATA_LIVE ? DATA_ALLOW : [])];
  return {
    rules: [
      { userAgent: SEARCH_AND_ANSWER, allow, disallow: DISALLOW },
      TRAINING_ALLOWED ? { userAgent: TRAINING, allow, disallow: DISALLOW } : { userAgent: TRAINING, disallow: ["/"] },
      { userAgent: "Bytespider", disallow: ["/"] },
    ],
    sitemap: [
      "https://eltaiseer.com/sitemap.xml",
      ...(PLATFORM_SITEMAP_LIVE ? ["https://eltaiseer.com/baitelwatan/sitemap.xml"] : []),
    ],
  };
}
