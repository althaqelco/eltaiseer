// lib/imageUpload.ts
// Image Upload Service for El Taiseer Real Estate

import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// Generate unique filename
function generateFileName(file: File): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = file.name.split('.').pop();
  return `properties/${timestamp}-${randomString}.${extension}`;
}

// Upload single image
export async function uploadImage(file: File): Promise<string> {
  try {
    const fileName = generateFileName(file);
    const storageRef = ref(storage, fileName);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("فشل في رفع الصورة. حاول مرة أخرى.");
  }
}

// Upload multiple images
export async function uploadMultipleImages(files: File[]): Promise<string[]> {
  try {
    const uploadPromises = files.map(file => uploadImage(file));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error("Error uploading multiple images:", error);
    throw new Error("فشل في رفع الصور. حاول مرة أخرى.");
  }
}

// Delete image by URL
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // Extract path from URL
    const baseUrl = "https://firebasestorage.googleapis.com/v0/b/";
    if (imageUrl.includes(baseUrl)) {
      const pathStart = imageUrl.indexOf("/o/") + 3;
      const pathEnd = imageUrl.indexOf("?");
      const encodedPath = imageUrl.substring(pathStart, pathEnd);
      const path = decodeURIComponent(encodedPath);
      
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    // Don't throw - deletion failure shouldn't block other operations
  }
}

// Validate image file
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "نوع الملف غير مدعوم. استخدم JPG, PNG, أو WebP" };
  }
  
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: "حجم الصورة كبير جداً. الحد الأقصى 5 ميجابايت" };
  }
  
  return { valid: true };
}

// Compress image before upload (optional)
export async function compressImage(file: File, maxWidth: number = 1200): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Scale down if wider than maxWidth
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file); // Return original if compression fails
            }
          },
          'image/jpeg',
          0.8 // Quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}
