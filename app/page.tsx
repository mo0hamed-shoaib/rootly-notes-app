import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UnderstandingChart } from "@/components/understanding-chart"
import { StudyTimeChart } from "@/components/study-time-chart"
import { MoodChart } from "@/components/mood-chart"
import { CourseProgressChart } from "@/components/course-progress-chart"
import { BookOpen, Brain, Calendar, TrendingUp } from "lucide-react"

export default async function HomePage() {
  const supabase = await createClient()

  // Get basic stats
  const [coursesResult, notesResult, dailyEntriesResult] = await Promise.all([
    supabase.from("courses").select("id").limit(1000),
    supabase.from("notes").select("id, understanding_level, created_at").limit(1000),
    supabase.from("daily_entries").select("study_time, date, mood").order("date", { ascending: false }).limit(30),
  ])


  // Get course progress data
  const { data: courseProgress } = await supabase
    .from("courses")
    .select(`
      id,
      title,
      notes(id, understanding_level)
    `)
    .limit(10)


  const totalCourses = coursesResult.data?.length || 0
  const totalNotes = notesResult.data?.length || 0
  const avgUnderstanding = notesResult.data?.length
    ? (notesResult.data.reduce((sum, note) => sum + note.understanding_level, 0) / notesResult.data.length).toFixed(1)
    : "0"
  const totalStudyTime = dailyEntriesResult.data?.reduce((sum, entry) => sum + entry.study_time, 0) || 0


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rootly Notes</h1>
            <p className="text-muted-foreground">Your learning journey tracker</p>
          </div>
          <div className="flex items-center gap-4"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCourses}</div>
              <p className="text-xs text-muted-foreground">Active learning paths</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalNotes}</div>
              <p className="text-xs text-muted-foreground">Questions captured</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Understanding</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgUnderstanding}/5</div>
              <p className="text-xs text-muted-foreground">Comprehension level</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Time</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(totalStudyTime / 60)}h</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Understanding Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Understanding Progress</CardTitle>
              <CardDescription>Track your comprehension levels over time</CardDescription>
            </CardHeader>
            <CardContent>
              <UnderstandingChart data={notesResult.data || []} />
            </CardContent>
          </Card>

          {/* Study Time Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Study Time</CardTitle>
              <CardDescription>Your study habits over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <StudyTimeChart data={dailyEntriesResult.data || []} />
            </CardContent>
          </Card>

          {/* Mood Tracking Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Mood Tracking</CardTitle>
              <CardDescription>How you've been feeling during your studies</CardDescription>
            </CardHeader>
            <CardContent>
              <MoodChart data={dailyEntriesResult.data || []} />
            </CardContent>
          </Card>

          {/* Course Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
              <CardDescription>Understanding distribution across your courses</CardDescription>
            </CardHeader>
            <CardContent>
              <CourseProgressChart data={courseProgress || []} />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump into your learning activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 text-center">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium">Add Note</h3>
                  <p className="text-sm text-muted-foreground">Capture a new question</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 text-center">
                  <Brain className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium">Review Notes</h3>
                  <p className="text-sm text-muted-foreground">Practice with spaced repetition</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium">Daily Entry</h3>
                  <p className="text-sm text-muted-foreground">Log today's progress</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium">View Progress</h3>
                  <p className="text-sm text-muted-foreground">Track your learning journey</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
