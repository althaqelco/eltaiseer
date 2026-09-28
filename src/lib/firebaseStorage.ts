// lib/firebaseStorage.ts
// Firebase Storage — لرفع الصور من لوحة التحكم فقط. الصفحات العامة تعرض الصور عبر /_next/image.

import { getStorage } from "firebase/storage";
import app from "./firebase";

export const storage = getStorage(app);
