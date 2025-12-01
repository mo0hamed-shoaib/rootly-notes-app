/**
 * Seed data for new users (both authenticated and localStorage)
 */

import type { Course, Note, DailyEntry } from "@/lib/types";

export const seedCourses: Omit<Course, "id" | "created_at" | "updated_at">[] = [
  {
    instructor: "Sarah Daniels",
    title: "Ultimate React & Next.js",
    links: [
      "https://nextjs.org/docs",
      "https://react.dev/learn",
      "https://nextjs.org/learn",
    ],
    topics: [
      "React",
      "Next.js",
      "Routing",
      "Data Fetching",
      "Server Components",
      "Client Components",
    ],
  },
  {
    instructor: "Aamir Patel",
    title: "Complete MongoDB",
    links: [
      "https://www.mongodb.com/docs",
      "https://www.mongodb.com/developer",
      "https://university.mongodb.com",
    ],
    topics: [
      "Documents",
      "Indexes",
      "Aggregation",
      "Schema Design",
      "Transactions",
      "Replication",
    ],
  },
];

export const seedNotes: (
  reactCourseId: string,
  mongoCourseId: string
) => Omit<Note, "id" | "created_at" | "updated_at">[] = (
  reactCourseId,
  mongoCourseId
) => {
  return [
    {
      course_id: reactCourseId,
      question: "What is the difference between useState and useRef?",
      answer:
        "useState triggers a re-render when the state changes and is ideal for UI state. useRef stores a mutable value that persists across renders without causing a re-render; it's ideal for DOM refs and instance variables.",
      code_snippet: `const [count, setCount] = useState(0);
const inputRef = useRef(null);`,
      code_language: "tsx",
      understanding_level: 4,
      flag: false,
    },
    {
      course_id: reactCourseId,
      question: "How do you create a page in the Next.js App Router?",
      answer:
        "Place a page.tsx file under a route folder (e.g., app/about/page.tsx). The folder path defines the route. You can also use dynamic routes with [slug] folders.",
      code_snippet: `// app/about/page.tsx
export default function AboutPage() {
  return <main>About</main>;
}`,
      code_language: "tsx",
      understanding_level: 5,
      flag: false,
    },
    {
      course_id: reactCourseId,
      question: "What is useEffect cleanup?",
      answer:
        "Return a function from useEffect to clean subscriptions/timers. React calls it before the effect re-runs or during unmount. This prevents memory leaks.",
      code_snippet: `useEffect(() => {
  const id = setInterval(() => console.log('tick'), 1000);
  return () => clearInterval(id);
}, []);`,
      code_language: "tsx",
      understanding_level: 3,
      flag: true,
    },
    {
      course_id: reactCourseId,
      question: "What are Server Components vs Client Components in Next.js?",
      answer:
        "Server Components render on the server and can access databases directly. Client Components run in the browser and can use hooks and interactivity. Use 'use client' directive for Client Components.",
      code_snippet: `// Server Component (default)
export default function ServerPage() {
  return <div>Server rendered</div>;
}

// Client Component
'use client';
export function ClientButton() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}`,
      code_language: "tsx",
      understanding_level: 4,
      flag: false,
    },
    {
      course_id: mongoCourseId,
      question:
        "What is the difference between find() and findOne() in MongoDB?",
      answer:
        "find() returns a cursor that can iterate over multiple documents matching the query. findOne() returns a single document or null. Use findOne() when you expect exactly one result.",
      code_snippet: `// Returns cursor
const users = await db.collection('users').find({ age: { $gt: 18 } });

// Returns single document
const user = await db.collection('users').findOne({ email: 'test@example.com' });`,
      code_language: "javascript",
      understanding_level: 4,
      flag: false,
    },
    {
      course_id: mongoCourseId,
      question: "How do you create an index in MongoDB?",
      answer:
        "Use createIndex() method with the field(s) to index. Indexes improve query performance. You can create single field, compound, or text indexes.",
      code_snippet: `// Single field index
await db.collection('users').createIndex({ email: 1 });

// Compound index
await db.collection('users').createIndex({ email: 1, age: -1 });

// Text index for search
await db.collection('articles').createIndex({ title: 'text', content: 'text' });`,
      code_language: "javascript",
      understanding_level: 3,
      flag: true,
    },
  ];
};

export function getSeedDailyEntries(): Omit<
  DailyEntry,
  "id" | "created_at" | "updated_at"
>[] {
  const entries: Omit<DailyEntry, "id" | "created_at" | "updated_at">[] = [];
  const now = new Date();

  // Create 4 varied entries over the past week
  const entryData = [
    {
      daysAgo: 6,
      time: 45,
      mood: 4,
      notes: "Started learning React hooks. useState is clearer now.",
    },
    {
      daysAgo: 4,
      time: 60,
      mood: 5,
      notes: "Built my first Next.js page. Server Components are powerful!",
    },
    {
      daysAgo: 2,
      time: 35,
      mood: 3,
      notes: "MongoDB indexes are tricky. Need to review aggregation pipeline.",
    },
    {
      daysAgo: 0,
      time: 50,
      mood: 4,
      notes:
        "Great progress today! Understanding both React and MongoDB better.",
    },
  ];

  for (const entry of entryData) {
    const date = new Date(now);
    date.setDate(date.getDate() - entry.daysAgo);
    entries.push({
      date: date.toISOString().split("T")[0],
      study_time: entry.time,
      mood: entry.mood as 1 | 2 | 3 | 4 | 5,
      notes: entry.notes,
    });
  }

  return entries;
}

/**
 * Seed data for localStorage
 */
export async function seedLocalStorageData(): Promise<void> {
  if (typeof window === "undefined") return;

  const { saveCourse, saveNote, saveDailyEntry } = await import(
    "./local-storage"
  );
  const { markStorageInitialized } = await import("@/lib/storage-mode");

  // Check if already seeded
  const { isStorageInitialized } = await import("@/lib/storage-mode");
  if (isStorageInitialized()) return;

  // Seed courses
  const courses = seedCourses.map((course) => saveCourse(course));

  // Seed notes for both courses
  if (courses.length >= 2) {
    const notes = seedNotes(courses[0].id, courses[1].id);
    notes.forEach((note) => saveNote(note));
  } else if (courses.length > 0) {
    // Fallback if only one course exists
    const notes = seedNotes(courses[0].id, courses[0].id);
    notes.forEach((note) => saveNote(note));
  }

  // Seed daily entries
  getSeedDailyEntries().forEach((entry) => saveDailyEntry(entry));

  markStorageInitialized();
}

/**
 * Seed data for Supabase (authenticated users)
 * NOTE: This function is deprecated. Use seedSupabaseDataAction from seed-actions.ts instead.
 * This is kept for backwards compatibility but should not be used in client components.
 */
export async function seedSupabaseData(): Promise<void> {
  // This function is deprecated - use the server action instead
  console.warn(
    "seedSupabaseData is deprecated. Use seedSupabaseDataAction server action instead."
  );
}
