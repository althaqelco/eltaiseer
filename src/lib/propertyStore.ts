// lib/propertyStore.ts
// Property Store - Client-side state management for properties
// Uses localStorage for persistence across page navigations

import { Property } from "./mockData";
import { MOCK_PROPERTIES } from "./mockData";

const STORAGE_KEY = "eltaiseer_properties";

// Initialize properties from localStorage or mock data
function initializeProperties(): Property[] {
  if (typeof window === "undefined") {
    return [...MOCK_PROPERTIES];
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return parsed.map((p: Property) => ({
        ...p,
        createdAt: new Date(p.createdAt),
      }));
    }
  } catch (error) {
    console.error("Error loading properties from localStorage:", error);
  }
  
  // First time - save mock data to localStorage
  saveToStorage(MOCK_PROPERTIES);
  return [...MOCK_PROPERTIES];
}

// Save properties to localStorage
function saveToStorage(props: Property[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(props));
  } catch (error) {
    console.error("Error saving properties to localStorage:", error);
  }
}

// Get properties (always fresh from storage)
function getProperties(): Property[] {
  return initializeProperties();
}

// Get all properties
export function getAllProperties(): Property[] {
  return getProperties();
}

// Get property by ID
export function getPropertyById(id: string): Property | undefined {
  return getProperties().find((p) => p.id === id);
}

// Add new property
export function addProperty(property: Omit<Property, "id" | "createdAt">): Property {
  const currentProperties = getProperties();
  const newProperty: Property = {
    ...property,
    id: `prop-${String(currentProperties.length + 1).padStart(3, "0")}`,
    createdAt: new Date(),
  };
  const updatedProperties = [newProperty, ...currentProperties];
  saveToStorage(updatedProperties);
  return newProperty;
}

// Update property
export function updateProperty(id: string, updates: Partial<Property>): Property | null {
  const currentProperties = getProperties();
  const index = currentProperties.findIndex((p: Property) => p.id === id);
  if (index === -1) return null;
  
  currentProperties[index] = { ...currentProperties[index], ...updates };
  saveToStorage(currentProperties);
  return currentProperties[index];
}

// Delete property
export function deleteProperty(id: string): boolean {
  const currentProperties = getProperties();
  const index = currentProperties.findIndex((p: Property) => p.id === id);
  if (index === -1) return false;
  
  currentProperties.splice(index, 1);
  saveToStorage(currentProperties);
  return true;
}

// Get properties with pagination
export function getPropertiesPage(
  page: number,
  limit: number,
  filters?: {
    district?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
  }
): { properties: Property[]; total: number; totalPages: number } {
  let filtered = [...getProperties()];

  if (filters?.district) {
    filtered = filtered.filter((p) => p.location.district === filters.district);
  }
  if (filters?.type) {
    filtered = filtered.filter((p) => p.type === filters.type);
  }
  if (filters?.minPrice) {
    filtered = filtered.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters?.maxPrice) {
    filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    properties: filtered.slice(start, end),
    total,
    totalPages,
  };
}

// Get related properties (same district or type)
export function getRelatedProperties(property: Property, limit: number = 4): Property[] {
  return getProperties()
    .filter(
      (p: Property) =>
        p.id !== property.id &&
        (p.location.district === property.location.district || p.type === property.type)
    )
    .slice(0, limit);
}

// Get featured properties (verified ones)
export function getFeaturedProperties(limit: number = 6): Property[] {
  return getProperties().filter((p: Property) => p.isVerified).slice(0, limit);
}

// Get latest properties
export function getLatestProperties(limit: number = 6): Property[] {
  return [...getProperties()]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}

// Generate unique ID
export function generatePropertyId(): string {
  return `prop-${String(getProperties().length + 1).padStart(3, "0")}`;
}

// Clear all data and reset to mock data
export function resetToMockData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
