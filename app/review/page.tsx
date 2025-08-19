import { createClient } from "@/lib/supabase/server"
import { ReviewSession } from "@/components/review-session"
import { ReviewControls } from "@/components/review-controls"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/empty-state"
import { FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Brain, Flag, Shuffle } from "lucide-react"
import Link from "next/link"

interface ReviewPageProps {
  searchParams: Promise<{
    course?: string
    flagged?: string
    shuffle?: string
    limit?: string
  }>
}

export default async function ReviewPage({ searchParams }: ReviewPageProps) {
  const supabase = await createClient()
  const params = await searchParams

  const limit = Math.max(1, Math.min(100, Number.parseInt(params.limit || "20")))
  const shuffle = (params.shuffle ?? "true") === "true"
  const SAMPLE_SIZE = Math.max(100, Math.min(500, limit * 5))

  // Build base query for practice
  let query = supabase
    .from("notes")
    .select(`
      *,
      course:courses(title, instructor)
    `)
    .order("updated_at", { ascending: false })

  if (params.course) {
    query = query.eq("course_id", params.course)
  }
  if (params.flagged === "true") {
    query = query.eq("flag", true)
  }

  // Apply a server-side limit to avoid fetching all rows
  const effectiveLimit = shuffle ? SAMPLE_SIZE : limit
  const { data: fetchedNotes, error } = await query.limit(effectiveLimit)
  if (error) {
    console.error("Error fetching notes for practice:", error)
  }

  const notes = fetchedNotes || []
  const sessionNotes = (shuffle ? [...notes].sort(() => Math.random() - 0.5) : notes).slice(0, limit)
  const flaggedInSession = sessionNotes.filter((n) => n.flag).length

  // Fetch courses for controls
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, instructor")
    .order("title")

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Practice Session</h1>
            <p className="text-muted-foreground">Quick quiz on your notes. Start anytime.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/notes">Manage Notes</Link>
            </Button>
          </div>
        </div>

        {/* Quick Controls */}
        <div className="mb-6">
          <ReviewControls courses={courses || []} />
        </div>

        {/* Session Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Session</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sessionNotes.length}</div>
              <p className="text-xs text-muted-foreground">Selected notes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Flagged</CardTitle>
              <Flag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{flaggedInSession}</div>
              <p className="text-xs text-muted-foreground">Priority items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Order</CardTitle>
              <Shuffle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{shuffle ? "Shuffled" : "Fixed"}</div>
              <p className="text-xs text-muted-foreground">Practice order</p>
            </CardContent>
          </Card>
        </div>

        {/* Practice Session */}
        {sessionNotes.length > 0 ? (
          <ReviewSession notes={sessionNotes} />
        ) : (
          <EmptyState
            title="No notes available"
            description="Add notes first, or adjust filters to include more content for practice."
            icon={<FileQuestion className="h-6 w-6 text-muted-foreground" />}
            primaryAction={{ label: 'Add Notes', href: '/notes' }}
          />
        )}
      </div>
    </div>
  )
}
