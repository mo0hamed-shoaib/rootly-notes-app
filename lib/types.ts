export interface Course {
  id: string
  instructor: string
  title: string
  links: string[]
  topics: string[]
  created_at: string
  updated_at: string
}

export interface Note {
  id: string
  course_id: string
  question: string
  answer: string
  code_snippet?: string | null
  code_language?: string | null
  understanding_level: 1 | 2 | 3 | 4 | 5
  flag: boolean
  created_at: string
  updated_at: string
  course?: Course
}

export interface DailyEntry {
  id: string
  date: string
  study_time: number // in minutes
  mood: 1 | 2 | 3 | 4 | 5
  notes: string
  created_at: string
  updated_at: string
}

export type UnderstandingLevel = 1 | 2 | 3 | 4 | 5
export type MoodLevel = 1 | 2 | 3 | 4 | 5

export type CodeLanguage =
  | "plaintext"
  | "javascript"
  | "typescript"
  | "jsx"
  | "tsx"
  | "python"
  | "java"
  | "csharp"
  | "go"
  | "ruby"
  | "php"
  | "sql"
  | "bash"
  | "json"
  | "yaml"
  | "html"
  | "css"
  | "markdown"
