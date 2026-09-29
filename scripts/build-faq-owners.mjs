#!/usr/bin/env node
// scripts/build-faq-owners.mjs
// يولّد src/lib/seo/faq-owners.json: مالك واحد (رابط) لكل سؤال عبر الموقع الرئيسي ومنصة الحجز الذكي.
// المصدر: بنك الأسئلة questions.json (بحث AEO، خارج المستودع) + إجابات الموقع الرئيسي في src/lib/answers.
// الاستخدام: node scripts/build-faq-owners.mjs /path/to/aeo/questions.json
// الناتج يُنسخ حرفيًا إلى المنصة (edge/seo/faq-owners.json) ويُثبَّت بـ SHA-256 في اختبار كل مستودع.

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const qPath = process.argv[2] || process.env.AEO_QUESTIONS;
if (!qPath || !fs.existsSync(qPath)) {
  console.error("usage: node scripts/build-faq-owners.mjs /path/to/aeo/questions.json");
  process.exit(2);
}
const SITE = "https://eltaiseer.com";

// ترجمة إجابات الموقع (TypeScript) إلى مجلد مؤقت ثم قراءتها
const out = fs.mkdtempSync(path.join(os.tmpdir(), "faq-owners-"));
execFileSync(
  path.join(root, "node_modules/.bin/tsc"),
  ["--outDir", out, "--module", "commonjs", "--target", "es2020", "--moduleResolution", "node", "--resolveJsonModule",
    "--esModuleInterop", "--skipLibCheck", "--strict", path.join(root, "src/lib/answers/index.ts")],
  { stdio: "inherit" }
);
const require = createRequire(import.meta.url);
const find = (dir, name) => {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) { const r = find(p, name); if (r) return r; }
    else if (p.endsWith(name)) return p;
  }
  return null;
};
const { ANSWERS } = require(find(out, path.join("answers", "index.js")));
const { normalizeQuestion } = require(find(out, path.join("seo", "lint.js")));

const bank = JSON.parse(fs.readFileSync(qPath, "utf8")).questions;

// تصحيحات بنك الأسئلة (spec-final Appendix 6)
const ERRATA_OWNER = {
  Q119: `${SITE}/beit-al-watan-for-sale/phase-11/`,
  Q099: `${SITE}/beit-al-watan-for-sale/#can-i-sell`,
  // مالك بنك الأسئلة noindex الآن (حي أو فئة بلا عروض ونص أقل من 250 كلمة، lib/indexRules.ts):
  // السؤال وإجابته على صفحة قابلة للفهرسة، وصفحة البنك تعرض رابطًا إليه فقط (نفس بديل B5)
  Q163: `${SITE}/new-damietta/#beit-al-watan`,
  Q171: `${SITE}/prices/#national-housing`,
  Q182: `${SITE}/new-damietta/#lands`,
};
// صفحات مدن إعادة البيع noindex حتى 3 إعلانات موثّقة: أسئلتها يملكها المحور مؤقتًا (B5 fallback)
const RESALE_HUB = `${SITE}/beit-al-watan-for-sale/`;

const mainById = new Map(ANSWERS.map((a) => [a.id, a]));
const entries = [];
const seen = new Set();
for (const q of bank) {
  let owner = ERRATA_OWNER[q.id] || q.owner_url;
  if (!owner || !owner.startsWith(SITE)) continue; // أسئلة بلا مالك على الموقع (رابط الهيئة فقط أو لا ننشر)
  if (/noindex until/.test(q.owner_status || "")) owner = RESALE_HUB;
  const main = mainById.get(q.id);
  let status = "external";
  let question = q.question;
  if (main) {
    const bankPath = owner.replace(SITE, "").split("#")[0];
    if (bankPath !== main.owner) {
      throw new Error(`${q.id}: answers owner ${main.owner} ≠ questions.json owner ${bankPath}`);
    }
    const frag = owner.includes("#") ? owner.split("#")[1] : main.anchor; // جزء الرابط في questions.json يغلب
    if (main.anchor && owner.includes("#") && frag !== main.anchor) {
      throw new Error(`${q.id}: anchor ${main.anchor} ≠ questions.json fragment #${frag}`);
    }
    owner = `${SITE}${main.owner}${frag ? `#${frag}` : ""}`;
    question = main.q;
    status = main.status;
  }
  entries.push({ id: q.id, owner_url: owner, normalized_question: normalizeQuestion(question), status });
  seen.add(q.id);
}
for (const a of ANSWERS) {
  if (seen.has(a.id)) continue;
  if (!a.id.startsWith("M-")) throw new Error(`${a.id} is not in questions.json and is not an M- id`);
  entries.push({
    id: a.id,
    owner_url: `${SITE}${a.owner}${a.anchor ? `#${a.anchor}` : ""}`,
    normalized_question: normalizeQuestion(a.q),
    status: a.status,
  });
}
entries.sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true }));

// سؤال مطبَّع واحد = مالك واحد
const byQ = new Map();
for (const e of entries) {
  const prev = byQ.get(e.normalized_question);
  if (prev && prev.owner_url.split("#")[0] !== e.owner_url.split("#")[0]) {
    throw new Error(`duplicate question on two owners: ${prev.id} ${prev.owner_url} / ${e.id} ${e.owner_url}`);
  }
  byQ.set(e.normalized_question, e);
}

const file = path.join(root, "src/lib/seo/faq-owners.json");
fs.writeFileSync(file, JSON.stringify(entries, null, 1) + "\n");
fs.rmSync(out, { recursive: true, force: true });
console.log(`wrote ${entries.length} owners → ${path.relative(root, file)}`);
