"use server";

/**
 * Server Actions for seeding data
 */

import { createClient } from "@/lib/supabase/server";
import { seedCourses, seedNotes, getSeedDailyEntries } from "./seed-data";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Seed data for an authenticated Supabase client
 * Used by OAuth callback route - accepts the already-authenticated client
 */
export async function seedSupabaseData(
  supabase: SupabaseClient
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if user already has data
    const { data: existingCourses } = await supabase
      .from("courses")
      .select("id")
      .limit(1);
    if (existingCourses && existingCourses.length > 0) {
      return { success: true }; // Already has data
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    // Seed courses
    const { data: courses, error: coursesError } = await supabase
      .from("courses")
      .insert(seedCourses)
      .select();

    if (coursesError || !courses || courses.length === 0) {
      console.error("Error seeding courses:", coursesError);
      return {
        success: false,
        error: coursesError?.message || "Failed to seed courses",
      };
    }

    // Seed notes for both courses
    if (courses.length >= 2) {
      const notes = seedNotes(courses[0].id, courses[1].id);
      const { error: notesError } = await supabase.from("notes").insert(notes);

      if (notesError) {
        console.error("Error seeding notes:", notesError);
        // Don't fail completely, just log the error
      }
    } else if (courses.length > 0) {
      // Fallback if only one course exists
      const notes = seedNotes(courses[0].id, courses[0].id);
      const { error: notesError } = await supabase.from("notes").insert(notes);

      if (notesError) {
        console.error("Error seeding notes:", notesError);
      }
    }

    // Seed daily entries
    const { error: entriesError } = await supabase
      .from("daily_entries")
      .insert(getSeedDailyEntries());

    if (entriesError) {
      console.error("Error seeding daily entries:", entriesError);
      // Don't fail completely, just log the error
    }

    return { success: true };
  } catch (error) {
    console.error("Error in seedSupabaseData:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Seed data for Supabase (authenticated users)
 * This is a server action that can be called from client components
 */
export async function seedSupabaseDataAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await createClient();
  return seedSupabaseData(supabase);
}
