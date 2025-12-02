"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { StorageMode } from "@/lib/storage-mode";
import {
  getStorageMode,
  isStorageInitialized,
  wasPreviouslyAuthenticated,
  markPreviouslyAuthenticated,
} from "@/lib/storage-mode";
import { seedLocalStorageData } from "@/lib/data/seed-data";
import { migrateLocalStorageToSupabase } from "@/lib/data/migration";
import { getAllData } from "@/lib/data/local-storage";
import { supabase } from "@/lib/supabase/client";

interface StorageModeContextType {
  mode: StorageMode | null;
  isLoading: boolean;
  migrate: () => Promise<void>;
}

const StorageModeContext = createContext<StorageModeContextType | undefined>(
  undefined
);

export function StorageModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<StorageMode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [migrationInProgress, setMigrationInProgress] = useState(false);

  const handleMigrate = async () => {
    setMigrationInProgress(true);
    try {
      const result = await migrateLocalStorageToSupabase();
      if (result.success) {
        const newMode = await getStorageMode();
        setMode(newMode);
        // Clear dismissal state so user sees success
        if (typeof window !== "undefined") {
          localStorage.removeItem("rootly_local_storage_warning_dismissed");
        }
        // Reload to refresh data
        window.location.reload();
      } else {
        // Show error toast
        const { toast } = await import("sonner");
        toast.error("Migration failed", {
          description: result.error || "Please try again.",
        });
      }
    } catch (error) {
      const { toast } = await import("sonner");
      toast.error("Migration error", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setMigrationInProgress(false);
    }
  };

  useEffect(() => {
    async function initialize() {
      try {
        // Reduced delay for faster loading while still allowing session to be established
        // React 19 best practice: minimize blocking operations
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Check authentication status directly first
        const { supabase } = await import("@/lib/supabase/client");
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        let currentMode: StorageMode;

        // If we have a user and no error, we're authenticated
        if (user && !userError) {
          currentMode = "supabase";
        } else {
          // Not authenticated, check storage mode (will default to localStorage)
          currentMode = await getStorageMode();
        }

        setMode(currentMode);

        // Only seed localStorage - Supabase will get data via migration when user logs in
        // BUT: Don't seed if user was previously authenticated AND is currently authenticated
        // (if they logged out, they should get fresh data)
        if (currentMode === "localStorage") {
          // Check if user is currently authenticated - if not, clear the flag and allow seeding
          const { supabase } = await import("@/lib/supabase/client");
          const {
            data: { user },
          } = await supabase.auth.getUser();

          // If not authenticated now, clear the previously authenticated flag
          if (!user && wasPreviouslyAuthenticated()) {
            const { clearPreviouslyAuthenticated } = await import(
              "@/lib/storage-mode"
            );
            clearPreviouslyAuthenticated();
          }

          // Seed if storage is not initialized and user is not currently authenticated
          if (!isStorageInitialized() && !user) {
            await seedLocalStorageData();
          }
        }
      } catch (error) {
        console.error("Error initializing storage mode:", error);
        // On error, default to localStorage
        setMode("localStorage");
      } finally {
        setIsLoading(false);
      }
    }

    initialize();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Mark that user is now authenticated (for future reference)
        markPreviouslyAuthenticated();

        // Wait longer to ensure session is fully established and cookies are set
        // This is critical after OAuth redirect
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Verify session is actually established by checking getUser()
        let user = null;
        let attempts = 0;
        while (attempts < 5 && !user) {
          const {
            data: { user: currentUser },
            error,
          } = await supabase.auth.getUser();
          if (currentUser && !error) {
            user = currentUser;
            break;
          }
          attempts++;
          if (attempts < 5) {
            await new Promise((resolve) => setTimeout(resolve, 200));
          }
        }

        if (!user) {
          console.error("Failed to get user after SIGNED_IN event");
          return;
        }

        // Force set mode to supabase IMMEDIATELY so hooks start fetching from Supabase
        setMode("supabase");

        // Always call migration - it will handle all cases:
        // 1. User has existing Supabase data -> skip migration, clear localStorage
        // 2. User has localStorage data -> migrate it
        // 3. User has no data -> seed demo data
        const result = await migrateLocalStorageToSupabase();

        if (result.success) {
          const { toast } = await import("sonner");
          // Check migration result and show appropriate message
          if (result.skipped) {
            // Migration was skipped because user already has data
            toast.info("Using your saved data", {
              description: "Your account data has been restored.",
            });
          } else if (result.seeded) {
            // Demo data was seeded for first-time user
            toast.success("Welcome to Rootly!", {
              description: "Demo data has been added to help you get started.",
            });
          } else {
            // Migration successful - localStorage data was migrated
            toast.success("Data migrated successfully", {
              description: "Your local data has been synced to your account.",
            });
          }
        } else {
          const { toast } = await import("sonner");
          toast.error("Migration failed", {
            description: result.error || "Please try again later.",
          });
        }

        // Clear dismissal state
        if (typeof window !== "undefined") {
          localStorage.removeItem("rootly_local_storage_warning_dismissed");
        }

        // Reload after a short delay to ensure all hooks pick up the new mode
        // and fetch from Supabase instead of localStorage
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else if (event === "SIGNED_OUT") {
        // Clear the previously authenticated flag when user signs out
        const { clearPreviouslyAuthenticated } = await import(
          "@/lib/storage-mode"
        );
        clearPreviouslyAuthenticated();

        const newMode = await getStorageMode();
        setMode(newMode);

        // Reload page to show logged-out state and re-seed localStorage
        // This ensures a clean state transition
        setTimeout(() => {
          window.location.reload();
        }, 300);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <StorageModeContext.Provider
      value={{ mode, isLoading, migrate: handleMigrate }}
    >
      {children}
    </StorageModeContext.Provider>
  );
}

export function useStorageMode() {
  const context = useContext(StorageModeContext);
  if (context === undefined) {
    throw new Error("useStorageMode must be used within a StorageModeProvider");
  }
  return context;
}
