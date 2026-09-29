// اختبارات وحدة لطبقة AEO في الموقع الرئيسي (spec-final A8.1): الأسعار، والسجل وإغلاق الرسم،
// وفحص العبارات المحظورة، وتواريخ القاهرة، وملكية الأسئلة، ومنع استيراد المحتوى من مكوّنات العميل.
// التشغيل: npm run test:seo (يترجم src/lib المطلوب إلى .seo-test ثم يشغل هذا الملف)
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const root = path.join(__dirname, "..", "..");
const OUT = path.join(root, ".seo-test");
const prices = require(path.join(OUT, "seo/prices.js"));
const schema = require(path.join(OUT, "seo/schema.js"));
const lint = require(path.join(OUT, "seo/lint.js"));
const time = require(path.join(OUT, "seo/time.js"));
const editorial = require(path.join(OUT, "seo/editorial.js"));
const answers = require(path.join(OUT, "answers/index.js"));
const local = require(path.join(OUT, "answers/local.js"));
const slugs = require(path.join(OUT, "districtSlugs.js"));
const registry = require(path.join(root, "src/lib/seo/schema-registry.json"));
const flags = require(path.join(OUT, "seo/owner-flags.js"));
const owners = require(path.join(root, "src/lib/seo/faq-owners.json"));

// بصمة السجل المشترك — المنصة تثبّت نفس القيمة (غيّرهما معًا فقط)
const REGISTRY_SHA256 = "2828d3da1a24b3e1f39385cc2dd1a998eca0ec73e1e78e967503f1026eb24930";

// ── الأسعار ──────────────────────────────────────────────────────────────────
const L = (id, district, type, price, area, extra = {}) => ({
  id, price, area, type, cityId: "new-damietta", district, status: "جاهز", createdAt: "2026-09-01T10:00:00Z", ...extra,
});

test("computePriceStats: القيمة الشاذة (4,652,429 جنيه/م²) تُستبعد ولا تظهر", () => {
  const s = prices.computePriceStats([
    L("a", "الحي الثالث", "شقة", 1_500_000, 100),
    L("b", "الحي الثالث", "شقة", 1_800_000, 120),
    L("c", "الحي الثالث", "شقة", 2_000_000, 130),
    L("x", "الحي الثالث", "شقة", 465_242_900, 100),
  ]);
  assert.ok(s.excluded.some((e) => e.id === "x"));
  const row = s.rows.find((r) => r.district === "الحي الثالث" && r.group === "apartment");
  assert.equal(row.n, 3);
  assert.ok(row.medianPpm < 150000);
});

test("computePriceStats: حي بعقارين لا يظهر، والوسيط صحيح للفردي والزوجي", () => {
  const s = prices.computePriceStats([
    L("a", "الحي الأول", "شقة", 1_000_000, 100), // 10,000
    L("b", "الحي الأول", "شقة", 1_200_000, 100), // 12,000
    L("c", "الحي الأول", "شقة", 1_500_000, 100), // 15,000 → median 12,000
    L("d", "الحي الثاني", "شقة", 1_000_000, 100),
    L("e", "الحي الثاني", "شقة", 1_000_000, 100), // n=2 → no row
    L("f", "الحي الرابع", "أرض", 500_000, 100), // 5,000
    L("g", "الحي الرابع", "أرض", 700_000, 100), // 7,000
    L("h", "الحي الرابع", "أرض", 900_000, 100), // 9,000
    L("i", "الحي الرابع", "أرض", 1_100_000, 100), // 11,000 → median 8,000
  ]);
  assert.equal(s.rows.find((r) => r.district === "الحي الأول").medianPpm, 12000);
  assert.equal(s.rows.find((r) => r.district === "الحي الرابع").medianPpm, 8000);
  assert.ok(!s.rows.some((r) => r.district === "الحي الثاني"));
  assert.equal(prices.median([1, 2, 3, 4]), 2.5);
});

test("computePriceStats: الترتيب بالاسم، وcityGroup من 3 فأكثر، وdataModified = الأحدث", () => {
  const s = prices.computePriceStats([
    L("a", "الحي الثاني", "شقة", 1_000_000, 100),
    L("b", "الحي الثاني", "شقة", 1_000_000, 100),
    L("c", "الحي الثاني", "شقة", 1_000_000, 100),
    L("d", "الحي الأول", "شقة", 2_000_000, 100, { updatedAt: "2026-09-20T08:00:00Z" }),
    L("e", "الحي الأول", "شقة", 2_000_000, 100),
    L("f", "الحي الأول", "شقة", 2_000_000, 100),
    L("g", "الحي الأول", "أرض", 500_000, 100),
    L("h", "الحي الأول", "أرض", 500_000, 100),
    L("s", "الحي الأول", "شقة", 9_000_000, 100, { status: "تم البيع", updatedAt: "2026-09-25T00:00:00Z" }),
  ]);
  const names = s.rows.map((r) => r.district);
  assert.deepEqual(names, [...names].sort((a, b) => a.localeCompare(b, "ar")));
  assert.equal(s.cityGroup["new-damietta"].apartment.n, 6);
  assert.ok(s.cityGroup["new-damietta"].apartment.medianPpm > 0);
  assert.equal(s.cityGroup["new-damietta"].land.medianPpm, null); // n=2
  assert.equal(s.dataModified, "2026-09-20T08:00:00.000Z"); // المباع لا يُحسب
});

// ── المعرّفات والسجل ─────────────────────────────────────────────────────────
test("abs وpageId وID_RE: شرطة أخيرة، والحالة محفوظة، والملفات بلا شرطة", () => {
  assert.equal(schema.abs("/prices"), "https://eltaiseer.com/prices/");
  assert.equal(schema.abs("/new-damietta/third-district/RX8UTBXQ"), "https://eltaiseer.com/new-damietta/third-district/RX8UTBXQ/");
  assert.equal(schema.abs("/prices/#new-damietta"), "https://eltaiseer.com/prices/#new-damietta");
  assert.equal(schema.abs("https://lands.nuca.gov.eg/Files/Handbook.pdf"), "https://lands.nuca.gov.eg/Files/Handbook.pdf");
  assert.equal(schema.abs("/llms.txt"), "https://eltaiseer.com/llms.txt");
  assert.equal(schema.pageId("/about"), "https://eltaiseer.com/about/#webpage");
  const ok = [
    "https://eltaiseer.com/new-damietta/third-district/RX8UTBXQ/#webpage",
    "https://eltaiseer.com/#organization",
    "https://eltaiseer.com/prices/#dataset",
    "https://eltaiseer.com/beit-al-watan-for-sale/phase-11/#faq",
    "https://eltaiseer.com/#city-6th-of-october",
  ];
  const bad = [
    "https://eltaiseer.com/#Organization",
    "http://eltaiseer.com/#organization",
    "https://www.eltaiseer.com/#organization",
    "https://eltaiseer.com/prices#dataset",
    "https://eltaiseer.com/prices/",
  ];
  for (const u of ok) assert.ok(schema.ID_RE.test(u), u);
  for (const u of bad) assert.ok(!schema.ID_RE.test(u), u);
});

test("السجل: كل المعرّفات تطابق ID_RE، والبصمة مثبّتة", () => {
  for (const id of Object.values(registry.ids)) assert.ok(schema.ID_RE.test(id), id);
  for (const id of Object.keys(registry.stubs)) assert.ok(schema.ID_RE.test(id), id);
  const sha = crypto.createHash("sha256").update(fs.readFileSync(path.join(root, "src/lib/seo/schema-registry.json"))).digest("hex");
  assert.equal(sha, REGISTRY_SHA256);
  // لا أنواع حكومية ولا شعار/صورة للهيئة
  const nuca = registry.stubs["https://eltaiseer.com/#nuca"];
  assert.equal(nuca["@type"], "Organization");
  assert.ok(!("logo" in nuca) && !("image" in nuca));
  for (const s of Object.values(registry.stubs)) assert.ok(!/^Government/.test(s["@type"]));
  assert.ok(registry.stubs["https://eltaiseer.com/#organization"].disambiguatingDescription.includes("التيسير منصة مستقلة غير تابعة لهيئة المجتمعات العمرانية"));
  assert.ok(registry.stubs["https://eltaiseer.com/#app-smart-booking"].disambiguatingDescription.includes("التيسير منصة مستقلة غير تابعة لهيئة المجتمعات العمرانية"));
});

test("قرارات المالك المعلّقة مطفأة، والسجل يطابقها", () => {
  for (const k of ["D17_SHORT_SITE_NAME", "D19_IN_LANGUAGE_AR_EG", "D16_BROKER_AS_OFFERER", "D8_SHOW_BOOKED_UNDER_15", "D3_BUSINESS_MODEL_APPROVED", "D5_OPEN_DATA_LIVE", "D6_MONTHLY_REPORT_LIVE", "D18_LIVE_JSON"]) {
    assert.equal(flags[k], false, k);
  }
  assert.equal(flags.D11_OFFICE, null);
  assert.equal(flags.D13_CORRECTIONS_TURNAROUND, null);
  assert.equal(flags.D3_SMART_RANKING_MODEL, null);
  assert.equal(flags.D13_LOCAL_COMMISSION, null);
  // M-AB-01 «كيف تربح التيسير؟» معلّق حتى D3 وD13: لا يظهر في /about/ ولا في FAQPage
  assert.deepEqual(answers.answersFor("/about/", {}, ["M-AB-01"]), []);
  assert.equal(answers.getAnswer("M-AB-01").status, "pending");
  assert.equal(registry.stubs["https://eltaiseer.com/#website"].name, flags.SITE_NAME);
  assert.equal(flags.BOOKED_MIN_DISPLAY, 15);
  assert.equal(schema.webPage({ path: "/x/", name: "x" }).inLanguage, flags.IN_LANGUAGE);
});

test("closeGraph: قالب البرنامج ثم الهيئة تكراريًا، والمجهول يرمي، ومعرّفات الـ layout لا تتكرر", () => {
  const g = schema.graph({ "@type": "WebPage", "@id": "https://eltaiseer.com/x/#webpage", about: schema.ref(schema.ID.program), publisher: schema.ORG });
  const ids = g["@graph"].map((n) => n["@id"]);
  assert.ok(ids.includes("https://eltaiseer.com/#program-beit-al-watan"));
  assert.ok(ids.includes("https://eltaiseer.com/#nuca"));
  assert.ok(!ids.includes("https://eltaiseer.com/#organization"));
  assert.throws(() => schema.graph({ "@type": "Thing", "@id": "https://eltaiseer.com/#a", about: { "@id": "https://eltaiseer.com/#nope" } }), /dangling/);
  // عقدة معرّفة متداخلة (صورة الصفحة داخل WebPage) لا تُعد مرجعًا معلقًا
  const nested = schema.graph(
    schema.webPage({ path: "/blog/x/", name: "x", primaryImage: "https://example.com/a.jpg", breadcrumb: false }),
    { "@type": "Article", "@id": "https://eltaiseer.com/blog/x/#article", image: { "@id": "https://eltaiseer.com/blog/x/#primaryimage" } }
  );
  assert.equal(nested["@graph"].length, 2);
  // الرسم مغلق: كل مرجع معرّف في الرسم أو في الـ layout
  const site = schema.siteGraph({ "@type": "RealEstateAgent", "@id": schema.ID.organization, areaServed: [schema.ref(schema.cityId("new-damietta"))] });
  const siteIds = new Set(site["@graph"].map((n) => n["@id"]));
  assert.ok(siteIds.has("https://eltaiseer.com/#city-new-damietta"));
});

test("faqNode: 6 عناصر كحد أقصى و300 حرف للإجابة، ونص الهيئة بصيغته النصية", () => {
  const item = (i) => ({ id: `M-${i}`, q: `س ${i}؟`, a: "ج" });
  assert.throws(() => schema.faqNode("/x/", [1, 2, 3, 4, 5, 6, 7].map(item)), /> 6/);
  assert.throws(() => schema.faqNode("/x/", [{ id: "M-1", q: "س؟", a: "ا".repeat(301) }]), /300/);
  const n = schema.faqNode("/x/", [{ id: "M-1", q: "س؟", a: `الحجز على ${lint.NUCA_LINK_LABEL} فقط.` }]);
  assert.equal(n["@id"], "https://eltaiseer.com/x/#faq");
  assert.ok(n.mainEntity[0].acceptedAnswer.text.includes("lands.nuca.gov.eg"));
  assert.ok(!n.mainEntity[0].acceptedAnswer.text.includes("الموقع الرسمي"));
});

// ── فحص النص ────────────────────────────────────────────────────────────────
const FIXTURES = [
  "العوائد المتوقعة تصل إلى 30-40% خلال 3-5 سنوات",
  "أسعار متنامية",
  "من أبرز الفرص الاستثمارية في المدينة",
  "العائد الموسمي",
  "عائد إيجار موسمي",
  "عائد إيجاري من النطاق الجامعي",
  "عوائد إيجارية عالية",
  "ارتفاع مستمر",
  "ارتفاعاً مستمراً في الأسعار",
  "من أفضل فرص الاستثمار العقاري",
  "في بداية منحنى النمو",
  "أفق النمو السعري",
  "لمضاعفة رأس المال",
  "يضمن لك أرباحاً مضاعفة",
  "أرباح مضمونة",
  "معادلة المستثمر الصبور",
  "أوسع هامش نمو في أحياء R",
  "الاستثمار بأفق نمو",
  "عوائد تصل إلى 40% خلال 3 سنوات",
  "نمو سعري متوقع",
  "فرصة ذهبية",
  "أكثر من 100 عقار",
  "تغطية 48+ منطقة",
  "100% موثوق",
  "منصتك الأولى للبحث",
  "آلاف الحجوزات",
];
test("lintText يلتقط كل عبارات A0.1", () => {
  for (const f of FIXTURES) assert.ok(lint.lintText(f).length > 0, f);
  assert.deepEqual(lint.lintText("قرابة ألف حجز حقيقي"), []);
  assert.deepEqual(lint.lintText('"dateModified":"2026-01-15T16:54:48+02:00"'), []); // لا إنذار كاذب من الطوابع الزمنية
  assert.ok(lint.lintText("zone score").length > 0);
  assert.ok(lint.lintText("الأكثر حجزًا").length > 0);
});

test("lintOfficialSite: رابط الهيئة وسؤال Q010 مسموحان، وغيرهما مخالف", () => {
  assert.ok(lint.lintOfficialSite(`<p>الحجز على <a href="https://lands.nuca.gov.eg/">الموقع الرسمي للحجز (هيئة المجتمعات العمرانية)</a> فقط</p>`));
  assert.ok(lint.lintOfficialSite(`<h2>هل التيسير هو الموقع الرسمي لحجز بيت الوطن؟</h2>`));
  assert.ok(!lint.lintOfficialSite(`<p>احجز عبر الموقع الرسمي للهيئة</p>`));
});

test("normalizeQuestion يوحّد الصيغ", () => {
  assert.equal(lint.normalizeQuestion("كم سعر المتر في دمياط الجديدة الآن؟"), lint.normalizeQuestion("كم سعر المتر في دمياط الجديده"));
  assert.equal(lint.normalizeQuestion("كم أسعار الشقق في دمياط الجديدة 2026؟"), lint.normalizeQuestion("كم اسعار الشقق في دمياط الجديدة الآن؟"));
});

// ── تواريخ القاهرة ─────────────────────────────────────────────────────────
test("cairoDate بأرقام لاتينية، وcairoIso بإزاحة القاهرة السارية", () => {
  assert.equal(time.cairoDate("2026-10-30T10:00:00Z"), "30 أكتوبر 2026");
  assert.ok(!/[٠-٩]/.test(time.cairoDate("2026-10-30T10:00:00Z")));
  assert.equal(time.cairoIso("2026-09-28T14:40:43Z"), "2026-09-28T17:40:43+03:00");
  assert.equal(time.cairoIso("2026-11-02T10:00:00Z"), "2026-11-02T12:00:00+02:00");
  assert.equal(time.cairoLocalToIso("2026-09-28 17:40:43"), "2026-09-28T17:40:43+03:00");
  assert.equal(time.cairoLocalToIso("2026-11-05"), "2026-11-05T00:00:00+02:00");
  // نفس اللحظة بتمثيلين
  assert.equal(Date.parse(time.cairoLocalToIso("2026-09-28 17:40:43")), Date.parse("2026-09-28T14:40:43Z"));
  assert.ok(editorial.editorialIso("/about/", "modified").endsWith("+03:00"));
});

// ── الإجابات والملكية ───────────────────────────────────────────────────────
function sampleData() {
  const rows = [];
  const mk = (i, city, district, type, price, area) => ({
    id: `${city}-${i}`, price, area, type, cityId: city, district, status: "جاهز", createdAt: "2026-09-27T09:00:00Z",
  });
  let i = 0;
  for (const d of ["الحي الأول", "الحي الثاني", "الحي الثالث"]) for (let k = 0; k < 3; k++) rows.push(mk(i++, "new-damietta", d, "شقة", 1_000_000 + k * 250_000 + i * 10_000, 110));
  for (let k = 0; k < 3; k++) rows.push(mk(i++, "new-damietta", "بيت الوطن - شرق", "أرض", 2_500_000 + k * 100_000, 300));
  for (let k = 0; k < 4; k++) rows.push(mk(i++, "new-mansoura", "R1", "شقة", 1_700_000 + k * 90_000, 120));
  const s = prices.computePriceStats(rows);
  return {
    prices: s,
    dataModified: s.dataModified,
    ndDistrictCount: slugs.getCityDistrictSlugs("new-damietta").length,
    installments: { "new-damietta": { k: 7, maxYears: 5, minDown: 250000 }, "new-mansoura": { k: 0, maxYears: null, minDown: null } },
  };
}

test("الإجابات: معرّفات فريدة، وكل سؤال على مالكه في faq-owners.json، والنصوص تمر من الفحص", () => {
  const data = sampleData();
  const ids = new Set();
  const ownerById = new Map(owners.map((o) => [o.id, o]));
  for (const a of answers.ANSWERS) {
    assert.ok(!ids.has(a.id), `duplicate ${a.id}`);
    ids.add(a.id);
    const o = ownerById.get(a.id);
    assert.ok(o, `${a.id} missing from faq-owners.json (run scripts/build-faq-owners.mjs)`);
    assert.equal(o.owner_url.split("#")[0], `https://eltaiseer.com${a.owner}`, a.id);
    assert.equal(o.normalized_question, lint.normalizeQuestion(a.q), a.id);
    if (a.anchor) assert.ok(o.owner_url.endsWith(`#${a.anchor}`), `${a.id} anchor`);
    assert.deepEqual(lint.lintText(a.q), [], a.id);
    const text = a.a(data);
    if (a.status === "pending") continue;
    assert.ok(text, `${a.id} renders nothing with sample data`);
    assert.deepEqual(lint.lintText(text), [], `${a.id}: ${text}`);
    assert.ok(!/[٠-٩]/.test(text), `${a.id} has Arabic-Indic digits`);
    assert.ok(lint.lintOfficialSite(text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')), a.id);
    if (a.faq !== false) assert.ok(answers.plainText(answers.firstParagraph(text)).length <= 300, `${a.id} > 300 chars`);
  }
});

test("faq-owners.json: سؤال مطبَّع واحد لمالك واحد، والروابط على eltaiseer.com", () => {
  const byQ = new Map();
  for (const o of owners) {
    assert.ok(o.owner_url.startsWith("https://eltaiseer.com/"), o.id);
    const prev = byQ.get(o.normalized_question);
    if (prev) assert.equal(prev.split("#")[0], o.owner_url.split("#")[0], `${o.id}: ${o.normalized_question}`);
    byQ.set(o.normalized_question, o.owner_url);
  }
  // تصحيحات Appendix 6
  const q = (id) => owners.find((o) => o.id === id);
  assert.equal(q("Q119").owner_url, "https://eltaiseer.com/beit-al-watan-for-sale/phase-11/");
  assert.equal(q("Q099").owner_url, "https://eltaiseer.com/beit-al-watan-for-sale/#can-i-sell");
});

test("answersFor يعرض على المالك فقط، والمعلّق لا يظهر، وfaqFrom ≤ 6", () => {
  const data = sampleData();
  const nd = answers.answersFor("/new-damietta/", data, ["Q169", "Q170", "Q183", "M-ND-01", "Q166"]);
  assert.deepEqual(nd.map((a) => a.id), ["Q169", "Q170", "M-ND-01"]); // Q183 معلّق، وQ166 مالكه /prices/
  const faq = answers.faqFrom(answers.answersFor("/prices/", data, ["Q166", "Q165", "Q176", "Q175", "M-PR-01", "M-PR-02", "M-PR-03"]));
  assert.equal(faq.length, 6);
  assert.ok(!faq.some((f) => f.id === "M-PR-03")); // مرئي فقط
  assert.deepEqual(answers.teaser("Q167", "ما أفضل حي للسكن في دمياط الجديدة؟"), { q: "ما أفضل حي للسكن في دمياط الجديدة؟", href: "/blog/best-districts/" });
  assert.equal(answers.teaser("Q001", "ما هو بيت الوطن؟"), null); // صفحات المنصة عبر PlatformLink فقط
});

test("Q169 يذكر كل فئات مناطق دمياط الجديدة، والعدد = صفحات الأحياء", () => {
  const data = sampleData();
  const text = answers.getAnswer("Q169").a(data);
  for (const part of local.ND_DISTRICTS_SENTENCE_PARTS) assert.ok(text.includes(part), part);
  assert.ok(text.includes(`${slugs.getCityDistrictSlugs("new-damietta").length} منطقة`));
});

// ── المحتوى على الخادم فقط ──────────────────────────────────────────────────
test("لا ملف \"use client\" يستورد الإجابات أو lib/seo أو content", () => {
  const files = [];
  const walk = (d) => {
    for (const f of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, f.name);
      if (f.isDirectory()) walk(p);
      else if (/\.tsx?$/.test(f.name)) files.push(p);
    }
  };
  walk(path.join(root, "src"));
  const bad = [];
  for (const f of files) {
    const src = fs.readFileSync(f, "utf8");
    if (!/^\s*["']use client["']/.test(src)) continue;
    if (/from\s+["'](?:@\/lib\/answers|@\/lib\/seo\/|@\/content\/|@\/components\/Answers|@\/components\/Freshness|@\/components\/JsonLd)/.test(src)) bad.push(path.relative(root, f));
  }
  assert.deepEqual(bad, []);
});
