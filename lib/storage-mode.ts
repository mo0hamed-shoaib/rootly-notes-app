/**
 * Storage mode detection and management
 */

export type StorageMode = "supabase" | "localStorage"

const STORAGE_MODE_KEY = "rootly_storage_mode"
const STORAGE_INITIALIZED_KEY = "rootly_storage_initialized"
const PREVIOUSLY_AUTHENTICATED_KEY = "rootly_previously_authenticated"

/**
 * Detect if user is authenticated with Supabase
 */
export async function isAuthenticated(): Promise<boolean> {
  if (typeof window === "undefined") {
    // Server-side: check via cookies/headers
    return false
  }

  try {
    const { supabase } = await import("@/lib/supabase/client")
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return !!session
  } catch {
    return false
  }
}

/**
 * Get current storage mode
 */
export async function getStorageMode(): Promise<StorageMode> {
  if (typeof window === "undefined") {
    return "supabase"
  }

  const authenticated = await isAuthenticated()
  if (authenticated) {
    // Clear localStorage mode if user is authenticated
    localStorage.removeItem(STORAGE_MODE_KEY)
    return "supabase"
  }

  // Check if user explicitly chose localStorage
  const storedMode = localStorage.getItem(STORAGE_MODE_KEY)
  if (storedMode === "localStorage") {
    return "localStorage"
  }

  // Default to localStorage for unauthenticated users
  return "localStorage"
}

/**
 * Set storage mode explicitly
 */
export function setStorageMode(mode: StorageMode): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_MODE_KEY, mode)
}

/**
 * Check if storage has been initialized with seed data
 */
export function isStorageInitialized(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(STORAGE_INITIALIZED_KEY) === "true"
}

/**
 * Mark storage as initialized
 */
export function markStorageInitialized(): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_INITIALIZED_KEY, "true")
}

/**
 * Check if user was previously authenticated (to prevent seeding localStorage after logout)
 */
export function wasPreviouslyAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(PREVIOUSLY_AUTHENTICATED_KEY) === "true"
}

/**
 * Mark that user was previously authenticated
 */
export function markPreviouslyAuthenticated(): void {
  if (typeof window === "undefined") return
  localStorage.setItem(PREVIOUSLY_AUTHENTICATED_KEY, "true")
}

/**
 * Clear the previously authenticated flag (when user explicitly wants to start fresh)
 */
export function clearPreviouslyAuthenticated(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(PREVIOUSLY_AUTHENTICATED_KEY)
}

