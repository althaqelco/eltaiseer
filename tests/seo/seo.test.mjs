// اختبارات حزمة الزحف والفهرسة: تحويلات الروابط القديمة في next.config.mjs، والترقيم، وقاعدة الفهرسة.
// التشغيل: npm run test:seo (يترجم ملفات src/lib المطلوبة إلى .seo-test ثم يشغل هذا الملف)
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..", "..");
const require = createRequire(import.meta.url);
const OUT = path.join(root, ".seo-test");
const slugs = require(path.join(OUT, "districtSlugs.js"));
const pagination = require(path.join(OUT, "pagination.js"));
const indexRules = require(path.join(OUT, "indexRules.js"));
const categories = require(path.join(OUT, "listingCategories.js"));

const { default: nextConfig } = await import(path.join(root, "next.config.mjs"));
const redirects = await nextConfig.redirects();
const rewrites = await nextConfig.rewrites();

const CITIES = ["new-damietta", "new-mansoura"];
const bySource = new Map(redirects.map((r) => [r.source, r]));

test("كل حي حالي: /properties/district/{slug} → /{city}/{slug}/ بقفزة واحدة 301", () => {
  const aliases = { "dar-misr": "/new-damietta/dar-misr-1/" };
  for (const city of CITIES) {
    for (const slug of slugs.getCityDistrictSlugs(city)) {
      const r = bySource.get(`/properties/district/${slug}`);
      assert.ok(r, `لا تحويل لـ ${slug}`);
      assert.equal(r.destination, aliases[slug] ?? `/${city}/${slug}/`, slug);
      assert.equal(r.statusCode, 301);
    }
  }
});

test("قائمة next.config تطابق getCityDistrictSlugs (لا حي زائد ولا ناقص)", () => {
  const known = new Set(CITIES.flatMap((c) => slugs.getCityDistrictSlugs(c)));
  const legacy = new Set(["sakan-misr", "beit-al-watan", "central-area"]);
  for (const r of redirects) {
    const m = r.source.match(/^\/properties\/district\/([a-z0-9-]+)$/);
    if (!m) continue;
    assert.ok(known.has(m[1]) || legacy.has(m[1]) || m[1] === "dar-misr", `slug غير معروف في next.config: ${m[1]}`);
    // الوجهة صفحة حي حقيقية في مدينتها
    const [, city, district] = r.destination.match(/^\/([^/]+)\/([^/]+)\/$/) || [];
    assert.ok(slugs.isCityDistrictSlug(city, district), `وجهة ليست صفحة حي: ${r.destination}`);
  }
});

test("slugs الموقع القديم: وجهات القرار (دار مصر دمياط، بيت الوطن شرق) والمجهول → /properties/", () => {
  assert.equal(bySource.get("/properties/district/dar-misr").destination, "/new-damietta/dar-misr-1/");
  assert.equal(bySource.get("/properties/district/beit-al-watan").destination, "/new-damietta/beit-al-watan-east/");
  assert.equal(bySource.get("/properties/district/sakan-misr").destination, "/new-damietta/sakan-misr-south/");
  assert.equal(bySource.get("/properties/district/central-area").destination, "/new-damietta/central-area-a/");
  assert.equal(bySource.get("/properties/district/:path*").destination, "/properties/");
  // المجهول بعد كل القواعد الحرفية
  const idx = redirects.findIndex((r) => r.source === "/properties/district/:path*");
  assert.ok(redirects.slice(idx + 1).every((r) => !r.source.startsWith("/properties/district/")));
});

test("/property/prop-001 … prop-100 → /properties/ و/properties/city/{city} → /{city}/", () => {
  for (let i = 1; i <= 100; i++) {
    const r = bySource.get(`/property/prop-${String(i).padStart(3, "0")}`);
    assert.ok(r);
    assert.equal(r.destination, "/properties/");
    assert.equal(r.statusCode, 301);
  }
  for (const city of CITIES) assert.equal(bySource.get(`/properties/city/${city}`).destination, `/${city}/`);
  assert.equal(bySource.get("/properties/city/:path*").destination, "/properties/");
});

test("لا سلاسل: كل وجهة تنتهي بـ / (أو ?page=) ولا تطابق مصدر تحويل آخر", () => {
  const literalSources = new Set(redirects.map((r) => r.source.toLowerCase()));
  for (const r of redirects) {
    const pathOnly = r.destination.split("?")[0];
    assert.ok(pathOnly.endsWith("/"), `وجهة بلا شرطة أخيرة: ${r.destination}`);
    assert.ok(!literalSources.has(pathOnly.replace(/\/$/, "").toLowerCase()), `سلسلة: ${r.source} → ${r.destination}`);
    assert.ok(!/^\/(properties\/district|properties\/city|property)\//.test(pathOnly), `وجهة قديمة: ${r.destination}`);
  }
});

test("مصادر التحويلات التي ينسخها firebase-tools إلى Hosting بلا أنماط regex", () => {
  for (const r of redirects) {
    const copiedToHosting = !r.has && !r.missing && !r.destination.includes("?");
    if (copiedToHosting) assert.ok(!/[()|\\]/.test(r.source), `نمط regex في مصدر يُنسخ لـ Hosting: ${r.source}`);
  }
});

test("rewrite ?page=N يقبل نفس القيم التي يقبلها parsePageParam", () => {
  const value = rewrites.beforeFiles[0].has[0].value;
  const re = new RegExp(`^${value}$`);
  for (const v of ["2", "9", "10", "99", "9999", "1", "0", "01", "abc", "10000", "2a", ""]) {
    assert.equal(re.test(v), pagination.parsePageParam(v) !== null, `قيمة ${v}`);
  }
  assert.deepEqual(
    rewrites.beforeFiles.map((r) => r.destination),
    ["/:city/p/:pg", "/properties/p/:pg", "/properties/:category/p/:pg"]
  );
  // فئات الـ rewrite = فئات الصفحات
  assert.ok(rewrites.beforeFiles[2].source.includes(categories.CATEGORY_SLUGS.join("|")));
});

test("الترقيم: عدد الصفحات والروابط والنافذة", () => {
  assert.equal(pagination.totalPages(0, 20), 1);
  assert.equal(pagination.totalPages(55, 20), 3);
  assert.equal(pagination.pageHref("/new-damietta/", 1), "/new-damietta/");
  assert.equal(pagination.pageHref("/new-damietta/", 3), "/new-damietta/?page=3");
  assert.deepEqual(pagination.slicePage([1, 2, 3, 4, 5], 2, 2), [3, 4]);
  assert.deepEqual(pagination.pageWindow(1, 3), [1, 2, 3]);
  assert.deepEqual(pagination.pageWindow(5, 10), [1, "gap", 4, 5, 6, "gap", 10]);
  assert.deepEqual(pagination.pageWindow(1, 10), [1, 2, "gap", 10]);
});

test("قاعدة الفهرسة: الحي/الفئة بلا عروض noindex إلا حي بدليل ≥ 250 كلمة", () => {
  assert.equal(indexRules.isDistrictIndexable("fifth-district", 0), indexRules.districtEditorialWords("fifth-district") >= 250);
  assert.equal(indexRules.isDistrictIndexable("fifth-district", 1), true);
  assert.equal(indexRules.isDistrictIndexable("no-such-district", 0), false);
  assert.equal(indexRules.isCategoryIndexable(0), false);
  assert.equal(indexRules.isCategoryIndexable(3), true);
  assert.ok(indexRules.districtEditorialWords("first-district") > 0);
});

test("isCityDistrictSlug يرفض حي المدينة الأخرى والمدن المجهولة", () => {
  assert.equal(slugs.isCityDistrictSlug("new-damietta", "sixth-district"), true);
  assert.equal(slugs.isCityDistrictSlug("new-mansoura", "sixth-district"), false);
  assert.equal(slugs.isCityDistrictSlug("new-damietta", "r1"), false);
  assert.equal(slugs.isCityDistrictSlug("cairo", "r1"), false);
  assert.equal(slugs.isCityDistrictSlug("toString", "r1"), false);
});
