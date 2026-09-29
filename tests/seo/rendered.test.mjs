// اختبارات الصفحات المعروضة (spec-final A8.2) — تعمل على خادم يعمل:
//   NEXT_TELEMETRY_DISABLED=1 npx next build && npx next start -p 3130
//   BASE_URL=http://localhost:3130 npm run test:seo:rendered
// وبعد النشر: BASE_URL=https://eltaiseer.com npm run test:seo:rendered
// يحتاج .seo-test من npm run test:seo (lint وschema المترجمان).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..", "..");
const require = createRequire(import.meta.url);
const lint = require(path.join(root, ".seo-test/seo/lint.js"));
const { ID_RE } = require(path.join(root, ".seo-test/seo/schema.js"));
const registry = require(path.join(root, "src/lib/seo/schema-registry.json"));
const owners = require(path.join(root, "src/lib/seo/faq-owners.json"));
const platformRoutes = require(path.join(root, "src/lib/bw/platform-routes.json"));
const URLS = JSON.parse(fs.readFileSync(path.join(here, "urls.json"), "utf8"));
const BASE = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const SITE = "https://eltaiseer.com";
const CAVEAT = "الحجز في المرحلة 11 لمن سجّل حوالته التنشيطية في موعدها";
const BANNED = new Set(["Speakable", "SpeakableSpecification", "HowTo", "Event", "AggregateRating", "Review", "GovernmentOrganization", "GovernmentService"]);

const decode = (s) =>
  s.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");
function visibleText(html) {
  return decode(
    html
      .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  ).replace(/\s+/g, " ");
}
function jsonLdBlocks(html) {
  return [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
}
function nodesOf(block) {
  const flat = [];
  const walk = (v) => {
    if (Array.isArray(v)) return v.forEach(walk);
    if (!v || typeof v !== "object") return;
    if (v["@type"] || v["@id"]) flat.push(v);
    Object.values(v).forEach(walk);
  };
  walk(block["@graph"] || block);
  return flat;
}
function refsOf(v, out = []) {
  if (Array.isArray(v)) v.forEach((x) => refsOf(x, out));
  else if (v && typeof v === "object") {
    const k = Object.keys(v);
    if (k.length === 1 && k[0] === "@id") out.push(v["@id"]);
    else Object.values(v).forEach((x) => refsOf(x, out));
  }
  return out;
}
const types = (n) => [].concat(n["@type"] || []);

const pages = new Map();
async function page(u) {
  if (!pages.has(u)) {
    const res = await fetch(BASE + u, { redirect: "manual" });
    pages.set(u, { status: res.status, html: await res.text() });
  }
  return pages.get(u);
}

const faqQuestionsSeen = new Map();

for (const spec of URLS) {
  test(`${spec.template} ${spec.url}`, async () => {
    const { status, html } = await page(spec.url);
    // 1 الحالة وcanonical ذاتي
    assert.equal(status, 200);
    if (spec.indexable) assert.match(html, new RegExp(`<link rel="canonical" href="${SITE}${spec.url.replace(/[?]/g, "\\?")}"`));
    // 2 عنوان H1 واحد
    assert.equal((html.match(/<h1[\s>]/gi) || []).length, 1, "exactly one h1");
    // 3 كل JSON-LD صالح
    const blocks = jsonLdBlocks(html).map((b) => JSON.parse(b));
    const all = blocks.flatMap(nodesOf);
    const defined = new Map();
    for (const n of all) {
      if (typeof n["@id"] === "string" && n["@type"]) {
        // 4 المعرّفات والرسم المغلق
        assert.ok(ID_RE.test(n["@id"]), `@id ${n["@id"]}`);
        const prev = defined.get(n["@id"]);
        if (prev) {
          for (const k of ["name", "url"]) if (prev[k] !== undefined && n[k] !== undefined) assert.deepEqual(prev[k], n[k], `${n["@id"]} ${k}`);
        }
        defined.set(n["@id"], n);
      }
    }
    for (const b of blocks) for (const r of refsOf(b["@graph"] || b)) assert.ok(defined.has(r), `dangling ${r}`);
    assert.equal(all.filter((n) => n["@id"] === `${SITE}/#organization` && n["@type"]).length >= 1, true);
    for (const n of all) {
      if (types(n).some((t) => t === "Organization" || t === "RealEstateAgent")) assert.ok(n["@id"], "anonymous organization");
      if (types(n).includes("WebSite")) assert.equal(n["@id"], `${SITE}/#website`);
      // 6 أنواع محظورة
      for (const t of types(n)) assert.ok(!BANNED.has(t), `banned ${t}`);
      // 5 تطابق قوالب السجل
      const stub = registry.stubs[n["@id"]];
      if (stub && n["@type"]) for (const k of Object.keys(stub)) if (k in n) assert.deepEqual(n[k], stub[k], `${n["@id"]}.${k}`);
    }
    const orgDefs = all.filter((n) => n["@id"] === `${SITE}/#organization` && n["@type"]);
    const fullOrg = orgDefs.filter((n) => n.address);
    assert.equal(fullOrg.length, 1, "one full #organization");
    // 7 عبارات محظورة
    const text = visibleText(html);
    const ld = jsonLdBlocks(html).join(" ");
    assert.deepEqual(lint.lintText(text.replace(/\b(?:hot|weight|score|cluster|prob|sniper|wishlist|top_?k)\b/gi, "")), []);
    assert.deepEqual(lint.lintText(ld.replace(/\b(?:hot|weight|score|cluster|prob|sniper|wishlist|top_?k)\b/gi, "")), []);
    // 8 سطر الاستقلالية
    if (spec.bw || spec.independence) assert.ok(lint.INDEPENDENCE.test(text), "independence line");
    // 9 «الموقع الرسمي»
    assert.ok(lint.lintOfficialSite(html.replace(/<script\b[\s\S]*?<\/script>/gi, "")), "الموقع الرسمي outside the NUCA link");
    for (const n of all) {
      for (const [k, v] of Object.entries(n)) {
        if (typeof v === "string" && lint.OFFICIAL_SITE.test(v)) {
          assert.ok(k === "name" && lint.OFFICIAL_SITE_QUESTIONS.includes(v), `JSON-LD «الموقع الرسمي» in ${k}`);
        }
      }
    }
    // 10 و15 فقرة الإجابة بعد H1 مباشرة، بأرقام لاتينية
    if (spec.lede) {
      const after = html.split(/<\/h1>/)[1] || "";
      const p = after.match(/<p\b([^>]*)>([\s\S]*?)<\/p>/);
      assert.ok(p && /answer-lede/.test(p[1]), "first <p> after h1 is .answer-lede");
      const words = lint.wordCount(visibleText(p[2]));
      assert.ok(words >= 30 && words <= 70, `lede words ${words}`);
      assert.ok(!/[٠-٩]/.test(p[2]), "Arabic-Indic digits in lede");
    }
    // 11 تاريخ مرئي = dateModified
    const webpage = all.find((n) => typeof n["@id"] === "string" && n["@id"].endsWith("#webpage") && n.dateModified);
    if (webpage) {
      const times = [...html.matchAll(/<time[^>]*dateTime="([^"]+)"/gi)].map((m) => m[1]);
      if (times.length) assert.ok(times.includes(webpage.dateModified), `no <time> = dateModified ${webpage.dateModified} (${times.join(", ")})`);
    }
    // 12 robots
    if (spec.indexable) {
      const robots = (html.match(/<meta name="robots" content="([^"]+)"/) || [])[1] || "";
      assert.ok(!/noindex/.test(robots), `robots ${robots}`);
      assert.ok(/max-image-preview:large/.test(html), "max-image-preview:large");
    }
    // 13 ملكية الأسئلة
    const faqs = all.filter((n) => types(n).includes("FAQPage"));
    for (const f of faqs) {
      const qs = [].concat(f.mainEntity || []);
      assert.ok(qs.length <= 6, "≤ 6 questions");
      for (const q of qs) {
        assert.ok(text.includes(q.name), `Question not visible: ${q.name}`);
        const norm = lint.normalizeQuestion(q.name);
        const o = owners.find((x) => x.normalized_question === norm);
        assert.ok(o, `no owner for ${q.name}`);
        assert.equal(o.owner_url.split("#")[0], `${SITE}${spec.url}`, `owner of ${q.name}`);
        const prev = faqQuestionsSeen.get(norm);
        assert.ok(!prev || prev === spec.url, `question on two pages: ${q.name}`);
        faqQuestionsSeen.set(norm, spec.url);
        assert.ok(q.acceptedAnswer.text.length <= 300);
      }
    }
    // 14 روابط المنصة
    for (const m of html.matchAll(/<a\b[^>]*href="(\/baitelwatan\/[^"]*)"[^>]*>([\s\S]*?)<\/a>/g)) {
      assert.ok(!m[1].startsWith("/baitelwatan/api/"));
      assert.ok(platformRoutes.includes(m[1]), `platform link not live: ${m[1]}`);
      if (m[1] === "/baitelwatan/") assert.equal(visibleText(m[2]).trim(), "التيسير — الحجز الذكي");
    }
    // 16 عناصر المرساة للأسئلة الموثّقة المملوكة
    for (const o of owners) {
      if (o.status !== "verified" || !o.owner_url.includes("#")) continue;
      const [u, frag] = o.owner_url.split("#");
      if (u !== `${SITE}${spec.url}`) continue;
      assert.ok(new RegExp(`id="${frag}"`).test(html), `missing anchor #${frag}`);
    }
    // 17 حجم JSON-LD
    assert.ok(Buffer.byteLength(ld) <= 12288, `JSON-LD ${Buffer.byteLength(ld)} bytes`);
    // 19 جدول المرحلة 11: بالاسم وبلا «محجوز»
    if (spec.template === "resale-phase-11" && /id="official-available"/.test(html)) {
      const section = html.split('id="official-available"')[1].split("</section>")[0];
      assert.ok(!/<th[^>]*>محجوز<\/th>/.test(section));
      const names = [...section.matchAll(/<th scope="row"[^>]*>([^<]+)<\/th>/g)].map((m) => decode(m[1]).trim());
      assert.deepEqual(names, [...names].sort((a, b) => a.localeCompare(b, "ar")));
    }
    // 20 شرط الأهلية بجوار المتاح من الهيئة
    if (spec.caveat && /المتاح من الهيئة|المتاح الآن/.test(text)) assert.ok(text.includes(CAVEAT), "eligibility caveat");
  });
}

test("robots.txt: /baitelwatan/api/ ممنوع لكل المجموعات وBytespider ممنوع كليًا", async () => {
  const res = await fetch(`${BASE}/robots.txt`);
  const txt = await res.text();
  const groups = txt.split(/\n\s*\n/).filter((g) => /User-Agent:/i.test(g));
  assert.ok(groups.length >= 3);
  for (const g of groups) {
    if (/User-Agent: Bytespider/i.test(g)) assert.match(g, /Disallow: \/\s*$/m);
    else assert.match(g, /Disallow: \/baitelwatan\/api\//);
  }
});
