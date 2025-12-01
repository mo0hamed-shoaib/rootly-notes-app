"use client"

/**
 * Unified mutation hooks that work with both Supabase and localStorage
 * Uses Server Actions for Supabase, client functions for localStorage
 */

import { useCallback } from "react"
import { getStorageMode } from "@/lib/storage-mode"
import * as localStorage from "@/lib/data/local-storage"
import * as serverActions from "@/lib/data/server-actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Course, Note, DailyEntry } from "@/lib/types"

// Courses
export function useCourseMutations() {
  const router = useRouter()

  const createCourse = useCallback(
    async (course: Omit<Course, "id" | "created_at" | "updated_at">) => {
      try {
        const mode = await getStorageMode()

        if (mode === "localStorage") {
          localStorage.saveCourse(course)
          toast.success("Course created")
          router.refresh()
          return
        }

        await serverActions.createCourseServer(course)
        toast.success("Course created")
        router.refresh()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to create course")
        throw error
      }
    },
    [router]
  )

  const updateCourse = useCallback(
    async (id: string, updates: Partial<Course>) => {
      try {
        const mode = await getStorageMode()

        if (mode === "localStorage") {
          localStorage.updateCourse(id, updates)
          toast.success("Course updated")
          router.refresh()
          return
        }

        await serverActions.updateCourseServer(id, updates)
        toast.success("Course updated")
        router.refresh()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to update course")
        throw error
      }
    },
    [router]
  )

  const deleteCourse = useCallback(
    async (id: string) => {
      try {
        const mode = await getStorageMode()

        if (mode === "localStorage") {
          localStorage.deleteCourse(id)
          toast.success("Course deleted")
          router.refresh()
          return
        }

        await serverActions.deleteCourseServer(id)
        toast.success("Course deleted")
        router.refresh()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete course")
        throw error
      }
    },
    [router]
  )

  return { createCourse, updateCourse, deleteCourse }
}

// Notes
export function useNoteMutations() {
  const router = useRouter()

  const createNote = useCallback(
    async (note: Omit<Note, "id" | "created_at" | "updated_at" | "course">) => {
      try {
        const mode = await getStorageMode()

        if (mode === "localStorage") {
          localStorage.saveNote(note)
          toast.success("Note created")
          router.refresh()
          return
        }

        await serverActions.createNoteServer(note)
        toast.success("Note created")
        router.refresh()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to create note")
        throw error
      }
    },
    [router]
  )

  const updateNote = useCallback(
    async (id: string, updates: Partial<Omit<Note, "course">>) => {
      try {
        const mode = await getStorageMode()

        if (mode === "localStorage") {
          localStorage.updateNote(id, updates)
          toast.success("Note updated")
          router.refresh()
          return
        }

        await serverActions.updateNoteServer(id, updates)
        toast.success("Note updated")
        router.refresh()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to update note")
        throw error
      }
    },
    [router]
  )

  const deleteNote = useCallback(
    async (id: string) => {
      try {
        const mode = await getStorageMode()

        if (mode === "localStorage") {
          localStorage.deleteNote(id)
          toast.success("Note deleted")
          router.refresh()
          return
        }

        await serverActions.deleteNoteServer(id)
        toast.success("Note deleted")
        router.refresh()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete note")
        throw error
      }
    },
    [router]
  )

  return { createNote, updateNote, deleteNote }
}

// Daily Entries
export function useDailyEntryMutations() {
  const router = useRouter()

  const createDailyEntry = useCallback(
    async (entry: Omit<DailyEntry, "id" | "created_at" | "updated_at">) => {
      try {
        const mode = await getStorageMode()

        if (mode === "localStorage") {
          localStorage.saveDailyEntry(entry)
          toast.success("Daily entry saved")
          router.refresh()
          return
        }

        await serverActions.createDailyEntryServer(entry)
        toast.success("Daily entry saved")
        router.refresh()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to save daily entry")
        throw error
      }
    },
    [router]
  )

  const updateDailyEntry = useCallback(
    async (id: string, updates: Partial<DailyEntry>) => {
      try {
        const mode = await getStorageMode()

        if (mode === "localStorage") {
          localStorage.updateDailyEntry(id, updates)
          toast.success("Daily entry updated")
          router.refresh()
          return
        }

        await serverActions.updateDailyEntryServer(id, updates)
        toast.success("Daily entry updated")
        router.refresh()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to update daily entry")
        throw error
      }
    },
    [router]
  )

  const deleteDailyEntry = useCallback(
    async (id: string) => {
      try {
        const mode = await getStorageMode()

        if (mode === "localStorage") {
          localStorage.deleteDailyEntry(id)
          toast.success("Daily entry deleted")
          router.refresh()
          return
        }

        await serverActions.deleteDailyEntryServer(id)
        toast.success("Daily entry deleted")
        router.refresh()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete daily entry")
        throw error
      }
    },
    [router]
  )

  return { createDailyEntry, updateDailyEntry, deleteDailyEntry }
}

