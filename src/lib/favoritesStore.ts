// lib/favoritesStore.ts
// Favorites Store - Client-side state management for favorite properties

const STORAGE_KEY = "eltaiseer_favorites";

// Get favorites from localStorage
export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading favorites from localStorage:", error);
  }
  
  return [];
}

// Save favorites to localStorage
function saveToStorage(favorites: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error("Error saving favorites to localStorage:", error);
  }
}

// Check if a property is in favorites
export function isFavorite(propertyId: string): boolean {
  return getFavorites().includes(propertyId);
}

// Add property to favorites
export function addToFavorites(propertyId: string): void {
  const favorites = getFavorites();
  if (!favorites.includes(propertyId)) {
    favorites.push(propertyId);
    saveToStorage(favorites);
  }
}

// Remove property from favorites
export function removeFromFavorites(propertyId: string): void {
  const favorites = getFavorites();
  const index = favorites.indexOf(propertyId);
  if (index > -1) {
    favorites.splice(index, 1);
    saveToStorage(favorites);
  }
}

// Toggle favorite status
export function toggleFavorite(propertyId: string): boolean {
  if (isFavorite(propertyId)) {
    removeFromFavorites(propertyId);
    return false;
  } else {
    addToFavorites(propertyId);
    return true;
  }
}

// Get count of favorites
export function getFavoritesCount(): number {
  return getFavorites().length;
}

// Clear all favorites
export function clearFavorites(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
