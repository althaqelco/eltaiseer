// lib/firestoreProperties.ts
// Firestore service for properties - real database storage

import { db, auth, ADMIN_UID } from "./firebase";
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  DocumentData
} from "firebase/firestore";
import { Property } from "./mockData";

// Check if user is authenticated as admin
function isAdminAuthenticated(): boolean {
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

// Convert Firestore document to Property
function docToProperty(docData: DocumentData, id: string): Property {
  return {
    ...docData,
    id,
    createdAt: docData.createdAt?.toDate?.() || new Date(docData.createdAt),
  } as Property;
}

// Convert Property to Firestore document
function propertyToDoc(property: Omit<Property, "id" | "createdAt">) {
  // Clean undefined values before sending to Firestore
  const cleanedProperty = removeUndefined(property as Record<string, unknown>);
  return {
    ...cleanedProperty,
    createdAt: Timestamp.now(),
  };
}

// Get all properties from Firestore
export async function getPropertiesFromFirestore(): Promise<Property[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const properties: Property[] = [];
    querySnapshot.forEach((doc) => {
      properties.push(docToProperty(doc.data(), doc.id));
    });
    
    return properties;
  } catch (error) {
    console.error("Error fetching properties from Firestore:", error);
    return [];
  }
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
    if (!isAdminAuthenticated()) {
      return { 
        success: false, 
        error: 'يجب تسجيل الدخول كمسؤول لإضافة عقار جديد' 
      };
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), propertyToDoc(property));
    
    // Return the created property with ID
    const newProperty = {
      ...property,
      id: docRef.id,
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
    if (!isAdminAuthenticated()) {
      return { 
        success: false, 
        error: 'يجب تسجيل الدخول كمسؤول لتعديل العقار' 
      };
    }

    const docRef = doc(db, COLLECTION_NAME, id);
    
    // Remove id and createdAt from updates
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, createdAt: _createdAt, ...updateData } = updates;
    
    // Clean undefined values before sending to Firestore
    const cleanedData = removeUndefined(updateData as Record<string, unknown>);
    
    await updateDoc(docRef, cleanedData);
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
    if (!isAdminAuthenticated()) {
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
