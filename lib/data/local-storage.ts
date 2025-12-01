/**
 * localStorage utilities for data persistence
 */

import type { Course, Note, DailyEntry } from "@/lib/types"

const STORAGE_KEYS = {
  courses: "rootly_courses",
  notes: "rootly_notes",
  dailyEntries: "rootly_daily_entries",
} as const

// Helper to generate UUIDs
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Courses
export function getCourses(): Course[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEYS.courses)
  return stored ? JSON.parse(stored) : []
}

export function saveCourse(course: Omit<Course, "id" | "created_at" | "updated_at">): Course {
  const courses = getCourses()
  const newCourse: Course = {
    ...course,
    id: generateId(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  courses.push(newCourse)
  localStorage.setItem(STORAGE_KEYS.courses, JSON.stringify(courses))
  return newCourse
}

export function updateCourse(id: string, updates: Partial<Course>): Course | null {
  const courses = getCourses()
  const index = courses.findIndex((c) => c.id === id)
  if (index === -1) return null

  courses[index] = {
    ...courses[index],
    ...updates,
    updated_at: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEYS.courses, JSON.stringify(courses))
  return courses[index]
}

export function deleteCourse(id: string): boolean {
  const courses = getCourses()
  const filtered = courses.filter((c) => c.id !== id)
  if (filtered.length === courses.length) return false
  localStorage.setItem(STORAGE_KEYS.courses, JSON.stringify(filtered))
  return true
}

// Notes
export function getNotes(): Note[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEYS.notes)
  return stored ? JSON.parse(stored) : []
}

export function saveNote(note: Omit<Note, "id" | "created_at" | "updated_at">): Note {
  const notes = getNotes()
  const newNote: Note = {
    ...note,
    id: generateId(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  notes.push(newNote)
  localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes))
  return newNote
}

export function updateNote(id: string, updates: Partial<Note>): Note | null {
  const notes = getNotes()
  const index = notes.findIndex((n) => n.id === id)
  if (index === -1) return null

  notes[index] = {
    ...notes[index],
    ...updates,
    updated_at: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes))
  return notes[index]
}

export function deleteNote(id: string): boolean {
  const notes = getNotes()
  const filtered = notes.filter((n) => n.id !== id)
  if (filtered.length === notes.length) return false
  localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(filtered))
  return true
}

// Daily Entries
export function getDailyEntries(): DailyEntry[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEYS.dailyEntries)
  return stored ? JSON.parse(stored) : []
}

export function saveDailyEntry(entry: Omit<DailyEntry, "id" | "created_at" | "updated_at">): DailyEntry {
  const entries = getDailyEntries()
  // Check if entry for this date already exists
  const existingIndex = entries.findIndex((e) => e.date === entry.date)
  const now = new Date().toISOString()

  if (existingIndex !== -1) {
    // Update existing entry
    entries[existingIndex] = {
      ...entries[existingIndex],
      ...entry,
      updated_at: now,
    }
    localStorage.setItem(STORAGE_KEYS.dailyEntries, JSON.stringify(entries))
    return entries[existingIndex]
  }

  // Create new entry
  const newEntry: DailyEntry = {
    ...entry,
    id: generateId(),
    created_at: now,
    updated_at: now,
  }
  entries.push(newEntry)
  localStorage.setItem(STORAGE_KEYS.dailyEntries, JSON.stringify(entries))
  return newEntry
}

export function updateDailyEntry(id: string, updates: Partial<DailyEntry>): DailyEntry | null {
  const entries = getDailyEntries()
  const index = entries.findIndex((e) => e.id === id)
  if (index === -1) return null

  entries[index] = {
    ...entries[index],
    ...updates,
    updated_at: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEYS.dailyEntries, JSON.stringify(entries))
  return entries[index]
}

export function deleteDailyEntry(id: string): boolean {
  const entries = getDailyEntries()
  const filtered = entries.filter((e) => e.id !== id)
  if (filtered.length === entries.length) return false
  localStorage.setItem(STORAGE_KEYS.dailyEntries, JSON.stringify(filtered))
  return true
}

// Clear all data
export function clearAllData(): void {
  if (typeof window === "undefined") return
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key)
  })
}

// Get all data for migration
export function getAllData() {
  return {
    courses: getCourses(),
    notes: getNotes(),
    dailyEntries: getDailyEntries(),
  }
}

