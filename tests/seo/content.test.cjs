// فحص المحتوى (spec-final A0.1 / A8.1): لا عبارة وعد بعائد أو نمو، ولا رقم غير موثق من القائمة المحظورة،
// في نصوص src وملفات llms؛ وملفا llms المؤقتان بسطر الاستقلالية وتاريخ ومقاس محدد.
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

test("ملفا llms: سطر الاستقلالية، ولا «الموقع الرسمي»، وتاريخ آخر تحديث، والحجم", () => {
  for (const [f, max] of [["llms.txt", 10240], ["llms-full.txt", 61440]]) {
    const t = fs.readFileSync(path.join(root, "public", f), "utf8");
    assert.ok(lint.INDEPENDENCE.test(t), f);
    let plain = t;
    for (const q of lint.OFFICIAL_SITE_QUESTIONS) plain = plain.split(q).join(" ");
    assert.ok(!lint.OFFICIAL_SITE.test(plain), f);
    assert.deepEqual(lint.lintText(t), [], f);
    assert.ok(/آخر تحديث للملف: \d{1,2}\/\d{1,2}\/\d{4}/.test(t), f);
    assert.ok(Buffer.byteLength(t) <= max, `${f} ${Buffer.byteLength(t)} bytes`);
    assert.ok(!/eltaiseer\.com\/baitelwatan\/(?!\))(?!\s)[a-z]/.test(t), `${f}: platform deep link before launch`);
  }
});
