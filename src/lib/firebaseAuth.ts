// lib/firebaseAuth.ts
// Firebase Auth — يُستورد فقط من صفحات تسجيل الدخول ولوحة التحكم (أو بـ import() عند الحاجة)،
// فلا تحمّل الصفحات العامة حزمة Auth ولا iframe الخاص بها.

import { getAuth } from "firebase/auth";
import app from "./firebase";

export const auth = getAuth(app);
