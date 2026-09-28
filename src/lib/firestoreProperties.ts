// lib/firestoreProperties.ts
// Firestore service for properties - real database storage

import { db, ADMIN_UID } from "./firebase";
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  serverTimestamp,
  DocumentData
} from "firebase/firestore";
import { Property } from "./mockData";

// Check if user is authenticated as admin
// Auth يُحمَّل عند الحاجة فقط (دوال الكتابة تُستدعى من لوحة التحكم حيث هيّأه AuthProvider مسبقًا)،
// حتى لا تجرّ قراءة العقارات في الصفحات العامة حزمة firebase/auth معها.
async function isAdminAuthenticated(): Promise<boolean> {
  const { auth } = await import("./firebaseAuth");
  const user = auth.currentUser;
  return user !== null && user.uid === ADMIN_UID;
}

// Get detailed error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Firebase permission errors
    if (error.message.includes('permission-denied') || error.message.includes('PERMISSION_DENIED')) {
      return 'ليس لديك صلاحية لإجراء هذه العملية. تأكد من تسجيل الدخول كمسؤول.';
    }
    // Network errors
    if (error.message.includes('network') || error.message.includes('offline')) {
      return 'خطأ في الاتصال بالإنترنت. تأكد من اتصالك بالشبكة.';
    }
    // Document not found
    if (error.message.includes('not-found')) {
      return 'العقار غير موجود.';
    }
    return error.message;
  }
  return 'حدث خطأ غير متوقع';
}

const COLLECTION_NAME = "properties";

// Generate short unique ID (8 characters)
// Format: 2 chars from timestamp + 6 random alphanumeric
function generateShortId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars: 0,O,1,I,L
  const timestamp = Date.now().toString(36).slice(-2).toUpperCase(); // Last 2 chars of base36 timestamp
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return timestamp + randomPart;
}

// Remove undefined values from object recursively (Firestore doesn't accept undefined)
function removeUndefined<T extends Record<string, unknown>>(obj: T): T {
  const result: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) {
      continue; // Skip undefined values
    }
    if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date) && !(value instanceof Timestamp)) {
      // Recursively clean nested objects
      result[key] = removeUndefined(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }
  
  return result as T;
}

// Timestamp أو نص تاريخ → Date، وأي قيمة غير صالحة → undefined
function toOptionalDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  const maybeTs = value as { toDate?: () => Date };
  if (typeof maybeTs.toDate === "function") return maybeTs.toDate();
  const d = new Date(value as string);
  return isNaN(d.getTime()) ? undefined : d;
}

// Convert Firestore document to Property
function docToProperty(docData: DocumentData, id: string): Property {
  return {
    ...docData,
    id,
    createdAt: docData.createdAt?.toDate?.() || new Date(docData.createdAt),
    updatedAt: toOptionalDate(docData.updatedAt),
  } as Property;
}

// Convert Property to Firestore document
function propertyToDoc(property: Omit<Property, "id" | "createdAt">) {
  // Clean undefined values before sending to Firestore
  const cleanedProperty = removeUndefined(property as Record<string, unknown>);
  return {
    ...cleanedProperty,
    createdAt: Timestamp.now(),
    updatedAt: serverTimestamp(),
  };
}

// كل العقارات مع رمي الخطأ عند فشل الاتصال — للخادم الذي يحتاج التمييز بين "لا عقارات" و"فشل الجلب"
// (قاعدة noindex للقوائم الفارغة وsitemap.xml لا تُطبق على نتيجة جلب فاشل)
export async function fetchAllPropertiesStrict(): Promise<Property[]> {
  const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

  const properties: Property[] = [];
  querySnapshot.forEach((doc) => {
    properties.push(docToProperty(doc.data(), doc.id));
  });

  return properties;
}

// Get all properties from Firestore
export async function getPropertiesFromFirestore(): Promise<Property[]> {
  try {
    return await fetchAllPropertiesStrict();
  } catch (error) {
    console.error("Error fetching properties from Firestore:", error);
    return [];
  }
}

// عقار واحد: null إن لم يوجد، ويرمي الخطأ عند فشل الاتصال
// (صفحة العقار تعيد 404 للمحذوف فقط، لا لخطأ شبكة مؤقت يُسقط إعلاناً حقيقياً من الفهرس)
export async function fetchPropertyStrict(id: string): Promise<Property | null> {
  const docSnap = await getDoc(doc(db, COLLECTION_NAME, id));
  return docSnap.exists() ? docToProperty(docSnap.data(), docSnap.id) : null;
}

// Get single property by ID
export async function getPropertyFromFirestore(id: string): Promise<Property | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docToProperty(docSnap.data(), docSnap.id);
    }
    return null;
  } catch (error) {
    console.error("Error fetching property from Firestore:", error);
    return null;
  }
}

// Add new property to Firestore
export async function addPropertyToFirestore(
  property: Omit<Property, "id" | "createdAt">
): Promise<{ success: boolean; property?: Property; error?: string }> {
  try {
    // Check admin authentication
    if (!(await isAdminAuthenticated())) {
      return { 
        success: false, 
        error: 'يجب تسجيل الدخول كمسؤول لإضافة عقار جديد' 
      };
    }

    const customId = generateShortId();
    const docRef = doc(db, COLLECTION_NAME, customId);
    await setDoc(docRef, propertyToDoc(property));
    
    // Return the created property with ID
    const newProperty = {
      ...property,
      id: customId,
      createdAt: new Date(),
    } as Property;
    
    return { success: true, property: newProperty };
  } catch (error) {
    console.error("Error adding property to Firestore:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

// Update property in Firestore
export async function updatePropertyInFirestore(
  id: string, 
  updates: Partial<Property>
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check admin authentication
    if (!(await isAdminAuthenticated())) {
      return { 
        success: false, 
        error: 'يجب تسجيل الدخول كمسؤول لتعديل العقار' 
      };
    }

    const docRef = doc(db, COLLECTION_NAME, id);
    
    // Remove id, createdAt and updatedAt from updates (updatedAt يُكتب بوقت الخادم أدناه)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...updateData } = updates;
    
    // Clean undefined values before sending to Firestore
    const cleanedData = removeUndefined(updateData as Record<string, unknown>);
    
    // updatedAt يحرك lastmod الإعلان في sitemap.xml عند تعديل السعر أو الحالة
    await updateDoc(docRef, { ...cleanedData, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (error) {
    console.error("Error updating property in Firestore:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

// Delete property from Firestore
export async function deletePropertyFromFirestore(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Check admin authentication
    if (!(await isAdminAuthenticated())) {
      return { 
        success: false, 
        error: 'يجب تسجيل الدخول كمسؤول لحذف العقار' 
      };
    }

    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting property from Firestore:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

// Check if Firestore has any properties
export async function hasPropertiesInFirestore(): Promise<boolean> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking Firestore properties:", error);
    return false;
  }
}
