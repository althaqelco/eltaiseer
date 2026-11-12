import Link from "next/link";
import { BLOG_POSTS, getBlogPost } from "@/lib/blogPosts";

// روابط داخلية بين المقالات ومن صفحات المدن إليها.
// قبلها كان الوصول لكل مقال من صفحة /blog فقط (رابط داخلي واحد) — صفحة بلا روابط سياقية تُزحف أقل وتُقيَّم أضعف.
// العناوين من سجل المدونة (blogPosts.ts) فلا تتكرر يدوياً هنا.

const RELATED: Record<string, string[]> = {
  "buying-steps-legal": ["buying-apartment-guide", "finishing-tips", "damietta-vs-mansoura"],
  "damietta-vs-mansoura": ["best-districts", "new-mansoura-districts", "investment-guide", "new-mansoura-investment"],
  "finishing-tips": ["buying-apartment-guide", "buying-steps-legal", "best-districts"],
  "new-mansoura-districts": ["new-mansoura-investment", "damietta-vs-mansoura", "buying-steps-legal"],
  "new-mansoura-investment": ["new-mansoura-districts", "damietta-vs-mansoura", "investment-guide"],
  "national-housing-projects": ["best-districts", "buying-apartment-guide", "buying-steps-legal"],
  "buying-apartment-guide": ["buying-steps-legal", "best-districts", "finishing-tips"],
  "best-districts": ["national-housing-projects", "damietta-vs-mansoura", "buying-apartment-guide"],
  "investment-guide": ["new-mansoura-investment", "damietta-vs-mansoura", "best-districts"],
};

// أدلة كل مدينة — تظهر في صفحة المدينة
export const CITY_GUIDES: Record<string, string[]> = {
  "new-damietta": [
    "best-districts",
    "buying-apartment-guide",
    "national-housing-projects",
    "investment-guide",
    "damietta-vs-mansoura",
    "buying-steps-legal",
  ],
  "new-mansoura": ["new-mansoura-districts", "new-mansoura-investment", "damietta-vs-mansoura", "buying-steps-legal"],
};

function ArticleLinks({ slugs }: { slugs: string[] }) {
  const posts = slugs.map(getBlogPost).filter((p): p is NonNullable<typeof p> => Boolean(p));
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={`/blog/${post.slug}/`}
            className="block h-full rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-orange-400"
          >
            <span className="block font-semibold text-gray-900">{post.title}</span>
            <span className="mt-1 block text-sm leading-relaxed text-gray-600">{post.description}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function RelatedArticles({ slug }: { slug: string }) {
  const slugs = RELATED[slug] || BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 3).map((p) => p.slug);
  return (
    <section className="container mx-auto max-w-4xl px-4 pb-12" aria-labelledby="related-articles-heading">
      <h2 id="related-articles-heading" className="mb-4 text-2xl font-bold text-gray-900">
        مقالات ذات صلة
      </h2>
      <ArticleLinks slugs={slugs} />
    </section>
  );
}

export function CityGuides({ citySlug, cityName }: { citySlug: string; cityName: string }) {
  const slugs = CITY_GUIDES[citySlug];
  if (!slugs?.length) return null;
  return (
    <section className="mt-8 rounded-xl bg-white p-6 shadow-sm" aria-labelledby="city-guides-heading">
      <h2 id="city-guides-heading" className="mb-4 text-2xl font-bold text-gray-800">
        أدلة الشراء والاستثمار في {cityName}
      </h2>
      <ArticleLinks slugs={slugs} />
    </section>
  );
}
