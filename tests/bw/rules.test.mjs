// اختبار قواعد Firestore لقسم «أراضي بيت الوطن للبيع» على المحاكي (بلا شبكة، مشروع demo-).
// التشغيل: npm run test:bw-rules  (يتطلب Java؛ المحاكي يبدأ ويتوقف تلقائيًا)
import test from "node:test";
import assert from "node:assert";

const HOST = process.env.FIRESTORE_EMULATOR_HOST || "127.0.0.1:8080";
const PROJECT = process.env.GCLOUD_PROJECT || "demo-bw";
const BASE = `http://${HOST}/v1/projects/${PROJECT}/databases/(default)/documents`;
const ADMIN_UID = "OaxywaxcdFNn3kTJeE7MJTq9M0L2";

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const token = (uid) => `${b64({ alg: "none", typ: "JWT" })}.${b64({ sub: uid, user_id: uid, iat: 0, exp: 9999999999, aud: PROJECT, iss: `https://securetoken.google.com/${PROJECT}`, auth_time: 0, firebase: { sign_in_provider: "password" } })}.`;
const AS = { anon: {}, admin: { Authorization: `Bearer ${token(ADMIN_UID)}` }, user: { Authorization: `Bearer ${token("someone-else")}` }, owner: { Authorization: "Bearer owner" } };

function val(v) {
  if (v === null) return { nullValue: null };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === "string") return { stringValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(val) } };
  return { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, val(x)])) } };
}
const fields = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, val(v)]));

async function commit(who, writes) {
  const r = await fetch(`${BASE}:commit`, { method: "POST", headers: { "content-type": "application/json", ...AS[who] }, body: JSON.stringify({ writes }) });
  return r.status;
}
const put = (who, path, data, serverTimeField) =>
  commit(who, [{ update: { name: `projects/${PROJECT}/databases/(default)/documents/${path}`, fields: fields(data) }, ...(serverTimeField ? { updateTransforms: [{ fieldPath: serverTimeField, setToServerValue: "REQUEST_TIME" }] } : {}) }]);
const get = async (who, path) => (await fetch(`${BASE}/${path}`, { headers: AS[who] })).status;
async function queryStatus(who, collection, status) {
  const where = status ? { fieldFilter: { field: { fieldPath: "status" }, op: "EQUAL", value: { stringValue: status } } } : undefined;
  const r = await fetch(`${BASE}:runQuery`, { method: "POST", headers: { "content-type": "application/json", ...AS[who] }, body: JSON.stringify({ structuredQuery: { from: [{ collectionId: collection }], ...(where ? { where } : {}) } }) });
  return r.status;
}

const REQ = { kind: "buy", name: "تجربة", phone: "+201000000000", citySlug: "new-cairo", district: "الحي الخامس", phase: "11", area: 450, budgetEgp: 5000000, notes: "", consent: true, status: "new" };
let n = 0;
const id = () => `t${Date.now()}${n++}`;

test.before(async () => {
  await fetch(`http://${HOST}/emulator/v1/projects/${PROJECT}/databases/(default)/documents`, { method: "DELETE" });
  for (const s of ["active", "sold", "expired", "draft", "withdrawn"]) assert.strictEqual(await put("owner", `bw_listings/L_${s}`, { status: s, citySlug: "new-cairo" }), 200);
  assert.strictEqual(await put("owner", "bw_private/L_active", { sellerName: "x", plotNumber: "112" }), 200);
  assert.strictEqual(await put("owner", "bw_demand/new-cairo", { total: 3 }), 200);
  assert.strictEqual(await put("owner", "properties/P1", { title: "x" }), 200);
});

test("الزائر ينشئ طلبًا صالحًا", async () => {
  assert.strictEqual(await put("anon", `bw_requests/${id()}`, REQ, "createdAt"), 200);
  assert.strictEqual(await put("anon", `bw_requests/${id()}`, { ...REQ, kind: "sell", phase: "old", area: null, budgetEgp: null }, "createdAt"), 200);
});

test("الطلبات المخالفة تُرفض", async () => {
  const bad = [
    { ...REQ, extra: 1 },
    { ...REQ, status: "matched" },
    { ...REQ, phone: "call me" },
    { ...REQ, consent: false },
    { ...REQ, kind: "rent" },
    { ...REQ, phase: "12" },
    { ...REQ, name: "x".repeat(81) },
    { ...REQ, notes: "x".repeat(501) },
    { ...REQ, citySlug: "Cairo City" },
    { ...REQ, area: 4.5 },
  ];
  for (const b of bad) assert.strictEqual(await put("anon", `bw_requests/${id()}`, b, "createdAt"), 403, JSON.stringify(b).slice(0, 80));
  // وقت الإنشاء لازم يكون وقت الخادم
  assert.strictEqual(await put("anon", `bw_requests/${id()}`, { ...REQ, createdAt: "2020-01-01" }), 403);
});

test("الطلبات لا يقرؤها ولا يعدلها إلا المسؤول", async () => {
  const rid = id();
  assert.strictEqual(await put("anon", `bw_requests/${rid}`, REQ, "createdAt"), 200);
  assert.strictEqual(await get("anon", `bw_requests/${rid}`), 403);
  assert.strictEqual(await get("user", `bw_requests/${rid}`), 403);
  assert.strictEqual(await queryStatus("anon", "bw_requests"), 403);
  assert.strictEqual(await put("anon", `bw_requests/${rid}`, { ...REQ, status: "new", name: "مختلف" }, "createdAt"), 403);
  assert.strictEqual(await get("admin", `bw_requests/${rid}`), 200);
  assert.strictEqual(await queryStatus("admin", "bw_requests"), 200);
});

test("الإعلانات: النشط والمباع والمنتهي فقط للعامة", async () => {
  for (const s of ["active", "sold", "expired"]) assert.strictEqual(await get("anon", `bw_listings/L_${s}`), 200, s);
  for (const s of ["draft", "withdrawn"]) assert.strictEqual(await get("anon", `bw_listings/L_${s}`), 403, s);
  assert.strictEqual(await get("admin", "bw_listings/L_draft"), 200);
  assert.strictEqual(await queryStatus("anon", "bw_listings", "active"), 200);
  assert.strictEqual(await queryStatus("anon", "bw_listings", "sold"), 200);
  assert.strictEqual(await queryStatus("anon", "bw_listings"), 403); // استعلام بلا فلتر قد يلمس المسودات
  assert.strictEqual(await queryStatus("anon", "bw_listings", "draft"), 403);
});

test("الكتابة في الإعلانات والملف الخاص وعدادات الطلب للمسؤول وحده", async () => {
  assert.strictEqual(await put("anon", "bw_listings/X1", { status: "active" }), 403);
  assert.strictEqual(await put("user", "bw_listings/X1", { status: "active" }), 403);
  assert.strictEqual(await put("admin", "bw_listings/X1", { status: "draft" }), 200);
  assert.strictEqual(await get("anon", "bw_private/L_active"), 403);
  assert.strictEqual(await get("user", "bw_private/L_active"), 403);
  assert.strictEqual(await get("admin", "bw_private/L_active"), 200);
  assert.strictEqual(await get("anon", "bw_plot_index/abc"), 403);
  assert.strictEqual(await put("anon", "bw_plot_index/abc", { listingId: "X" }), 403);
  assert.strictEqual(await get("anon", "bw_demand/new-cairo"), 200);
  assert.strictEqual(await put("anon", "bw_demand/new-cairo", { total: 99 }), 403);
  assert.strictEqual(await put("admin", "bw_demand/new-cairo", { total: 4 }), 200);
});

test("لا تغيير على العقارات الحالية", async () => {
  assert.strictEqual(await get("anon", "properties/P1"), 200);
  assert.strictEqual(await put("anon", "properties/P2", { title: "x" }), 403);
  assert.strictEqual(await put("admin", "properties/P2", { title: "x" }), 200);
});
