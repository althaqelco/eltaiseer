// lib/bw/types.ts
// قسم بيع وشراء أراضي «بيت الوطن» (وساطة موثّقة).
// الإعلان العام (bw_listings) بلا أي بيانات شخصية ولا رقم القطعة؛ ملف البائع (bw_private) للإدارة وحدها.

export type BwStatus = "draft" | "active" | "sold" | "expired" | "withdrawn";

// «المخصصة وعليها أقساط» مسموحة بالشروط، لكنها لا تُنشر في مدينة إلا بعد رد الجهاز كتابيًا
// (المستحقات حتى تاريخه أم السداد الكامل) — لوحة التحكم تنبه لذلك قبل النشر.
export type BwStage = "paid" | "received" | "built" | "installments";

export const STAGE_LABEL: Record<BwStage, string> = {
  paid: "مخصصة ومسددة بالكامل",
  received: "مستلمة",
  built: "مبنية",
  installments: "مخصصة وعليها أقساط",
};

export type BwCheck =
  | "identity"
  | "allocation"
  | "receipts"
  | "portal"
  | "authority"
  | "poa"
  | "site"
  | "contract";

export const CHECK_LABEL: Record<BwCheck, string> = {
  identity: "هوية البائع مطابقة لخطاب التخصيص أو العقد",
  allocation: "خطاب التخصيص أو محضر الاستلام",
  receipts: "إيصالات السداد",
  portal: "حساب البائع على بوابة الهيئة في مكالمة فيديو",
  authority: "إفادة جهاز المدينة بعدم وجود مخالفات أو مديونية",
  poa: "إقرار كتابي بعدم وجود توكيل لغير المشتري",
  site: "معاينة الموقع بصور فريق التيسير",
  contract: "عقد وساطة موقّع مع البائع",
};

export const CHECK_ORDER: BwCheck[] = [
  "identity", "allocation", "receipts", "portal", "authority", "poa", "site", "contract",
];

// إفادة الجهاز «إن أمكن الحصول عليها»؛ الباقي شرط للنشر
export const REQUIRED_CHECKS: BwCheck[] = [
  "identity", "allocation", "receipts", "portal", "poa", "site", "contract",
];

export const REVERIFY_DAYS = 45; // بعدها ينتهي الإعلان تلقائيًا ما لم يُعاد توثيقه
export const SOLD_VISIBLE_DAYS = 30; // صفحة «بيعت» تبقى ثم تُحوَّل لصفحة المدينة
export const MARKET_WINDOW_DAYS = 90; // نقاط سعر السوق الأحدث من ذلك فقط
export const MIN_POINTS = 3; // لا رقم مجمّع من أقل من 3 إعلانات أو طلبات

export interface BwListing {
  id: string;
  status: BwStatus;
  citySlug: string;
  district: string;
  districtSlug: string;
  phase: number | null;
  stage: BwStage;
  area: number;
  corner: boolean;
  garden: boolean;
  sea: boolean;
  officialTotalUsd: number | null; // السعر الرسمي الإجمالي من العقد أو خطاب التخصيص
  paidUsd: number | null; // المسدد حتى تاريخه
  remainingUsd: number | null; // الأقساط المتبقية على المشتري
  premiumEgp: number; // الأوفر المطلوب بالجنيه
  usdEgp: number; // سعر التحويل المستخدم في الحساب
  usdEgpDate: string; // YYYY-MM-DD
  feesPct: number; // مصروفات إدارية تقديرية (% من السعر الرسمي)، تُؤكَّد من الجهاز
  summary: string;
  photos: string[];
  checks: BwCheck[];
  verifiedAt: string; // YYYY-MM-DD
  platformMatched: boolean; // طابقنا القطعة مع سجل رصد منصة الحجز (المراحل التي نرصدها)
  // القطع المطابَقة مع الرصد الحي (العام) تُنشر مساحتها لأقرب 10 م² وأسعارها لأقرب 5 آلاف دولار، حتى لا يُستنتج رقمها
  // بمقارنة الإعلان ببيانات /api/plots العامة؛ الأرقام الدقيقة في bw_private.exact
  approx: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  soldAt: string | null; // ISO
}

export interface BwPlatformMatch {
  zoneId: number;
  zoneName: string;
  citySlug: string;
  plotNumber: string;
  status: string;
  statusSince: string | null;
  basePpm: number | null;
  total: number | null;
  checkedAt: string; // وقت المطابقة (ISO)
  dataAt: string | null; // وقت لقطة المنصة نفسها (generated_at بتوقيت القاهرة) — الحداثة تُقاس بالأقدم منهما
  k: number; // عدد القطع في نفس المنطقة بنفس الأرقام العامة بعد التقريب (انظر anonymityK)
}

export interface BwPrivate {
  listingId: string;
  sellerName: string;
  sellerPhone: string;
  plotNumber: string;
  zone: string; // المنطقة/القطاع كما في خطاب التخصيص
  plotHash: string; // بصمة المدينة+المنطقة+القطعة لمنع تكرار القطعة في أكثر من إعلان
  commissionPct: number | null;
  contractSignedAt: string;
  exclusiveUntil: string;
  notes: string;
  // للقطع التي عليها أقساط: أكد جهاز المدينة كتابيًا شروط التنازل (المستحقات حتى تاريخه أم السداد الكامل)
  authorityTransferConfirmed: boolean;
  // القطعة مميزة في البيانات العامة (k < 3): لا تُنشر إلا بموافقة البائع المكتوبة على احتمال معرفة رقمها من الإعلان
  identifiableConsent: boolean;
  platform: BwPlatformMatch | null;
  exact: { area: number; officialTotalUsd: number | null; paidUsd: number | null; remainingUsd: number | null } | null;
}

export type BwRequestKind = "buy" | "sell";
export type BwRequestPhase = "old" | "11" | "any";
export type BwRequestStatus = "new" | "contacted" | "matched" | "closed" | "spam";

export interface BwRequest {
  id: string;
  kind: BwRequestKind;
  name: string;
  phone: string;
  citySlug: string;
  district: string;
  phase: BwRequestPhase;
  area: number | null;
  budgetEgp: number | null;
  notes: string;
  status: BwRequestStatus;
  createdAt: string; // ISO
}

export const REQUEST_STATUS_LABEL: Record<BwRequestStatus, string> = {
  new: "جديد",
  contacted: "تم التواصل",
  matched: "تمت المطابقة",
  closed: "مغلق",
  spam: "مزعج",
};

// عدادات الطلب المعلنة (قراءة عامة): تُحسب من لوحة التحكم من الطلبات الصالحة فقط
export interface BwDemand {
  citySlug: string;
  total: number;
  phase11: number; // طلبات تقبل المرحلة 11 (المرحلة 11 أو أي مرحلة)
  districts: Record<string, number>;
  updatedAt: string;
}
