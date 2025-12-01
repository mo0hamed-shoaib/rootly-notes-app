/**
 * Migration utility to move data from localStorage to Supabase
 */

import { getAllData } from "./local-storage"
import { clearAllData } from "./local-storage"
import type { Course, Note, DailyEntry } from "@/lib/types"

export async function migrateLocalStorageToSupabase(): Promise<{ success: boolean; error?: string; skipped?: boolean }> {
  try {
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()

    // Verify user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return { success: false, error: "User not authenticated" }
    }

    // Check if Supabase already has data - if so, don't migrate localStorage (user already has saved data)
    const { data: existingCourses } = await supabase.from("courses").select("id").limit(1)
    if (existingCourses && existingCourses.length > 0) {
      // User already has data in Supabase - clear localStorage to avoid confusion
      clearAllData()
      localStorage.removeItem("rootly_storage_initialized")
      return { success: true, skipped: true } // Migration skipped because user already has data
    }

    // Get all localStorage data
    const localData = getAllData()

    if (localData.courses.length === 0 && localData.notes.length === 0 && localData.dailyEntries.length === 0) {
      return { success: true } // Nothing to migrate
    }

    // Migrate courses (preserve IDs if possible, but Supabase uses UUIDs)
    const courseIdMap = new Map<string, string>()

    for (const course of localData.courses) {
      const { data: newCourse, error } = await supabase
        .from("courses")
        .insert({
          instructor: course.instructor,
          title: course.title,
          links: course.links,
          topics: course.topics,
        })
        .select()
        .single()

      if (error) {
        console.error("Error migrating course:", error)
        continue
      }

      if (newCourse) {
        courseIdMap.set(course.id, newCourse.id)
      }
    }

    // Migrate notes (update course_id references)
    for (const note of localData.notes) {
      const newCourseId = courseIdMap.get(note.course_id)
      if (!newCourseId) {
        console.warn(`Course ${note.course_id} not found, skipping note`)
        continue
      }

      const { error } = await supabase.from("notes").insert({
        course_id: newCourseId,
        question: note.question,
        answer: note.answer,
        code_snippet: note.code_snippet,
        code_language: note.code_language,
        understanding_level: note.understanding_level,
        flag: note.flag,
      })

      if (error) {
        console.error("Error migrating note:", error)
      }
    }

    // Migrate daily entries
    for (const entry of localData.dailyEntries) {
      const { error } = await supabase.from("daily_entries").insert({
        date: entry.date,
        study_time: entry.study_time,
        mood: entry.mood,
        notes: entry.notes,
      })

      if (error) {
        // If entry already exists (unique constraint), try to update it
        if (error.code === "23505") {
          const { error: updateError } = await supabase
            .from("daily_entries")
            .update({
              study_time: entry.study_time,
              mood: entry.mood,
              notes: entry.notes,
            })
            .eq("date", entry.date)

          if (updateError) {
            console.error("Error updating daily entry:", updateError)
          }
        } else {
          console.error("Error migrating daily entry:", error)
        }
      }
    }

    // Clear localStorage data after successful migration
    clearAllData()
    localStorage.removeItem("rootly_storage_initialized")

    return { success: true }
  } catch (error) {
    console.error("Migration error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

