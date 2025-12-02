"use client";

/**
 * Unified mutation hooks that work with both Supabase and localStorage
 * Uses Server Actions for Supabase, client functions for localStorage
 */

import { useCallback } from "react";
import { useStorageMode } from "@/components/storage-mode-provider";
import * as localStorage from "@/lib/data/local-storage";
import * as serverActions from "@/lib/data/server-actions";
import { toast } from "sonner";
import type { Course, Note, DailyEntry } from "@/lib/types";

// Custom event for localStorage updates
const dispatchStorageUpdate = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("rootly-storage-update"));
  }
};

// Courses
export function useCourseMutations() {
  const { mode } = useStorageMode();

  const createCourse = useCallback(
    async (course: Omit<Course, "id" | "created_at" | "updated_at">) => {
      try {
        if (mode === "localStorage") {
          localStorage.saveCourse(course);
          toast.success("Course created");
          dispatchStorageUpdate();
          return;
        }

        await serverActions.createCourseServer(course);
        toast.success("Course created");
        // Trigger refetch for Supabase mode
        dispatchStorageUpdate();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to create course"
        );
        throw error;
      }
    },
    [mode]
  );

  const updateCourse = useCallback(
    async (id: string, updates: Partial<Course>) => {
      try {
        if (mode === "localStorage") {
          localStorage.updateCourse(id, updates);
          toast.success("Course updated");
          dispatchStorageUpdate();
          return;
        }

        await serverActions.updateCourseServer(id, updates);
        toast.success("Course updated");
        dispatchStorageUpdate();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to update course"
        );
        throw error;
      }
    },
    [mode]
  );

  const deleteCourse = useCallback(
    async (id: string) => {
      try {
        if (mode === "localStorage") {
          localStorage.deleteCourse(id);
          toast.success("Course deleted");
          dispatchStorageUpdate();
          return;
        }

        await serverActions.deleteCourseServer(id);
        toast.success("Course deleted");
        dispatchStorageUpdate();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete course"
        );
        throw error;
      }
    },
    [mode]
  );

  return { createCourse, updateCourse, deleteCourse };
}

// Notes
export function useNoteMutations() {
  const { mode } = useStorageMode();

  const createNote = useCallback(
    async (note: Omit<Note, "id" | "created_at" | "updated_at" | "course">) => {
      try {
        if (mode === "localStorage") {
          localStorage.saveNote(note);
          toast.success("Note created");
          dispatchStorageUpdate();
          return;
        }

        await serverActions.createNoteServer(note);
        toast.success("Note created");
        dispatchStorageUpdate();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to create note"
        );
        throw error;
      }
    },
    [mode]
  );

  const updateNote = useCallback(
    async (id: string, updates: Partial<Omit<Note, "course">>) => {
      try {
        if (mode === "localStorage") {
          localStorage.updateNote(id, updates);
          toast.success("Note updated");
          dispatchStorageUpdate();
          return;
        }

        await serverActions.updateNoteServer(id, updates);
        toast.success("Note updated");
        dispatchStorageUpdate();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to update note"
        );
        throw error;
      }
    },
    [mode]
  );

  const deleteNote = useCallback(
    async (id: string) => {
      try {
        if (mode === "localStorage") {
          localStorage.deleteNote(id);
          toast.success("Note deleted");
          dispatchStorageUpdate();
          return;
        }

        await serverActions.deleteNoteServer(id);
        toast.success("Note deleted");
        dispatchStorageUpdate();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete note"
        );
        throw error;
      }
    },
    [mode]
  );

  return { createNote, updateNote, deleteNote };
}

// Daily Entries
export function useDailyEntryMutations() {
  const { mode } = useStorageMode();

  const createDailyEntry = useCallback(
    async (entry: Omit<DailyEntry, "id" | "created_at" | "updated_at">) => {
      try {
        if (mode === "localStorage") {
          localStorage.saveDailyEntry(entry);
          toast.success("Daily tracking saved");
          dispatchStorageUpdate();
          return;
        }

        await serverActions.createDailyEntryServer(entry);
        toast.success("Daily tracking saved");
        dispatchStorageUpdate();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to save daily tracking"
        );
        throw error;
      }
    },
    [mode]
  );

  const updateDailyEntry = useCallback(
    async (id: string, updates: Partial<DailyEntry>) => {
      try {
        if (mode === "localStorage") {
          localStorage.updateDailyEntry(id, updates);
          toast.success("Daily tracking updated");
          dispatchStorageUpdate();
          return;
        }

        await serverActions.updateDailyEntryServer(id, updates);
        toast.success("Daily tracking updated");
        dispatchStorageUpdate();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update daily tracking"
        );
        throw error;
      }
    },
    [mode]
  );

  const deleteDailyEntry = useCallback(
    async (id: string) => {
      try {
        if (mode === "localStorage") {
          localStorage.deleteDailyEntry(id);
          toast.success("Daily tracking deleted");
          dispatchStorageUpdate();
          return;
        }

        await serverActions.deleteDailyEntryServer(id);
        toast.success("Daily tracking deleted");
        dispatchStorageUpdate();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to delete daily tracking"
        );
        throw error;
      }
    },
    [mode]
  );

  return { createDailyEntry, updateDailyEntry, deleteDailyEntry };
}
