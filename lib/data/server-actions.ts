"use server"

/**
 * Server Actions for Supabase operations
 * These only work when user is authenticated (Supabase mode)
 */

import { createClient } from "@/lib/supabase/server"
import type { Course, Note, DailyEntry } from "@/lib/types"

// Courses
export async function createCourseServer(course: Omit<Course, "id" | "created_at" | "updated_at">) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("courses").insert(course).select().single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateCourseServer(id: string, updates: Partial<Course>) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("courses").update(updates).eq("id", id).select().single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function deleteCourseServer(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("courses").delete().eq("id", id)

  if (error) {
    throw new Error(error.message)
  }
}

// Notes
export async function createNoteServer(note: Omit<Note, "id" | "created_at" | "updated_at" | "course">) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("notes").insert(note).select().single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateNoteServer(id: string, updates: Partial<Omit<Note, "course">>) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("notes").update(updates).eq("id", id).select().single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function deleteNoteServer(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("notes").delete().eq("id", id)

  if (error) {
    throw new Error(error.message)
  }
}

// Daily Entries
export async function createDailyEntryServer(entry: Omit<DailyEntry, "id" | "created_at" | "updated_at">) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("daily_entries").upsert(entry, { onConflict: "date" }).select().single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateDailyEntryServer(id: string, updates: Partial<DailyEntry>) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("daily_entries").update(updates).eq("id", id).select().single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function deleteDailyEntryServer(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("daily_entries").delete().eq("id", id)

  if (error) {
    throw new Error(error.message)
  }
}

