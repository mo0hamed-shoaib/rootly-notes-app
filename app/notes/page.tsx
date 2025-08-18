import { createClient } from "@/lib/supabase/server"
import { NotesGrid } from "@/components/notes-grid"
import { AddNoteDialog } from "@/components/add-note-dialog"
import { NotesFilters } from "@/components/notes-filters"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface NotesPageProps {
  searchParams: Promise<{
    course?: string
    understanding?: string
    flagged?: string
    search?: string
  }>
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const resolvedSearchParams = await searchParams
  const supabase = await createClient()

  // Build query based on filters
  let query = supabase
    .from("notes")
    .select(`
      *,
      course:courses(*)
    `)
    .order("created_at", { ascending: false })

  // Apply filters
  if (resolvedSearchParams.course) {
    query = query.eq("course_id", resolvedSearchParams.course)
  }
  if (resolvedSearchParams.understanding) {
    query = query.eq("understanding_level", Number.parseInt(resolvedSearchParams.understanding))
  }
  if (resolvedSearchParams.flagged === "true") {
    query = query.eq("flag", true)
  }
  if (resolvedSearchParams.search) {
    query = query.or(`question.ilike.%${resolvedSearchParams.search}%,answer.ilike.%${resolvedSearchParams.search}%`)
  }

  const { data: notes, error } = await query

  // Get courses for filter dropdown
  const { data: courses } = await supabase.from("courses").select("id, title, instructor").order("title")

  if (error) {
    console.error("Error fetching notes:", error)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
            <p className="text-muted-foreground">Manage your learning questions and answers</p>
          </div>
          <div />
        </div>

        {/* Filters and Add Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <NotesFilters courses={courses || []} />
          </div>
          <AddNoteDialog courses={courses || []} />
        </div>

        {/* Notes Grid */}
        {notes && notes.length > 0 ? (
          <NotesGrid notes={notes} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Notes Found</CardTitle>
              <CardDescription>
                {resolvedSearchParams.search ||
                resolvedSearchParams.course ||
                resolvedSearchParams.understanding ||
                resolvedSearchParams.flagged
                  ? "Try adjusting your filters to see more notes."
                  : "Start by adding your first learning question."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddNoteDialog courses={courses || []} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
