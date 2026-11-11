// lib/htmlToMarkdown.ts
// تحويل HTML صفحات الموقع إلى Markdown نظيف لوكلاء الذكاء الاصطناعي الذين يطلبون
// ‎Accept: text/markdown‎ (تفاوض المحتوى). بدون مكتبات: الـ HTML ناتج Next نفسه ومنتظم،
// فيكفي تحويل بالتعابير النمطية — العناوين، الفقرات، القوائم، الجداول، الروابط — مع حذف
// التنقل والفوتر والأزرار والسكربتات (ضجيج لا يفيد القارئ الآلي ويستهلك نافذة سياقه).

const ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rlm: "", lrm: "", zwnj: "", laquo: "«", raquo: "»",
};

function decode(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => (n.toLowerCase() in ENTITIES ? ENTITIES[n.toLowerCase()] : m));
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, " ");
}

// نص سطر واحد: بلا وسوم ولا أسطر جديدة
function flat(s: string): string {
  return decode(stripTags(s)).replace(/\s+/g, " ").trim();
}

function absolute(href: string, origin: string): string {
  if (/^(https?:|mailto:|tel:)/i.test(href)) return href;
  if (href.startsWith("//")) return `https:${href}`;
  if (href.startsWith("#")) return "";
  return `${origin}${href.startsWith("/") ? "" : "/"}${href}`;
}

function tableToMarkdown(table: string): string {
  const rows = Array.from(table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)).map((r) =>
    Array.from(r[1].matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)).map((c) => flat(c[1]).replace(/\|/g, "\\|"))
  );
  const usable = rows.filter((r) => r.length > 0);
  if (usable.length === 0) return "";
  const width = Math.max(...usable.map((r) => r.length));
  const line = (cells: string[]) => `| ${Array.from({ length: width }, (_, i) => cells[i] ?? "").join(" | ")} |`;
  const caption = table.match(/<caption\b[^>]*>([\s\S]*?)<\/caption>/i);
  return [
    "",
    ...(caption ? [`*${flat(caption[1])}*`, ""] : []),
    line(usable[0]),
    `| ${Array.from({ length: width }, () => "---").join(" | ")} |`,
    ...usable.slice(1).map(line),
    "",
  ].join("\n");
}

export interface MarkdownPage {
  markdown: string;
  title: string;
}

export function htmlToMarkdown(html: string, pageUrl: string, origin: string): MarkdownPage {
  const title = flat(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
  const description = decode(html.match(/<meta name="description" content="([^"]*)"/i)?.[1] || "");
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/i)?.[1] || pageUrl;

  let body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? html;

  // 1) حذف ما ليس محتوى
  body = body
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|svg|noscript|template|iframe|button|form|select|header|footer|nav)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<(img|input|link|meta)\b[^>]*>/gi, " ");

  // 2) الجداول أولاً (قبل أن تُفكك خلاياها)
  body = body.replace(/<table\b[\s\S]*?<\/table>/gi, (t) => `\n\n${tableToMarkdown(t)}\n\n`);

  // 3) الروابط: نص الرابط سطر واحد؛ الرابط الذي يغلّف بطاقة كاملة (عنوان + تفاصيل) يصير بند قائمة
  body = body.replace(/<a\b[^>]*?href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href: string, inner: string) => {
    const text = flat(inner);
    const url = absolute(decode(href), origin);
    if (!text) return " ";
    if (!url) return text;
    const isBlock = /<(h[1-6]|div|p|li)\b/i.test(inner);
    return isBlock ? `\n- [${text}](${url})\n` : `[${text}](${url})`;
  });

  // 4) العناوين والقوائم والتنسيق
  body = body
    .replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, n: string, inner: string) => {
      const text = decode(stripTags(inner)).replace(/\s+/g, " ").trim();
      return text ? `\n\n${"#".repeat(Number(n))} ${text}\n\n` : "\n";
    })
    .replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_, inner: string) => {
      const text = decode(stripTags(inner)).replace(/\s+/g, " ").trim();
      return text ? `\n- ${text.replace(/^- /, "")}` : "";
    })
    .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, _t: string, inner: string) => {
      const text = flat(inner);
      return text ? `**${text}**` : "";
    })
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|section|article|main|details|summary|ul|ol|dl|dd|dt|blockquote|aside)>/gi, "\n\n");

  // 5) ما تبقى من وسوم، ثم تنظيف الفراغات
  const text = decode(stripTags(body))
    .split("\n")
    .map((l) => l.replace(/[ \t ]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const front = [
    "---",
    `title: ${JSON.stringify(title)}`,
    ...(description ? [`description: ${JSON.stringify(description)}`] : []),
    `url: ${canonical}`,
    "source: التيسير للعقارات (eltaiseer.com)",
    "---",
    "",
  ].join("\n");

  return { markdown: `${front}\n${text}\n`, title };
}
