// اختبارات الحسابات النقية لقسم «أراضي بيت الوطن للبيع». التشغيل: npm run test:bw
// الفكسشر عينة صغيرة من /baitelwatan/api/plots العام (28/9/2026).
const test = require("node:test");
const assert = require("node:assert");
const path = require("node:path");
const fs = require("node:fs");

const OUT = path.join(__dirname, "..", "..", ".bw-test");
const calc = require(path.join(OUT, "calc.js"));
const lp = require(path.join(OUT, "live-parse.js"));
const cities = require(path.join(OUT, "cities.js"));
const pub = require(path.join(OUT, "publish.js"));
const payload = JSON.parse(fs.readFileSync(path.join(__dirname, "plots.fixture.json"), "utf8"));

const DAY = 86400000;
const cairoNow = (agoMs = 3600000) => new Date(Date.now() - agoMs + 3 * 3600000).toISOString().slice(0, 19).replace("T", " ");
const L = (o) => ({
  id: "AB12CD34", status: "active", citySlug: "new-cairo", district: "الحي الخامس", districtSlug: "district-5",
  phase: 3, stage: "received", area: 500, corner: false, garden: false, sea: false,
  officialTotalUsd: 75000, paidUsd: 75000, remainingUsd: 0, premiumEgp: 4850000, usdEgp: 48.5, usdEgpDate: "2026-09-27",
  feesPct: 0, summary: "", photos: [], checks: [], verifiedAt: new Date(Date.now() - DAY).toISOString().slice(0, 10),
  platformMatched: false, approx: false, createdAt: "", updatedAt: "", soldAt: null, ...o,
});

test("كل مدن المنصة لها رابط لاتيني", () => {
  const missing = new Set();
  for (const z of Object.values(payload.zones)) if (!cities.cityByArabic(z.city)) missing.add(z.city);
  assert.deepStrictEqual([...missing], []);
});

test("التجميع يطابق الصفوف ولا يحمل أي حقل خاص أو رقم قطعة", () => {
  const live = lp.aggregatePlots(payload, "2026-09-28T00:00:00Z");
  assert.strictEqual(live.total, payload.rows.length);
  assert.strictEqual(live.available, payload.totals.available);
  const s = JSON.stringify(live);
  for (const bad of ["wishlist", "sniper", "plot_number", "pid", "zone_id", "112"]) assert(!s.includes(bad), bad);
  const nc = live.cities["new-cairo"];
  assert(nc.ppmMin <= nc.ppmMedian && nc.ppmMedian <= nc.ppmMax);
});

test("التجميع يرفض البيانات المعطوبة", () => {
  assert.strictEqual(lp.aggregatePlots({}), null);
  assert.strictEqual(lp.aggregatePlots({ columns: ["x"], rows: [[1]] }), null);
});

test("مطابقة قطعة بعينها للوحة التحكم", () => {
  const h = lp.findPlot(payload, 3625, "112");
  assert(h && h.area === 450 && h.total === 220500 && h.down === 55125 && h.status === "reserved" && h.basePpm === 490);
  assert.strictEqual(lp.findPlot(payload, 3625, "999999"), null);
  assert(lp.listZones(payload, "new-cairo").length >= 1);
});

test("كارت التكلفة", () => {
  const c = calc.costCard(L());
  assert.strictEqual(c.toSellerUsd, 175000); // 75,000 + 4,850,000 ÷ 48.5
  assert.strictEqual(c.totalUsdEquiv, 175000);
  assert.strictEqual(c.perM2Usd, 350);
  const f = calc.costCard(L({ feesPct: 1.5 }));
  assert.strictEqual(f.feesUsd, 1125);
  assert.strictEqual(f.totalUsdEquiv, 176125);
  assert.strictEqual(calc.costCard(L({ usdEgp: 0 })).perM2Usd, null);
});

test("المقارنة بالسعر الرسمي", () => {
  const city = { slug: "new-cairo", nameAr: "", total: 10, available: 4, ppmMin: 450, ppmMedian: 450, ppmMax: 490, areaMin: 0, areaMax: 0 };
  const cmp = calc.compareWithOfficial(350, city);
  assert.strictEqual(cmp.diffUsd, -100);
  assert.strictEqual(calc.compareWithOfficial(null, city), null);
  assert.strictEqual(calc.compareWithOfficial(350, undefined), null);
});

test("دورة حياة الإعلان", () => {
  const now = Date.now();
  const k = (o) => calc.lifecycle(L(o), now).kind;
  assert.strictEqual(k({}), "live");
  assert.strictEqual(k({ verifiedAt: new Date(now - 46 * DAY).toISOString().slice(0, 10) }), "gone-temp");
  assert.strictEqual(k({ verifiedAt: new Date(now + 400 * DAY).toISOString().slice(0, 10) }), "gone-temp"); // تاريخ في المستقبل
  assert.strictEqual(k({ status: "sold", soldAt: new Date(now - 5 * DAY).toISOString() }), "sold-visible");
  assert.strictEqual(k({ status: "sold", soldAt: new Date(now - 31 * DAY).toISOString() }), "gone-permanent");
  assert.strictEqual(k({ status: "expired" }), "gone-temp");
  assert.strictEqual(k({ status: "withdrawn" }), "not-found");
  assert.strictEqual(k({ status: "draft" }), "not-found");
  assert.strictEqual(calc.lifecycle(null, now).kind, "not-found");
});

test("سعر السوق لا يظهر إلا من 3 نقاط خلال 90 يومًا", () => {
  const now = Date.now();
  assert.deepStrictEqual(calc.marketByCity([L(), L({ id: "B" })], now), {});
  const m = calc.marketByCity(
    [L(), L({ id: "B", premiumEgp: 9700000 }), L({ id: "C", status: "sold", soldAt: new Date().toISOString() }), L({ id: "D", status: "draft" })],
    now
  );
  assert.strictEqual(m["new-cairo"].n, 3);
  assert.strictEqual(m["new-cairo"].medianPerM2Usd, 350);
  assert.strictEqual(calc.marketByCity([L(), L({ id: "B" }), L({ id: "E", verifiedAt: "2026-01-01" })], now)["new-cairo"], undefined);
});

test("روابط الإعلانات", () => {
  assert.strictEqual(calc.listingSlug(L()), "district-5-500m-ab12cd34");
  assert.strictEqual(calc.idFromSlug("district-5-500m-ab12cd34"), "AB12CD34");
  assert.strictEqual(calc.listingPath(L()), "/beit-al-watan-for-sale/new-cairo/district-5-500m-ab12cd34/");
  assert.strictEqual(calc.listingSlug(L({ districtSlug: "", area: 0 })), "plot-ab12cd34");
});

test("اقتراح رابط الحي", () => {
  assert.strictEqual(cities.suggestDistrictSlug("الحي الخامس"), "district-5");
  assert.strictEqual(cities.suggestDistrictSlug("الحى الأول"), "district-1");
  assert.strictEqual(cities.suggestDistrictSlug("شمال بيت الوطن"), "north");
  assert.strictEqual(cities.suggestDistrictSlug("منطقة A"), "");
  assert(cities.isValidSlug("district-5") && !cities.isValidSlug("District 5") && !cities.isValidSlug("-x"));
});

const ALL_CHECKS = ["identity", "allocation", "receipts", "portal", "authority", "poa", "site", "contract"];
const P = (o) => ({
  listingId: "AB12CD34", sellerName: "بائع", sellerPhone: "+201000000000", plotNumber: "112", zone: "Q", plotHash: "abc",
  commissionPct: 2.5, contractSignedAt: "", exclusiveUntil: "", notes: "", authorityTransferConfirmed: false, platform: null, ...o,
});
const ready = (o) => L({ photos: ["https://x/y.jpg"], checks: ALL_CHECKS, ...o });

test("شروط النشر للمراحل حتى العاشرة", () => {
  assert.deepStrictEqual(pub.publishProblems(ready(), P()), []);
  assert(pub.publishProblems(ready({ photos: [] }), P()).length === 1);
  assert(pub.publishProblems(ready({ checks: ALL_CHECKS.filter((c) => c !== "portal") }), P()).length === 1);
  assert(pub.publishProblems(ready({ stage: "installments" }), P()).some((x) => x.includes("أقساط")));
  assert.deepStrictEqual(pub.publishProblems(ready({ stage: "installments" }), P({ authorityTransferConfirmed: true })), []);
  assert(pub.publishProblems(ready({ verifiedAt: "2026-01-01" }), P()).some((x) => x.includes("45")));
  assert(pub.publishProblems(ready(), P({ plotNumber: " " })).length === 1); // من الحقول لا من البصمة القديمة
  assert(pub.publishProblems(ready({ phase: null }), P()).some((x) => x.includes("رقم المرحلة")));
  assert(pub.publishProblems(ready({ phase: 12 }), P()).some((x) => x.includes("رقم المرحلة")));
  assert(pub.publishProblems(ready({ verifiedAt: new Date(Date.now() + 3 * DAY).toISOString().slice(0, 10) }), P()).some((x) => x.includes("المستقبل")));
  const avail = { zoneId: 1, zoneName: "Q", citySlug: "new-cairo", plotNumber: "112", status: "available", statusSince: null, basePpm: 490, total: 1, checkedAt: new Date().toISOString(), dataAt: cairoNow(), k: 5 };
  assert(pub.publishProblems(ready(), P({ platform: avail })).some((x) => x.includes("متاحة")));
});

test("المرحلة 11: تخصيص + مطابقة حديثة محجوزة + تأكيد الجهاز", () => {
  const match = (o) => ({ zoneId: 3625, zoneName: "Q", citySlug: "new-cairo", plotNumber: "112", status: "reserved", statusSince: "2026-09-22", basePpm: 490, total: 220500, checkedAt: new Date().toISOString(), dataAt: cairoNow(), k: 5, ...o });
  const l11 = ready({ phase: 11, stage: "installments" });
  assert.deepStrictEqual(pub.publishProblems(l11, P({ platform: match(), authorityTransferConfirmed: true })), []);
  // بلا خطاب تخصيص: كود الحجز لا يُباع
  assert(pub.publishProblems(ready({ phase: 11, stage: "installments", checks: ALL_CHECKS.filter((c) => c !== "allocation") }), P({ platform: match(), authorityTransferConfirmed: true })).some((x) => x.includes("خطاب التخصيص")));
  // بلا مطابقة، أو مطابقة قديمة، أو القطعة ليست محجوزة
  assert(pub.publishProblems(l11, P({ authorityTransferConfirmed: true })).some((x) => x.includes("طابق")));
  assert(pub.publishProblems(l11, P({ platform: match({ checkedAt: new Date(Date.now() - 8 * DAY).toISOString() }), authorityTransferConfirmed: true })).some((x) => x.includes("أعد مطابقة")));
  assert(pub.publishProblems(l11, P({ platform: match({ status: "available" }), authorityTransferConfirmed: true })).some((x) => x.includes("ليست «محجوزة»")));
  // مطابَقة مع الرصد (الطرح الحالي) لكن المرحلة مكتوبة 10 أو فارغة: لا تمر
  assert(pub.publishProblems(ready({ phase: 10, stage: "installments" }), P({ platform: match(), authorityTransferConfirmed: true })).some((x) => x.includes("لازم تكون 11")));
  assert(pub.publishProblems(ready({ phase: null, stage: "installments" }), P({ platform: match(), authorityTransferConfirmed: true })).length >= 1);
  // وضع القطعة: عليها أقساط متبقية فلا تُعرض «مسددة»، ولم تُسلَّم فلا «مستلمة» أو «مبنية»
  assert(pub.publishProblems(ready({ phase: 11, stage: "paid", remainingUsd: 165000 }), P({ platform: match(), authorityTransferConfirmed: true })).some((x) => x.includes("أقساط متبقية")));
  assert(pub.publishProblems(ready({ phase: 11, stage: "received" }), P({ platform: match(), authorityTransferConfirmed: true })).some((x) => x.includes("لم تُسلَّم")));
  // المطابقة لازم تخص القطعة نفسها ومدينتها
  assert(pub.publishProblems(l11, P({ plotNumber: "113", platform: match(), authorityTransferConfirmed: true })).some((x) => x.includes("لا يطابق")));
  assert.deepStrictEqual(pub.publishProblems(l11, P({ plotNumber: "١١٢", platform: match(), authorityTransferConfirmed: true })), []);
  assert(pub.publishProblems(l11, P({ platform: match({ citySlug: "badr" }), authorityTransferConfirmed: true })).some((x) => x.includes("مدينة")));
  // الحداثة بالأقدم بين وقت المطابقة ووقت لقطة المنصة
  assert(pub.publishProblems(l11, P({ platform: match({ dataAt: "2026-01-01 10:00:00" }), authorityTransferConfirmed: true })).some((x) => x.includes("أعد مطابقة")));
  // قطعة مميزة في البيانات العامة: تحتاج موافقة البائع
  assert(pub.publishProblems(l11, P({ platform: match({ k: 1 }), authorityTransferConfirmed: true })).some((x) => x.includes("موافقة البائع")));
  assert.deepStrictEqual(pub.publishProblems(l11, P({ platform: match({ k: 1 }), authorityTransferConfirmed: true, identifiableConsent: true })), []);
  // حتى لو المرحلة المختارة «مسددة» يظل تأكيد الجهاز شرطًا في المرحلة 11
  assert(pub.publishProblems(ready({ phase: 11, stage: "paid" }), P({ platform: match() })).some((x) => x.includes("تأكيد مكتوب")));
  assert.strictEqual(pub.isPhase11({ phase: 11 }), true);
  assert.strictEqual(pub.isPhase11({ phase: 10 }), false);
  assert.strictEqual(pub.isPhase11({ phase: null }), false);
});

test("مفتاح القطعة يوحّد الأرقام والكتابة", () => {
  const k = pub.plotKey;
  assert.strictEqual(k("new-cairo", "منطقة 5", "١١٢"), k("new-cairo", "المنطقة 5", "112"));
  assert.strictEqual(k("new-cairo", "الحى الرابع - منطقة ( Q )", "112"), k("new-cairo", "الحي الرابع منطقه Q", " 112 "));
  assert.notStrictEqual(k("new-cairo", "منطقة 5", "112"), k("new-cairo", "منطقة 6", "112"));
  assert.strictEqual(k("new-cairo", "أي نص", "112", 3625), "new-cairo|zone:3625|112");
  assert.strictEqual(k("new-cairo", "", "112"), "");
  assert.strictEqual(k("new-cairo", "منطقة 5", ""), "");
});

test("الإعلان العام للقطع المطابَقة بأرقام مقرّبة، وغيرها كما هو", () => {
  const match = { zoneId: 3625, zoneName: "Q", citySlug: "new-cairo", plotNumber: "112", status: "reserved", statusSince: null, basePpm: 490, total: 220500, checkedAt: new Date().toISOString(), dataAt: cairoNow(), k: 5 };
  const exact = L({ phase: 11, area: 451.27, officialTotalUsd: 221124, paidUsd: 55281, remainingUsd: 165843, summary: "x</script>y" });
  const v = pub.publicView(exact, P({ platform: match }));
  assert.strictEqual(v.approx, true);
  assert.strictEqual(v.area, 450);
  assert.strictEqual(v.officialTotalUsd, 220000);
  assert.strictEqual(v.paidUsd, 55000);
  assert.strictEqual(v.remainingUsd, 165000);
  assert(!v.summary.includes("<"));
  const plain = pub.publicView(L({ area: 451.27 }), P());
  assert.strictEqual(plain.approx, false);
  assert.strictEqual(plain.area, 451.27);
});

test("الأعداد والأرقام العربية", () => {
  assert.strictEqual(calc.adsCount(1), "إعلان واحد");
  assert.strictEqual(calc.adsCount(2), "إعلانان");
  assert.strictEqual(calc.adsCount(5), "٥ إعلانات");
  assert.strictEqual(calc.adsCount(11), "١١ إعلانًا");
  assert.strictEqual(calc.adsCount(100), "١٠٠ إعلان");
  assert.strictEqual(calc.adsCount(102), "١٠٢ إعلان");
  assert.strictEqual(calc.adsCount(103), "١٠٣ إعلانات");
  assert.strictEqual(cities.parseNumber("٤٥٠"), 450);
  assert.strictEqual(cities.parseNumber("5,000,000"), 5000000);
  assert.strictEqual(cities.parseNumber("٥٬٠٠٠٬٠٠٠"), 5000000);
  assert.strictEqual(cities.parseNumber("۴۵۰٫۵"), 450.5);
  assert.strictEqual(cities.parseNumber(""), null);
  assert.strictEqual(cities.parseNumber("abc"), null);
  assert.strictEqual(cities.toAsciiDigits("+٢٠١٠٠"), "+20100");
  const j = calc.jsonLd({ a: "</script><b>" });
  assert(!j.includes("<"));
  assert.strictEqual(JSON.parse(j).a, "</script><b>");
  assert.strictEqual(calc.areaLabel({ area: 450, approx: true }), "نحو ٤٥٠ م²");
});

test("مقياس إخفاء الهوية ونطاق سعر المتاح", () => {
  const h = lp.findPlot(payload, 3625, "112");
  const k = lp.anonymityK(payload, h);
  assert(k >= 1); // القطعة نفسها على الأقل
  const live = lp.aggregatePlots(payload);
  for (const c of Object.values(live.cities)) {
    if (c.available > 0) assert(c.availPpmMin >= c.ppmMin && c.availPpmMax <= c.ppmMax);
    else assert.strictEqual(c.availPpmMin, null);
  }
  assert.strictEqual(calc.plotsCount(1), "قطعة واحدة");
  assert.strictEqual(calc.plotsCount(2), "قطعتان");
  assert.strictEqual(calc.plotsCount(7), "٧ قطع");
  assert.strictEqual(calc.plotsCount(760), "٧٦٠ قطعة");
  assert.strictEqual(calc.plotsCount(1021), "١٬٠٢١ قطعة");
  assert.strictEqual(calc.plotsCount(105), "١٠٥ قطع");
  assert.strictEqual(calc.requestsCount(1), "طلب شراء واحد");
});

test("تصحيحات جولة التحقق الأخيرة", () => {
  // أرقام القطع: الفواصل تُوحَّد ولا تُحذف
  assert.strictEqual(pub.normPlotNo("12 / 3"), pub.normPlotNo("١٢/٣"));
  assert.notStrictEqual(pub.normPlotNo("1/23"), pub.normPlotNo("12/3"));
  assert.notStrictEqual(pub.normPlotNo("12/3"), pub.normPlotNo("123"));
  assert.notStrictEqual(pub.normPlotNo("12A"), pub.normPlotNo("12B"));
  // «منطقة» الملاصقة لقوس أو شرطة
  assert.strictEqual(pub.plotKey("new-cairo", "منطقة(Q)", "112"), pub.plotKey("new-cairo", "منطقة Q", "112"));
  assert.strictEqual(pub.plotKey("new-cairo", "منطقة-5", "112"), pub.plotKey("new-cairo", "المنطقة 5", "112"));
  // توقيت القاهرة الصيفي: أبكر تفسير (أحوط)
  assert.strictEqual(new Date(pub.cairoTime("2026-09-28 17:00:50")).toISOString(), "2026-09-28T14:00:50.000Z");
  assert.strictEqual(pub.cairoTime("2026-09-28T14:00:50.000Z"), Date.parse("2026-09-28T14:00:50.000Z"));
  assert(Number.isNaN(pub.cairoTime(null)));
  // المتبقي الفعلي لا يثق بالحقل وحده
  assert.strictEqual(pub.effectiveRemaining({ officialTotalUsd: 220000, paidUsd: 55000, remainingUsd: 0 }), 165000);
  assert.strictEqual(pub.effectiveRemaining({ officialTotalUsd: 100, paidUsd: 100, remainingUsd: 0 }), 0);
  assert(pub.publishProblems(ready({ stage: "paid", officialTotalUsd: 220000, paidUsd: 55000, remainingUsd: 0 }), P()).some((x) => x.includes("أقساط متبقية")));
  assert(pub.publishProblems(ready({ remainingUsd: null }), P()).some((x) => x.includes("الأقساط المتبقية مطلوبة")));
  assert(pub.publishProblems(ready({ usdEgp: 0.02 }), P()).some((x) => x.includes("سعر التحويل")));
  assert(pub.publishProblems(ready({ feesPct: 40 }), P()).some((x) => x.includes("المصروفات")));
  // المرحلة 11: «مباعة» مقبولة مثل «محجوزة»، ووقت رصد مفقود = غير حديث
  const m = (o) => ({ zoneId: 3625, zoneName: "Q", citySlug: "new-cairo", plotNumber: "112", status: "reserved", statusSince: null, basePpm: 490, total: 220500, checkedAt: new Date().toISOString(), dataAt: cairoNow(), k: 5, ...o });
  const l11 = ready({ phase: 11, stage: "installments" });
  assert.deepStrictEqual(pub.publishProblems(l11, P({ platform: m({ status: "sold" }), authorityTransferConfirmed: true })), []);
  assert(pub.publishProblems(l11, P({ platform: m({ dataAt: null }), authorityTransferConfirmed: true })).some((x) => x.includes("أعد مطابقة")));
  assert(pub.publishProblems(l11, P({ platform: m({ dataAt: cairoNow(8 * DAY) }), authorityTransferConfirmed: true })).some((x) => x.includes("أعد مطابقة")));
  assert(pub.publishProblems(l11, P({ platform: m({ k: undefined }), authorityTransferConfirmed: true })).some((x) => x.includes("موافقة البائع")));
  assert.strictEqual(pub.isTaken("sold"), true);
  assert.strictEqual(pub.isTaken("missing"), false);
  // k يستبعد المتاح، وفحص شكل البيانات
  const h = lp.findPlot(payload, 3625, "112");
  assert(h.snapshotAt && h.lastSeen);
  const onlyAvail = { ...payload, rows: payload.rows.map((r) => r.slice()) };
  const ist = payload.columns.indexOf("status");
  onlyAvail.rows.forEach((r) => { if (!(r[0] === 3625 && r[1] === "112")) r[ist] = "available"; });
  assert.strictEqual(lp.anonymityK(onlyAvail, h), 1);
  assert.strictEqual(lp.payloadLooksHealthy(payload, [3625]), false); // الفكسشر أقل من 1000 صف
  const big = { ...payload, rows: Array.from({ length: 1000 }, () => payload.rows[0]) };
  assert.strictEqual(lp.payloadLooksHealthy(big, [3625]), true);
  assert.strictEqual(lp.payloadLooksHealthy(big, [999999]), false);
  assert.strictEqual(lp.payloadLooksHealthy({ ...big, columns: big.columns.map((c) => (c === "plot_number" ? "plot_no" : c)) }, [3625]), false);
  // الأرقام كما يكتبها الناس
  assert.strictEqual(cities.parseNumber("5،000،000"), 5000000);
  assert.strictEqual(cities.parseNumber("5.000.000"), 5000000);
  assert.strictEqual(cities.parseNumber("٥٫٠٠٠٫٠٠٠"), 5000000);
  assert.strictEqual(cities.parseNumber("3 مليون"), 3000000);
  assert.strictEqual(cities.parseNumber("2.5 مليون"), 2500000);
  assert.strictEqual(cities.parseNumber("450 م"), 450);
  assert.strictEqual(cities.parseNumber("450م2"), 450);
  assert.strictEqual(cities.parseNumber("450.5"), 450.5);
  assert.strictEqual(cities.parseNumber("كتير"), null);
});
