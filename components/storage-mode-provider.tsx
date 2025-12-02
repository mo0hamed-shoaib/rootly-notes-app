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
  clearPreviouslyAuthenticated,
} from "@/lib/storage-mode";
import { seedLocalStorageData } from "@/lib/data/seed-data";
import { migrateLocalStorageToSupabase } from "@/lib/data/migration";
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

  const handleMigrate = async () => {
    try {
      const result = await migrateLocalStorageToSupabase();
      if (result.success) {
        const newMode = await getStorageMode();
        setMode(newMode);
        // Clear dismissal state so user sees success
        if (typeof window !== "undefined") {
          localStorage.removeItem("rootly_local_storage_warning_dismissed");
        }
        // Show success message
        const { toast } = await import("sonner");
        toast.success("Data migrated successfully", {
          description: "Your local data has been synced to your account.",
        });
        // Reload to refresh data from Supabase
        window.location.reload();
      } else {
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
    }
  };

  useEffect(() => {
    async function initialize() {
      try {
        // Check authentication status - no artificial delays
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        // Determine storage mode based on auth status
        const currentMode: StorageMode =
          user && !userError ? "supabase" : "localStorage";
        setMode(currentMode);

        // Seed localStorage if user is not authenticated and storage not initialized
        if (currentMode === "localStorage") {
          // If not authenticated now, clear the previously authenticated flag
          if (wasPreviouslyAuthenticated()) {
            clearPreviouslyAuthenticated();
          }

          // Seed if storage is not initialized
          if (!isStorageInitialized()) {
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
        // Mark that user is now authenticated
        markPreviouslyAuthenticated();

        // Update mode immediately - data already seeded server-side
        setMode("supabase");
      } else if (event === "SIGNED_OUT") {
        // Clear the previously authenticated flag
        clearPreviouslyAuthenticated();

        // Update mode to localStorage
        setMode("localStorage");

        // Re-seed localStorage for logged-out user
        if (!isStorageInitialized()) {
          await seedLocalStorageData();
        }
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
