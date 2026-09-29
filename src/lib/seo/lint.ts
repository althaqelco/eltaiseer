// src/lib/seo/lint.ts
// فحص نصي نقي (بلا Next ولا Firebase) يشترك فيه اختبار test:seo وملفات llms ومراجعة المحتوى:
// عبارات الوعد بعائد أو نمو سعري، وتسريب الترتيب الذكي، و«الموقع الرسمي» خارج رابط الهيئة.
// المرجع: spec-final A8.1 (الأنماط تلتقط صيغ «ال» و«اً» التي فاتت المسودة).
// بلا علم u عمدًا: tsconfig بلا target فيرفضه، والحروف العربية كلها في المستوى الأساسي فلا حاجة له.

export const FORBIDDEN_CLAIMS: RegExp[] = [
  /(?:ال)?عوائد?\s*(?:ال)?(?:متوقع|مضمون|تصل|ممتاز|مجزي|مرتفع|إيجاري|موسمي)/,
  /(?:ال)?عائد\s*(?:ال)?(?:متوقع|مضمون|مرتفع|إيجاري|موسمي|سنوي)/,
  /عائد\s*(?:ال)?إيجار/,
  /(?:ال)?نمو\s*(?:ال)?(?:سعري|متسارع|متوقع)/,
  /منحنى\s*النمو/,
  /أفق\s*(?:ال)?نمو/,
  /هامش\s*نمو/,
  /ارتفاع(?:اً|ا|ًا)?\s*(?:ال)?(?:أسعار|مستمر|قيمة|تدريجي|متوقع)/,
  /متنامي/,
  /أرباح(?:اً|ا)?\s*(?:ال)?(?:مضمون|مضاعف|متوقع)/,
  /الربح\s*المتوقع/,
  /يضمن\s*لك/,
  /نضمن\s*لك/,
  /مضمون/,
  /مضاعفة\s*رأس/,
  /(?:ال)?فرص(?:ة)?\s*(?:ال)?(?:ذهبية|استثمار)/,
  /أفضل\s*(?:فرص|استثمار)/,
  /المستثمر\s*الصبور/,
  /\d+\s*[-–]\s*\d+\s*%\s*(?:خلال|سنوي)/,
  /آلاف\s*(?:ال)?حجوزات?/,
  /آلاف\s*(?:من\s*)?(?:ال)?حاجزين/,
  /100%\s*موثوق/,
  /أكثر\s*من\s*100\s*عقار/,
  /(?:^|[^\d])48\s*\+/,
  /منصتك\s*الأولى/,
];

// أي أثر للترتيب الذكي المدفوع أو ترتيب المناطق بالحجز
export const RANKING_LEAKS: RegExp[] = [
  /\b(?:score|top_?k|weight|prob|cluster|sniper|wishlist|hot)\b/i,
  /الأكثر\s*حجز/,
  /الأسرع\s*(?:نفاد|حجز)/,
  /أفضل\s*قطعة/,
  /أعلى\s*احتمال/,
];

export const OFFICIAL_SITE = /الموقع\s*الرسمي/; // مسموح فقط نصًا لرابط الهيئة (يُفحص منفصلًا)
export const NUCA_LINK_LABEL = "الموقع الرسمي للحجز (هيئة المجتمعات العمرانية)";
export const NUCA_PLAIN = "موقع هيئة المجتمعات العمرانية (lands.nuca.gov.eg)";
export const OFFICIAL_SITE_QUESTIONS = [
  "هل التيسير الموقع الرسمي لحجز بيت الوطن؟",
  "هل التيسير هو الموقع الرسمي لحجز بيت الوطن؟",
]; // Q010، وجوابه «لا»
export const INDEPENDENCE = /غير\s+تابعة\s+لهيئة\s+المجتمعات\s+العمرانية/;

/** كل نمط محظور يطابق النص (فارغ = سليم). */
export function lintText(t: string): string[] {
  return [...FORBIDDEN_CLAIMS, ...RANKING_LEAKS].filter((r) => r.test(t)).map(String);
}

/** «الموقع الرسمي» خارج نص رابط الهيئة = مخالفة. html هو HTML الخام. */
export function lintOfficialSite(html: string): boolean {
  const stripped = html.replace(
    /<a\b[^>]*href="https:\/\/lands\.nuca\.gov\.eg\/?[^"]*"[^>]*>\s*الموقع الرسمي للحجز \(هيئة المجتمعات العمرانية\)\s*<\/a>/g,
    ""
  );
  let text = stripped.replace(/<[^>]+>/g, " ");
  for (const q of OFFICIAL_SITE_QUESTIONS) text = text.split(q).join(" ");
  return !OFFICIAL_SITE.test(text);
}

/** نص JSON-LD وملفات llms: رابط الهيئة يُكتب بصيغته النصية. */
export function toPlain(t: string): string {
  return t.split(NUCA_LINK_LABEL).join(NUCA_PLAIN);
}

export function wordCount(t: string): number {
  return t.trim().split(/\s+/).filter(Boolean).length;
}

/** تطبيع السؤال للمقارنة بين الصفحات والموقعين (B5). */
export function normalizeQuestion(q: string): string {
  return q
    .replace(/[ً-ْـ]/g, "")
    .replace(/[؟?]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/(?:^|\s)(?:الان|اليوم|2026)(?=\s|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
