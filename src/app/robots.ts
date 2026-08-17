import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://eltaiseer.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/dashboard/",
          "/login/",
          "/add-property/",
          "/api/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/"],
        disallow: ["/dashboard/", "/login/", "/add-property/", "/api/"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/"],
      },
      {
        userAgent: "Bingbot",
        allow: ["/"],
        disallow: ["/dashboard/", "/login/", "/add-property/", "/api/"],
      },
      {
        userAgent: "GPTBot",
        allow: ["/"],
        disallow: ["/dashboard/", "/api/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/"],
        disallow: ["/dashboard/", "/api/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: ["/"],
        disallow: ["/dashboard/", "/api/"],
      },
      {
        userAgent: "anthropic-ai",
        allow: ["/"],
        disallow: ["/dashboard/", "/api/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/"],
        disallow: ["/dashboard/", "/api/"],
      },
      {
        userAgent: "Google-Extended",
        allow: ["/"],
        disallow: ["/dashboard/", "/api/"],
      },
      {
        userAgent: "Bytespider",
        allow: ["/"],
        disallow: ["/dashboard/", "/api/"],
      },
      {
        userAgent: "CCBot",
        allow: ["/"],
        disallow: ["/dashboard/", "/api/"],
      },
      {
        userAgent: "Applebot-Extended",
        allow: ["/"],
        disallow: ["/dashboard/", "/api/"],
      },
      {
        userAgent: "cohere-ai",
        allow: ["/"],
        disallow: ["/dashboard/", "/api/"],
      },
      {
        userAgent: "Meta-ExternalAgent",
        allow: ["/"],
        disallow: ["/dashboard/", "/api/"],
      },
      {
        userAgent: "OAI-SearchBot",
        allow: ["/"],
        disallow: ["/dashboard/", "/api/"],
      },
      {
        userAgent: "Perplexity-User",
        allow: ["/"],
        disallow: ["/dashboard/", "/api/"],
      },
      {
        userAgent: "Claude-SearchBot",
        allow: ["/"],
        disallow: ["/dashboard/", "/api/"],
      },
      {
        userAgent: "Claude-User",
        allow: ["/"],
        disallow: ["/dashboard/", "/api/"],
      },
      {
        userAgent: "DuckAssistBot",
        allow: ["/"],
        disallow: ["/dashboard/", "/api/"],
      },
      {
        userAgent: "Amazonbot",
        allow: ["/"],
        disallow: ["/dashboard/", "/api/"],
      },
      {
        userAgent: "MistralAI-User",
        allow: ["/"],
        disallow: ["/dashboard/", "/api/"],
      },
      {
        userAgent: "GoogleOther",
        allow: ["/"],
        disallow: ["/dashboard/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
