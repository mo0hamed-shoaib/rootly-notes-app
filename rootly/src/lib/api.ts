// src/lib/api.ts
import type { Note, Course, DailyEntry } from '@/types';
import type { NoteInput } from '@/lib/zod/note';
import type { CourseInput } from '@/lib/zod/course';
import type { DailyInput } from '@/lib/zod/daily';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network or other errors
    throw new ApiError(0, 'Network error or server unavailable');
  }
}

// Notes API
export const notesApi = {
  // Get all notes with optional filters
  getAll: async (params?: {
    courseId?: string;
    status?: string;
    topics?: string;
    search?: string;
    sort?: string;
    limit?: number;
    offset?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const query = searchParams.toString();
    const endpoint = query ? `/notes?${query}` : '/notes';
    
    return fetchApi<{
      success: boolean;
      data: Note[];
      pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
      };
    }>(endpoint);
  },

  // Get single note
  getById: async (id: string) => {
    return fetchApi<{ success: boolean; data: Note }>(`/notes/${id}`);
  },

  // Create new note
  create: async (note: NoteInput) => {
    return fetchApi<{ success: boolean; data: Note; message: string }>('/notes', {
      method: 'POST',
      body: JSON.stringify(note),
    });
  },

  // Update note
  update: async (id: string, updates: Partial<NoteInput>) => {
    return fetchApi<{ success: boolean; data: Note; message: string }>(`/notes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  // Delete note
  delete: async (id: string) => {
    return fetchApi<{ success: boolean; message: string }>(`/notes/${id}`, {
      method: 'DELETE',
    });
  },

  // Get notes statistics
  getStats: async () => {
    return fetchApi<{
      success: boolean;
      data: {
        totalNotes: number;
        answeredNotes: number;
        focusNotes: number;
        blackBoxNotes: number;
        avgUnderstanding: number;
        answerRate: number;
        topicStats: Array<{ _id: string; count: number }>;
      };
    }>('/notes/stats/summary');
  },
};

// Courses API
export const coursesApi = {
  // Get all courses
  getAll: async () => {
    return fetchApi<{ success: boolean; data: Course[] }>('/courses');
  },

  // Get single course
  getById: async (id: string) => {
    return fetchApi<{ success: boolean; data: Course }>(`/courses/${id}`);
  },

  // Get course notes
  getNotes: async (id: string) => {
    return fetchApi<{ success: boolean; data: Note[] }>(`/courses/${id}/notes`);
  },

  // Get course statistics
  getStats: async (id: string) => {
    return fetchApi<{
      success: boolean;
      data: {
        totalNotes: number;
        answeredNotes: number;
        focusNotes: number;
        avgUnderstanding: number;
        completionRate: number;
        topicStats: Array<{ _id: string; count: number }>;
      };
    }>(`/courses/${id}/stats`);
  },

  // Create new course
  create: async (course: CourseInput) => {
    return fetchApi<{ success: boolean; data: Course; message: string }>('/courses', {
      method: 'POST',
      body: JSON.stringify(course),
    });
  },

  // Update course
  update: async (id: string, updates: Partial<CourseInput>) => {
    return fetchApi<{ success: boolean; data: Course; message: string }>(`/courses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  // Delete course
  delete: async (id: string) => {
    return fetchApi<{ success: boolean; message: string }>(`/courses/${id}`, {
      method: 'DELETE',
    });
  },
};

// Daily Entries API
export const dailyEntriesApi = {
  // Get daily entries with optional date range
  getAll: async (params?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const query = searchParams.toString();
    const endpoint = query ? `/daily-entries?${query}` : '/daily-entries';
    
    return fetchApi<{ success: boolean; data: DailyEntry[] }>(endpoint);
  },

  // Get entry by date
  getByDate: async (date: string) => {
    return fetchApi<{ success: boolean; data: DailyEntry | null }>(`/daily-entries/date/${date}`);
  },

  // Create new daily entry
  create: async (entry: DailyInput) => {
    return fetchApi<{ success: boolean; data: DailyEntry; message: string }>('/daily-entries', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
  },

  // Update daily entry
  update: async (id: string, updates: Partial<DailyInput>) => {
    return fetchApi<{ success: boolean; data: DailyEntry; message: string }>(`/daily-entries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  // Update or create entry by date
  updateByDate: async (date: string, updates: Partial<DailyInput>) => {
    return fetchApi<{ success: boolean; data: DailyEntry; message: string }>(`/daily-entries/date/${date}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  // Delete daily entry
  delete: async (id: string) => {
    return fetchApi<{ success: boolean; message: string }>(`/daily-entries/${id}`, {
      method: 'DELETE',
    });
  },

  // Get study statistics
  getStats: async () => {
    return fetchApi<{
      success: boolean;
      data: {
        totalEntries: number;
        totalStudyMinutes: number;
        totalStudyHours: number;
        currentStreak: number;
        avgStudyTime: number;
        topicStats: Array<{ _id: string; count: number }>;
        moodStats: Array<{ _id: string; count: number }>;
      };
    }>('/daily-entries/stats/summary');
  },

  // Get last week data for charts
  getLastWeek: async () => {
    return fetchApi<{
      success: boolean;
      data: Array<{
        date: string;
        minutes: number;
        mood: string | null;
      }>;
    }>('/daily-entries/stats/last-week');
  },
};

export { ApiError };
