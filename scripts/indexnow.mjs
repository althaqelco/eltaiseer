#!/usr/bin/env node
// IndexNow: يبلّغ Bing (فهرسه يغذي Copilot وجزءاً من نتائج بحث ChatGPT) و Yandex و Seznam و Naver فوراً بكل روابط الـ sitemap
// بدل انتظار الزحف. التشغيل بعد كل نشر:  npm run indexnow
// المفتاح ملف عام في public/ يثبت ملكية النطاق — ليس سراً.

const HOST = "eltaiseer.com";
const KEY = "c4f6ada0f34bdf2b30b61809e1eabc1c";
const SITEMAP = `https://${HOST}/sitemap.xml`;

const xml = await (await fetch(SITEMAP)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
if (urlList.length === 0) {
  console.error("لا توجد روابط في الـ sitemap — لم يُرسل شيء");
  process.exit(1);
}

const keyCheck = await fetch(`https://${HOST}/${KEY}.txt`);
if (!keyCheck.ok || (await keyCheck.text()).trim() !== KEY) {
  console.error(`ملف المفتاح غير منشور بعد على https://${HOST}/${KEY}.txt — انشر الموقع أولاً`);
  process.exit(1);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} — ${urlList.length} رابط`);
process.exit(res.ok ? 0 : 1);
