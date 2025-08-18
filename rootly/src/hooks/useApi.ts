// src/hooks/useApi.ts
import { useState, useEffect, useCallback } from 'react';
import { notesApi, coursesApi, dailyEntriesApi, ApiError } from '@/lib/api';
import type { Note, Course, DailyEntry } from '@/types';
import type { NoteInput } from '@/lib/zod/note';

// Generic API hook
function useApiState<T>(initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async <R>(apiCall: () => Promise<R>): Promise<R | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'An unexpected error occurred';
      setError(message);
      console.error('API Error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, setData, loading, error, execute };
}

// Notes hooks
export function useNotes() {
  const { data, setData, loading, error, execute } = useApiState<Note[]>([]);

  const fetchNotes = useCallback(async (params?: Parameters<typeof notesApi.getAll>[0]) => {
    const result = await execute(() => notesApi.getAll(params));
    if (result) {
      setData(result.data);
    }
    return result;
  }, [execute, setData]);

  const createNote = useCallback(async (note: NoteInput) => {
    const result = await execute(() => notesApi.create(note));
    if (result) {
      setData(prev => [result.data, ...prev]);
    }
    return result;
  }, [execute, setData]);

  const updateNote = useCallback(async (id: string, updates: Partial<NoteInput>) => {
    const result = await execute(() => notesApi.update(id, updates));
    if (result) {
      setData(prev => prev.map(note => 
        note.id === id ? result.data : note
      ));
    }
    return result;
  }, [execute, setData]);

  const deleteNote = useCallback(async (id: string) => {
    const result = await execute(() => notesApi.delete(id));
    if (result) {
      setData(prev => prev.filter(note => note.id !== id));
    }
    return result;
  }, [execute, setData]);

  return {
    notes: data,
    loading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  };
}

// Courses hooks
export function useCourses() {
  const { data, setData, loading, error, execute } = useApiState<Course[]>([]);

  const fetchCourses = useCallback(async () => {
    const result = await execute(() => coursesApi.getAll());
    if (result) {
      setData(result.data);
    }
    return result;
  }, [execute, setData]);

  const createCourse = useCallback(async (course: Parameters<typeof coursesApi.create>[0]) => {
    const result = await execute(() => coursesApi.create(course));
    if (result) {
      setData(prev => [result.data, ...prev]);
    }
    return result;
  }, [execute, setData]);

  const updateCourse = useCallback(async (id: string, updates: Parameters<typeof coursesApi.update>[1]) => {
    const result = await execute(() => coursesApi.update(id, updates));
    if (result) {
      setData(prev => prev.map(course => 
        course.id === id ? result.data : course
      ));
    }
    return result;
  }, [execute, setData]);

  const deleteCourse = useCallback(async (id: string) => {
    const result = await execute(() => coursesApi.delete(id));
    if (result) {
      setData(prev => prev.filter(course => course.id !== id));
    }
    return result;
  }, [execute, setData]);

  return {
    courses: data,
    loading,
    error,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
  };
}

// Daily entries hooks
export function useDailyEntries() {
  const { data, setData, loading, error, execute } = useApiState<DailyEntry[]>([]);

  const fetchDailyEntries = useCallback(async (params?: Parameters<typeof dailyEntriesApi.getAll>[0]) => {
    const result = await execute(() => dailyEntriesApi.getAll(params));
    if (result) {
      setData(result.data);
    }
    return result;
  }, [execute, setData]);

  const createEntry = useCallback(async (entry: Parameters<typeof dailyEntriesApi.create>[0]) => {
    const result = await execute(() => dailyEntriesApi.create(entry));
    if (result) {
      setData(prev => [result.data, ...prev.filter(e => e.date !== entry.date)]);
    }
    return result;
  }, [execute, setData]);

  const updateEntry = useCallback(async (id: string, updates: Parameters<typeof dailyEntriesApi.update>[1]) => {
    const result = await execute(() => dailyEntriesApi.update(id, updates));
    if (result) {
      setData(prev => prev.map(entry => 
        entry.id === id ? result.data : entry
      ));
    }
    return result;
  }, [execute, setData]);

  const updateByDate = useCallback(async (date: string, updates: Parameters<typeof dailyEntriesApi.updateByDate>[1]) => {
    const result = await execute(() => dailyEntriesApi.updateByDate(date, updates));
    if (result) {
      setData(prev => {
        const existingIndex = prev.findIndex(e => e.date === date);
        if (existingIndex >= 0) {
          return prev.map(entry => entry.date === date ? result.data : entry);
        } else {
          return [result.data, ...prev];
        }
      });
    }
    return result;
  }, [execute, setData]);

  return {
    dailyEntries: data,
    loading,
    error,
    fetchDailyEntries,
    createEntry,
    updateEntry,
    updateByDate,
  };
}

// Statistics hooks
export function useNotesStats() {
  const { data, loading, error, execute } = useApiState<any>(null);

  const fetchStats = useCallback(async () => {
    const result = await execute(() => notesApi.getStats());
    if (result) {
      return result.data;
    }
    return null;
  }, [execute]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats: data, loading, error, refetch: fetchStats };
}

export function useDailyStats() {
  const { data, loading, error, execute } = useApiState<any>(null);

  const fetchStats = useCallback(async () => {
    const result = await execute(() => dailyEntriesApi.getStats());
    if (result) {
      return result.data;
    }
    return null;
  }, [execute]);

  const fetchLastWeek = useCallback(async () => {
    const result = await execute(() => dailyEntriesApi.getLastWeek());
    if (result) {
      return result.data;
    }
    return null;
  }, [execute]);

  return { stats: data, loading, error, fetchStats, fetchLastWeek };
}
