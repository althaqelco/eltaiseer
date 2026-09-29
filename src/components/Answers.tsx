// مكوّنات خادم لعرض الإجابات المفهرسة برقم السؤال (src/lib/answers) — لا "use client" هنا ولا في مستورديها.
// النص نفسه يغذي FAQPage في JSON-LD، فما يراه الزائر هو ما يُعلن للمحركات.
import Link from "next/link";
import type { RenderedAnswer } from "@/lib/answers";

/** نص بروابط [نص](/مسار/): روابط داخلية عادية، ورابط الهيئة خارجي */
export function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const [, label, href] = m;
    parts.push(
      href.startsWith("http") ? (
        <a key={m.index} href={href} rel="noopener" className="text-orange-700 underline">
          {label}
        </a>
      ) : (
        <Link key={m.index} href={href} prefetch={false} className="text-orange-700 underline">
          {label}
        </Link>
      )
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

function Paragraphs({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text.split(/\n\n+/).map((p, i) => (
        <p key={i} className={className}>
          <RichText text={p} />
        </p>
      ))}
    </>
  );
}

function Sources({ sources }: { sources: string[] }) {
  if (!sources.length) return null;
  return <p className="sources text-xs text-gray-500 mt-2">المصدر: {sources.join("؛ ")}</p>;
}

/**
 * سؤال كعنوان H2 (قسم مستقل قابل للاقتباس). id: معرّف ثابت للقسم حين لا يعطي questions.json السؤال جزء رابط
 * (جزء الرابط في questions.json يغلب دائمًا).
 */
export function AnswerSection({ item, id, children }: { item: RenderedAnswer; id?: string; children?: React.ReactNode }) {
  return (
    <section id={item.anchor || id} className="scroll-mt-24">
      <h2 className="text-2xl font-bold text-gray-900 mb-3">{item.q}</h2>
      <Paragraphs text={item.a} className="text-gray-700 leading-relaxed mb-2" />
      <Sources sources={item.sources} />
      {children}
    </section>
  );
}

/** أسئلة شائعة: <details id><summary><h3>س</h3></summary><p>ج</p></details> */
export function FaqList({
  items,
  title = "أسئلة شائعة",
  id = "faq",
  className = "mt-8 bg-white rounded-xl p-6 shadow-sm",
}: {
  items: RenderedAnswer[];
  title?: string;
  id?: string;
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section id={id} className={className} aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} className="text-2xl font-bold text-gray-800 mb-4">
        {title}
      </h2>
      <div className="space-y-3">
        {items.map((item) => (
          <details key={item.id} id={item.anchor} className="group bg-gray-50 rounded-lg border border-gray-200 p-4 scroll-mt-24">
            <summary className="cursor-pointer list-none font-semibold text-gray-800 flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold">{item.q}</h3>
              <span className="text-orange-500 transition-transform group-open:rotate-180" aria-hidden>
                ▼
              </span>
            </summary>
            <div className="mt-3 text-gray-600 leading-relaxed space-y-2">
              <Paragraphs text={item.a} />
              <Sources sources={item.sources} />
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

/** أسئلة تجيب عنها صفحات أخرى: روابط فقط، بلا إجابة ولا Question */
export function TeaserLinks({ items, title }: { items: ({ q: string; href: string } | null)[]; title?: string }) {
  const list = items.filter(Boolean) as { q: string; href: string }[];
  if (list.length === 0) return null;
  return (
    <nav aria-label={title || "أسئلة ذات صلة"} className="mt-4">
      {title && <p className="text-sm font-semibold text-gray-700 mb-2">{title}</p>}
      <ul className="list-disc pr-5 space-y-1 text-sm">
        {list.map((t) => (
          <li key={t.href}>
            <Link href={t.href} prefetch={false} className="text-orange-700 hover:underline">
              {t.q}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
