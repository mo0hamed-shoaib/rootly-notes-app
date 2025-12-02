"use client"

/**
 * Unified data fetching hooks that work with both Supabase and localStorage
 * Uses React 19 patterns with proper client-side data management
 */

import { useEffect, useState, useCallback } from "react"
import { getStorageMode } from "@/lib/storage-mode"
import { useStorageMode } from "@/components/storage-mode-provider"
import * as localStorage from "@/lib/data/local-storage"
import { supabase } from "@/lib/supabase/client"
import type { Course, Note, DailyEntry } from "@/lib/types"

// Courses
export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { mode: storageMode, isLoading: storageModeLoading } = useStorageMode()

  const fetchCourses = useCallback(async () => {
    // Wait for storage mode to be determined
    if (storageModeLoading) {
      return
    }
    
    try {
      setIsLoading(true)
      
      // If storage mode is not set yet, try to determine it
      const mode = storageMode || await getStorageMode()

      if (mode === "localStorage") {
        const data = localStorage.getCourses()
        setCourses(data)
      } else {
        const { data, error: supabaseError } = await supabase.from("courses").select("*").order("title")

        if (supabaseError) {
          throw new Error(supabaseError.message)
        }

        setCourses(data || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch courses"))
    } finally {
      setIsLoading(false)
    }
  }, [storageMode, storageModeLoading])

  useEffect(() => {
    // Don't fetch if storage mode is still loading
    if (storageModeLoading) {
      return
    }

    fetchCourses()

    // Subscribe to changes in Supabase mode
    let cleanup: (() => void) | undefined
    if (storageMode === "supabase") {
      const channel = supabase
        .channel("courses-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "courses" }, () => {
          fetchCourses()
        })
        .subscribe()

      cleanup = () => {
        supabase.removeChannel(channel)
      }
    }

    return () => {
      if (cleanup) cleanup()
    }
  }, [fetchCourses, storageMode, storageModeLoading])

  // Don't show loading if storage mode is still loading
  const effectiveLoading = storageModeLoading || isLoading

  return { courses, isLoading: effectiveLoading, error, refetch: fetchCourses }
}

// Notes
interface NoteFilters {
  courseId?: string
  understandingLevel?: number
  flagged?: boolean
  search?: string
}

export function useNotes(filters?: NoteFilters) {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { mode: storageMode, isLoading: storageModeLoading } = useStorageMode()

  const fetchNotes = useCallback(async () => {
    // Wait for storage mode to be determined
    if (storageModeLoading) {
      return
    }
    
    try {
      setIsLoading(true)
      
      // If storage mode is not set yet, try to determine it
      const mode = storageMode || await getStorageMode()

      if (mode === "localStorage") {
        let data = localStorage.getNotes()

        // Apply filters
        if (filters?.courseId) {
          data = data.filter((n) => n.course_id === filters.courseId)
        }
        if (filters?.understandingLevel) {
          data = data.filter((n) => n.understanding_level === filters.understandingLevel)
        }
        if (filters?.flagged !== undefined) {
          data = data.filter((n) => n.flag === filters.flagged)
        }
        if (filters?.search) {
          const searchLower = filters.search.toLowerCase()
          data = data.filter(
            (n) =>
              n.question.toLowerCase().includes(searchLower) ||
              n.answer.toLowerCase().includes(searchLower) ||
              (n.code_snippet && n.code_snippet.toLowerCase().includes(searchLower))
          )
        }

        // Attach course data
        const courses = localStorage.getCourses()
        data = data.map((note) => ({
          ...note,
          course: courses.find((c) => c.id === note.course_id),
        }))

        setNotes(data)
      } else {
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

        const { data, error: supabaseError } = await query

        if (supabaseError) {
          throw new Error(supabaseError.message)
        }

        setNotes(data || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch notes"))
    } finally {
      setIsLoading(false)
    }
  }, [filters, storageMode, storageModeLoading])

  useEffect(() => {
    // Don't fetch if storage mode is still loading
    if (storageModeLoading) {
      return
    }

    fetchNotes()

    // Subscribe to changes in Supabase mode
    let cleanup: (() => void) | undefined
    if (storageMode === "supabase") {
      const channel = supabase
        .channel("notes-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "notes" }, () => {
          fetchNotes()
        })
        .subscribe()

      cleanup = () => {
        supabase.removeChannel(channel)
      }
    }

    return () => {
      if (cleanup) cleanup()
    }
  }, [fetchNotes, storageMode, storageModeLoading])

  // Don't show loading if storage mode is still loading
  const effectiveLoading = storageModeLoading || isLoading

  return { notes, isLoading: effectiveLoading, error, refetch: fetchNotes }
}

// Daily Entries
export function useDailyEntries() {
  const [entries, setEntries] = useState<DailyEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { mode: storageMode, isLoading: storageModeLoading } = useStorageMode()

  const fetchEntries = useCallback(async () => {
    // Wait for storage mode to be determined
    if (storageModeLoading) {
      return
    }
    
    try {
      setIsLoading(true)
      
      // If storage mode is not set yet, try to determine it
      const mode = storageMode || await getStorageMode()

      if (mode === "localStorage") {
        const data = localStorage.getDailyEntries()
        setEntries(data)
      } else {
        const { data, error: supabaseError } = await supabase
          .from("daily_entries")
          .select("*")
          .order("date", { ascending: false })

        if (supabaseError) {
          throw new Error(supabaseError.message)
        }

        setEntries(data || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch daily entries"))
    } finally {
      setIsLoading(false)
    }
  }, [storageMode, storageModeLoading])

  useEffect(() => {
    // Don't fetch if storage mode is still loading
    if (storageModeLoading) {
      return
    }

    fetchEntries()

    // Subscribe to changes in Supabase mode
    let cleanup: (() => void) | undefined
    if (storageMode === "supabase") {
      const channel = supabase
        .channel("daily-entries-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "daily_entries" }, () => {
          fetchEntries()
        })
        .subscribe()

      cleanup = () => {
        supabase.removeChannel(channel)
      }
    }

    return () => {
      if (cleanup) cleanup()
    }
  }, [fetchEntries, storageMode, storageModeLoading])

  // Don't show loading if storage mode is still loading
  const effectiveLoading = storageModeLoading || isLoading

  return { entries, isLoading: effectiveLoading, error, refetch: fetchEntries }
}

