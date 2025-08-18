// src/types.ts
export type Topic =
  | "hooks"
  | "reconciliation"
  | "rendering"
  | "state"
  | "routing"
  | "performance"
  | "other";

export interface Course {
  id: string;
  instructor: string;
  title: string;
  links: { course?: string; repo?: string; docs?: string };
  version?: string; // e.g., "React 18"
  startedAt: string; // ISO
  tags: Topic[];
}

export interface CourseInput {
  instructor: string;
  title: string;
  links: { course?: string; repo?: string; docs?: string };
  version?: string;
  startedAt: string;
  tags: Topic[];
}

export interface Note {
  id: string;
  courseId: string;
  question: string; // e.g., "How does useEffect work?"
  topics: Topic[];
  status: "draft" | "active" | "answered";
  understanding: number; // 0..100
  flags: Partial<{ focus: boolean; blackBox: boolean; mastered: boolean }>;
  createdAt: string;
  updatedAt: string;
}

export interface DailyEntry {
  id: string;
  date: string; // ISO
  studiedMinutes: number;
  summary: string;
  topicsTouched: Topic[];
  mood?: "energized" | "ok" | "tired";
}
