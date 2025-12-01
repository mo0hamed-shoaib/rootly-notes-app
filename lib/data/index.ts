/**
 * Unified data access layer that works with both Supabase and localStorage
 */

import type { Course, Note, DailyEntry } from "@/lib/types"
import { getStorageMode } from "@/lib/storage-mode"
import * as localStorage from "./local-storage"

// Courses
export async function getCourses(): Promise<Course[]> {
  const mode = await getStorageMode()
  if (mode === "localStorage") {
    return localStorage.getCourses()
  }

  // Supabase
  const { createClient } = await import("@/lib/supabase/server")
  const supabase = await createClient()
  const { data, error } = await supabase.from("courses").select("*").order("title")

  if (error) {
    console.error("Error fetching courses:", error)
    return []
  }

  return data || []
}

export async function saveCourse(course: Omit<Course, "id" | "created_at" | "updated_at">): Promise<Course> {
  const mode = await getStorageMode()
  if (mode === "localStorage") {
    return localStorage.saveCourse(course)
  }

  // Supabase
  const { createClient } = await import("@/lib/supabase/server")
  const supabase = await createClient()
  const { data, error } = await supabase.from("courses").insert(course).select().single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateCourse(id: string, updates: Partial<Course>): Promise<Course | null> {
  const mode = await getStorageMode()
  if (mode === "localStorage") {
    return localStorage.updateCourse(id, updates)
  }

  // Supabase
  const { createClient } = await import("@/lib/supabase/server")
  const supabase = await createClient()
  const { data, error } = await supabase.from("courses").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("Error updating course:", error)
    return null
  }

  return data
}

export async function deleteCourse(id: string): Promise<boolean> {
  const mode = await getStorageMode()
  if (mode === "localStorage") {
    return localStorage.deleteCourse(id)
  }

  // Supabase
  const { createClient } = await import("@/lib/supabase/server")
  const supabase = await createClient()
  const { error } = await supabase.from("courses").delete().eq("id", id)

  return !error
}

// Notes
export async function getNotes(filters?: {
  courseId?: string
  understandingLevel?: number
  flagged?: boolean
  search?: string
}): Promise<Note[]> {
  const mode = await getStorageMode()
  if (mode === "localStorage") {
    let notes = localStorage.getNotes()

    // Apply filters
    if (filters?.courseId) {
      notes = notes.filter((n) => n.course_id === filters.courseId)
    }
    if (filters?.understandingLevel) {
      notes = notes.filter((n) => n.understanding_level === filters.understandingLevel)
    }
    if (filters?.flagged !== undefined) {
      notes = notes.filter((n) => n.flag === filters.flagged)
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      notes = notes.filter(
        (n) =>
          n.question.toLowerCase().includes(searchLower) ||
          n.answer.toLowerCase().includes(searchLower) ||
          (n.code_snippet && n.code_snippet.toLowerCase().includes(searchLower))
      )
    }

    // Attach course data
    const courses = localStorage.getCourses()
    return notes.map((note) => ({
      ...note,
      course: courses.find((c) => c.id === note.course_id),
    }))
  }

  // Supabase
  const { createClient } = await import("@/lib/supabase/server")
  const supabase = await createClient()
  let query = supabase
    .from("notes")
    .select(
      `
      *,
      course:courses(*)
    `
    )
    .order("created_at", { ascending: false })

  if (filters?.courseId) {
    query = query.eq("course_id", filters.courseId)
  }
  if (filters?.understandingLevel) {
    query = query.eq("understanding_level", filters.understandingLevel)
  }
  if (filters?.flagged !== undefined) {
    query = query.eq("flag", filters.flagged)
  }
  if (filters?.search) {
    query = query.or(
      `question.ilike.%${filters.search}%,answer.ilike.%${filters.search}%,code_snippet.ilike.%${filters.search}%`
    )
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching notes:", error)
    return []
  }

  return data || []
}

export async function saveNote(note: Omit<Note, "id" | "created_at" | "updated_at">): Promise<Note> {
  const mode = await getStorageMode()
  if (mode === "localStorage") {
    return localStorage.saveNote(note)
  }

  // Supabase
  const { createClient } = await import("@/lib/supabase/server")
  const supabase = await createClient()
  const { data, error } = await supabase.from("notes").insert(note).select().single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateNote(id: string, updates: Partial<Note>): Promise<Note | null> {
  const mode = await getStorageMode()
  if (mode === "localStorage") {
    return localStorage.updateNote(id, updates)
  }

  // Supabase
  const { createClient } = await import("@/lib/supabase/server")
  const supabase = await createClient()
  const { data, error } = await supabase.from("notes").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("Error updating note:", error)
    return null
  }

  return data
}

export async function deleteNote(id: string): Promise<boolean> {
  const mode = await getStorageMode()
  if (mode === "localStorage") {
    return localStorage.deleteNote(id)
  }

  // Supabase
  const { createClient } = await import("@/lib/supabase/server")
  const supabase = await createClient()
  const { error } = await supabase.from("notes").delete().eq("id", id)

  return !error
}

// Daily Entries
export async function getDailyEntries(): Promise<DailyEntry[]> {
  const mode = await getStorageMode()
  if (mode === "localStorage") {
    return localStorage.getDailyEntries()
  }

  // Supabase
  const { createClient } = await import("@/lib/supabase/server")
  const supabase = await createClient()
  const { data, error } = await supabase.from("daily_entries").select("*").order("date", { ascending: false })

  if (error) {
    console.error("Error fetching daily entries:", error)
    return []
  }

  return data || []
}

export async function saveDailyEntry(
  entry: Omit<DailyEntry, "id" | "created_at" | "updated_at">
): Promise<DailyEntry> {
  const mode = await getStorageMode()
  if (mode === "localStorage") {
    return localStorage.saveDailyEntry(entry)
  }

  // Supabase
  const { createClient } = await import("@/lib/supabase/server")
  const supabase = await createClient()
  const { data, error } = await supabase.from("daily_entries").upsert(entry, { onConflict: "date" }).select().single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateDailyEntry(id: string, updates: Partial<DailyEntry>): Promise<DailyEntry | null> {
  const mode = await getStorageMode()
  if (mode === "localStorage") {
    return localStorage.updateDailyEntry(id, updates)
  }

  // Supabase
  const { createClient } = await import("@/lib/supabase/server")
  const supabase = await createClient()
  const { data, error } = await supabase.from("daily_entries").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("Error updating daily entry:", error)
    return null
  }

  return data
}

export async function deleteDailyEntry(id: string): Promise<boolean> {
  const mode = await getStorageMode()
  if (mode === "localStorage") {
    return localStorage.deleteDailyEntry(id)
  }

  // Supabase
  const { createClient } = await import("@/lib/supabase/server")
  const supabase = await createClient()
  const { error } = await supabase.from("daily_entries").delete().eq("id", id)

  return !error
}

