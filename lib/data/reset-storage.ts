/**
 * Utility to reset/clear localStorage data
 * Useful for development and testing
 */

const STORAGE_KEYS = {
  courses: "rootly_courses",
  notes: "rootly_notes",
  dailyEntries: "rootly_daily_entries",
} as const

const STORAGE_MODE_KEY = "rootly_storage_mode"
const STORAGE_INITIALIZED_KEY = "rootly_storage_initialized"

/**
 * Clear all localStorage data (courses, notes, daily entries, and initialization flags)
 * This will allow the app to re-seed with fresh data on next load
 */
export function clearAllLocalStorage(): void {
  if (typeof window === "undefined") return

  // Clear all data
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key)
  })

  // Clear initialization flag so data will be re-seeded
  localStorage.removeItem(STORAGE_INITIALIZED_KEY)

  // Optionally clear storage mode preference (comment out if you want to keep it)
  // localStorage.removeItem(STORAGE_MODE_KEY)

  console.log("LocalStorage cleared. Refresh the page to see new seed data.")
}

/**
 * Clear only the data but keep the initialization flag
 * This prevents re-seeding
 */
export function clearLocalStorageData(): void {
  if (typeof window === "undefined") return

  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key)
  })

  console.log("LocalStorage data cleared.")
}

