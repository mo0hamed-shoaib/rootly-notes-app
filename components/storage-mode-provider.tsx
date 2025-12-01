"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import type { StorageMode } from "@/lib/storage-mode"
import { getStorageMode, isStorageInitialized, wasPreviouslyAuthenticated, markPreviouslyAuthenticated } from "@/lib/storage-mode"
import { seedLocalStorageData } from "@/lib/data/seed-data"
import { migrateLocalStorageToSupabase } from "@/lib/data/migration"
import { getAllData } from "@/lib/data/local-storage"
import { supabase } from "@/lib/supabase/client"

interface StorageModeContextType {
  mode: StorageMode | null
  isLoading: boolean
  migrate: () => Promise<void>
}

const StorageModeContext = createContext<StorageModeContextType | undefined>(undefined)

export function StorageModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<StorageMode | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [migrationInProgress, setMigrationInProgress] = useState(false)

  const handleMigrate = async () => {
    setMigrationInProgress(true)
    try {
      const result = await migrateLocalStorageToSupabase()
      if (result.success) {
        const newMode = await getStorageMode()
        setMode(newMode)
        // Clear dismissal state so user sees success
        if (typeof window !== "undefined") {
          localStorage.removeItem("rootly_local_storage_warning_dismissed")
        }
        // Reload to refresh data
        window.location.reload()
      } else {
        // Show error toast
        const { toast } = await import("sonner")
        toast.error("Migration failed", {
          description: result.error || "Please try again.",
        })
      }
    } catch (error) {
      const { toast } = await import("sonner")
      toast.error("Migration error", {
        description: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setMigrationInProgress(false)
    }
  }

  useEffect(() => {
    async function initialize() {
      // Add a delay to ensure session cookies are available after OAuth redirect
      // This helps with the race condition where session might not be immediately available
      await new Promise((resolve) => setTimeout(resolve, 300))
      
      // Check authentication status directly first
      const { supabase } = await import("@/lib/supabase/client")
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      let currentMode: StorageMode
      
      // If we have a user and no error, we're authenticated
      if (user && !userError) {
        currentMode = "supabase"
      } else {
        // Not authenticated, check storage mode (will default to localStorage)
        currentMode = await getStorageMode()
      }
      
      setMode(currentMode)

      // Only seed localStorage - Supabase will get data via migration when user logs in
      // BUT: Don't seed if user was previously authenticated (they had Supabase data before)
      if (currentMode === "localStorage") {
        if (!isStorageInitialized() && !wasPreviouslyAuthenticated()) {
          await seedLocalStorageData()
        }
      }

      setIsLoading(false)
    }

    initialize()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Mark that user is now authenticated (for future reference)
        markPreviouslyAuthenticated()
        
        // Wait longer to ensure session is fully established and cookies are set
        // This is critical after OAuth redirect
        await new Promise((resolve) => setTimeout(resolve, 800))
        
        // Verify session is actually established by checking getUser()
        let user = null
        let attempts = 0
        while (attempts < 5 && !user) {
          const { data: { user: currentUser }, error } = await supabase.auth.getUser()
          if (currentUser && !error) {
            user = currentUser
            break
          }
          attempts++
          if (attempts < 5) {
            await new Promise((resolve) => setTimeout(resolve, 200))
          }
        }
        
        if (!user) {
          console.error("Failed to get user after SIGNED_IN event")
          return
        }
        
        // User just signed in - automatically migrate localStorage data if it exists
        const localData = getAllData()
        const hasLocalData = localData.courses.length > 0 || localData.notes.length > 0 || localData.dailyEntries.length > 0
        
        if (hasLocalData) {
          // Automatically migrate localStorage data to Supabase
          const result = await migrateLocalStorageToSupabase()
          if (result.success) {
            // Check if migration was skipped (user already had Supabase data)
            if (result.skipped) {
              // Migration was skipped because user already has data - just clear localStorage
              const { toast } = await import("sonner")
              toast.info("Using your saved data", {
                description: "Your account data has been restored. Local data was cleared.",
              })
            } else {
              const { toast } = await import("sonner")
              toast.success("Data migrated successfully", {
                description: "Your local data has been synced to your account.",
              })
            }
          } else {
            const { toast } = await import("sonner")
            toast.error("Migration failed", {
              description: result.error || "Please try again later.",
            })
          }
        }
        
        // Clear dismissal state
        if (typeof window !== "undefined") {
          localStorage.removeItem("rootly_local_storage_warning_dismissed")
        }
        
        // Force set mode to supabase
        // The hooks will automatically re-fetch when mode changes
        setMode("supabase")
        
        // Wait longer to ensure session cookies are fully available before reload
        // This is critical - if we reload too early, cookies might not be available
        // and we'll be stuck in localStorage mode
        setTimeout(async () => {
          // Double-check session is still valid before reloading
          const { data: { user: verifyUser } } = await supabase.auth.getUser()
          if (verifyUser) {
            window.location.reload()
          } else {
            // If session is lost, try one more time after a delay
            setTimeout(() => {
              window.location.reload()
            }, 500)
          }
        }, 1000)
      } else if (event === "SIGNED_OUT") {
        const newMode = await getStorageMode()
        setMode(newMode)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <StorageModeContext.Provider value={{ mode, isLoading, migrate: handleMigrate }}>
      {children}
    </StorageModeContext.Provider>
  )
}

export function useStorageMode() {
  const context = useContext(StorageModeContext)
  if (context === undefined) {
    throw new Error("useStorageMode must be used within a StorageModeProvider")
  }
  return context
}

