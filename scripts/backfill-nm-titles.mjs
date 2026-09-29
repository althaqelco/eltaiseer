#!/usr/bin/env node
// scripts/backfill-nm-titles.mjs — تصحيح لمرة واحدة (spec-final A0.2): إعلانات المنصورة الجديدة التي حفظت لوحة
// التحكم عنوانها أو وصفها بلاحقة «دمياط الجديدة» (enhanceTitle/enhanceDescription قبل تمرير cityId).
//
// الافتراضي تجربة بلا كتابة: يطبع ما سيتغير فقط.
//   node scripts/backfill-nm-titles.mjs
// التطبيق (المالك فقط، بحساب المسؤول):
//   ADMIN_EMAIL=… ADMIN_PASSWORD=… node scripts/backfill-nm-titles.mjs --apply
// يكتب title وdescription وupdatedAt فقط للإعلانات المتأثرة.

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc, serverTimestamp } from "firebase/firestore";

const APPLY = process.argv.includes("--apply");
const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCbmgvmk35VHgzdpsZR8P4tdgfZRprIV40",
  authDomain: "eltaiseer-properties.firebaseapp.com",
  projectId: "eltaiseer-properties",
});
const db = getFirestore(app);
const NM = "المنصورة الجديدة";
const ND = "دمياط الجديدة";

// نفس منطق enhanceTitle في src/lib/seoOptimizer.ts، على الجزء قبل « | »
function fixTitle(title, type, district) {
  const base = title.split(" | ")[0].trim();
  if (!title.includes(" | ") || !title.split(" | ").slice(1).join(" | ").includes(ND)) return title;
  if (base.length < 15) return title; // عنوان مولَّد بالكامل: يُراجع يدويًا
  const hasLocation = base.includes("دمياط") || base.includes("المنصورة") || base.includes(district);
  const hasType = base.includes(type);
  if (!hasLocation && !hasType) return `${base} | ${type} ${district} - ${NM}`;
  if (!hasLocation) return `${base} | ${district} - ${NM}`;
  return base;
}
const fixDescription = (d) => (d || "").replace(`التيسير للعقارات - ${ND}`, `التيسير للعقارات - ${NM}`);

const snap = await getDocs(collection(db, "properties"));
const changes = [];
for (const d of snap.docs) {
  const p = d.data();
  if ((p.location?.cityId || "new-damietta") !== "new-mansoura") continue;
  const title = fixTitle(p.title || "", p.type || "", p.location?.district || "");
  const description = fixDescription(p.description);
  if (title !== p.title || description !== (p.description || "")) changes.push({ id: d.id, title, description, old: p.title });
}
for (const c of changes) console.log(`${c.id}\n  - ${c.old}\n  + ${c.title}`);
console.log(`${changes.length} New Mansoura listing(s) to fix${APPLY ? "" : " (dry run; add --apply to write)"}`);

if (APPLY && changes.length) {
  const { getAuth, signInWithEmailAndPassword } = await import("firebase/auth");
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) throw new Error("ADMIN_EMAIL / ADMIN_PASSWORD required for --apply");
  await signInWithEmailAndPassword(getAuth(app), process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
  for (const c of changes) {
    await updateDoc(doc(db, "properties", c.id), { title: c.title, description: c.description, updatedAt: serverTimestamp() });
  }
  console.log("applied");
}
process.exit(0);
