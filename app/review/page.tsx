import { createClient } from "@/lib/supabase/server"
import { ReviewSession } from "@/components/review-session"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Clock, Flag, TrendingUp } from "lucide-react"
import Link from "next/link"

export default async function ReviewPage() {
  const supabase = await createClient()

  // Get notes that need review based on spaced repetition logic
  const { data: reviewNotes, error } = await supabase
    .from("notes")
    .select(`
      *,
      course:courses(title, instructor)
    `)
    .order("updated_at", { ascending: true })

  if (error) {
    console.error("Error fetching review notes:", error)
  }

  // Filter notes that need review based on spaced repetition intervals
  const notesForReview =
    reviewNotes?.filter((note) => {
      const daysSinceUpdate = Math.floor((Date.now() - new Date(note.updated_at).getTime()) / (1000 * 60 * 60 * 24))

      // Spaced repetition intervals based on understanding level
      const intervals = {
        1: 1, // Confused - review daily
        2: 2, // Unclear - review every 2 days
        3: 4, // Getting it - review every 4 days
        4: 7, // Clear - review weekly
        5: 14, // Crystal clear - review bi-weekly
      }

      const requiredInterval = intervals[note.understanding_level as keyof typeof intervals]
      return daysSinceUpdate >= requiredInterval
    }) || []

  // Prioritize flagged notes and lower understanding levels
  const prioritizedNotes = notesForReview.sort((a, b) => {
    if (a.flag && !b.flag) return -1
    if (!a.flag && b.flag) return 1
    return a.understanding_level - b.understanding_level
  })

  // Get review statistics
  const totalNotes = reviewNotes?.length || 0
  const flaggedNotes = reviewNotes?.filter((note) => note.flag).length || 0
  const lowUnderstanding = reviewNotes?.filter((note) => note.understanding_level <= 2).length || 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Review Session</h1>
            <p className="text-muted-foreground">Reinforce your learning with spaced repetition</p>
          </div>
          <div />
        </div>

        {/* Review Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Due for Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{prioritizedNotes.length}</div>
              <p className="text-xs text-muted-foreground">Notes ready to review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalNotes}</div>
              <p className="text-xs text-muted-foreground">In your collection</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Flagged</CardTitle>
              <Flag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{flaggedNotes}</div>
              <p className="text-xs text-muted-foreground">Priority review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Need Focus</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowUnderstanding}</div>
              <p className="text-xs text-muted-foreground">Low understanding</p>
            </CardContent>
          </Card>
        </div>

        {/* Review Session */}
        {prioritizedNotes.length > 0 ? (
          <ReviewSession notes={prioritizedNotes} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Notes Due for Review</CardTitle>
              <CardDescription>
                Great job! You're up to date with your reviews. Check back later or add more notes to continue learning.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>Your next reviews will be available based on spaced repetition intervals:</p>
                <ul className="mt-2 space-y-1 ml-4">
                  <li>• Confused (Level 1): Daily review</li>
                  <li>• Unclear (Level 2): Every 2 days</li>
                  <li>• Getting It (Level 3): Every 4 days</li>
                  <li>• Clear (Level 4): Weekly</li>
                  <li>• Crystal Clear (Level 5): Bi-weekly</li>
                </ul>
              </div>
              <div className="flex gap-3">
                <Button asChild>
                  <Link href="/notes">Add More Notes</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Back to Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
