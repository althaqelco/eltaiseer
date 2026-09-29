// أسئلة شائعة في الرئيسية: روابط إلى الصفحة المالكة لكل سؤال (مكوّن خادم، بلا إجابات ولا FAQPage).
import Link from "next/link";
import { HOME_FAQ_LINKS } from "@/lib/homeFaq";

export function HomeFaqSection() {
  return (
    <section id="faq" className="py-12 bg-white" aria-labelledby="faq-heading">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 id="faq-heading" className="text-3xl font-bold text-gray-900 text-center mb-8">
          أسئلة شائعة
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {HOME_FAQ_LINKS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                prefetch={false}
                className="block rounded-xl border border-gray-200 bg-gray-50 p-4 font-semibold text-gray-800 hover:border-orange-300 hover:text-orange-700"
              >
                {item.q}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
