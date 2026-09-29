// فحص المحتوى (spec-final A0.1 / A8.1): لا عبارة وعد بعائد أو نمو، ولا رقم غير موثق من القائمة المحظورة،
// في نصوص src وملفات llms؛ وملفا llms المولَّدان (src/lib/seo/llms.ts) بسطر الاستقلالية وتاريخ ومقاس محدد.
// التشغيل: npm run test:seo
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..", "..");
const lint = require(path.join(root, ".seo-test/seo/lint.js"));

// ── نصوص المصدر وملفات llms ─────────────────────────────────────────────────
test("لا عبارة محظورة في نصوص src (عدا ملف الفحص نفسه) ولا في ملفات llms", () => {
  const hits = [];
  const walk = (d) => {
    for (const f of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, f.name);
      if (f.isDirectory()) walk(p);
      else if (/\.(tsx?|txt)$/.test(f.name)) {
        if (p.endsWith(path.join("seo", "lint.ts"))) continue;
        fs.readFileSync(p, "utf8").split("\n").forEach((line, i) => {
          if (/^\s*\/\//.test(line)) return; // تعليقات الكود
          const r = lint.lintText(line.replace(/\b(?:hot|weight|score|cluster|prob|sniper|wishlist|top_?k)\b/gi, ""));
          if (r.length) hits.push(`${path.relative(root, p)}:${i + 1} ${r.join(" ")}`);
        });
      }
    }
  };
  walk(path.join(root, "src"));
  walk(path.join(root, "public"));
  assert.deepEqual(hits, []);
});

// ملفا llms يُولَّدان الآن من src/lib/seo/llms.ts (مسارا /llms.txt و/llms-full.txt)، فيُختبر الناتج نفسه
// ببيانات ثابتة: مع الأسعار وبدونها (فشل الجلب)، ومع مدينة إعادة بيع قابلة للفهرسة وبدونها.
const llms = require(path.join(root, ".seo-test/seo/llms.js"));
const prices = require(path.join(root, ".seo-test/seo/prices.js"));

function llmsFixtures() {
  const rows = [];
  const mk = (i, city, district, type, price, area) => ({
    id: `${city}-${i}`, price, area, type, cityId: city, district, status: "جاهز", createdAt: "2026-09-27T09:00:00Z",
  });
  let i = 0;
  for (const d of ["الحي الأول", "الحي الثاني", "الحي الثالث"]) for (let k = 0; k < 3; k++) rows.push(mk(i++, "new-damietta", d, "شقة", 1_000_000 + k * 250_000 + i * 10_000, 110));
  for (let k = 0; k < 3; k++) rows.push(mk(i++, "new-damietta", "بيت الوطن - شرق", "أرض", 2_500_000 + k * 100_000, 300));
  for (let k = 0; k < 4; k++) rows.push(mk(i++, "new-mansoura", "R1", "شقة", 1_700_000 + k * 90_000, 120));
  const s = prices.computePriceStats(rows);
  return [
    { prices: s, resaleCities: ["new-damietta"] },
    { prices: s, resaleCities: [] },
    { prices: null, resaleCities: [] },
  ];
}

test("ملفا llms: سطر الاستقلالية، ولا «الموقع الرسمي»، وتاريخ آخر تحديث، والحجم", () => {
  for (const data of llmsFixtures()) {
    for (const [f, build, max] of [
      ["llms.txt", llms.buildLlms, 10240],
      ["llms-full.txt", llms.buildLlmsFull, 61440],
    ]) {
      const t = build(data).text;
      assert.ok(lint.INDEPENDENCE.test(t), f);
      let plain = t;
      for (const q of lint.OFFICIAL_SITE_QUESTIONS) plain = plain.split(q).join(" ");
      assert.ok(!lint.OFFICIAL_SITE.test(plain), f);
      assert.deepEqual(lint.lintText(t), [], f);
      assert.ok(/آخر تحديث للملف: \d{1,2}\/\d{1,2}\/\d{4}/.test(t), f);
      assert.ok(Buffer.byteLength(t) <= max, `${f} ${Buffer.byteLength(t)} bytes`);
      assert.ok(!/eltaiseer\.com\/baitelwatan\/(?!\))(?!\s)[a-z]/.test(t), `${f}: platform deep link before launch`);
      // نفس فحص المسار قبل التقديم (llmsRoute.ts) يجب أن يمر
      assert.deepEqual(llms.checkLlms(t, max), [], f);
    }
  }
});
