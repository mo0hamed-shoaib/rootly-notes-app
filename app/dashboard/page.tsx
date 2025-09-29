import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { UnderstandingChart } from "@/components/understanding-chart"
import { StudyTimeChart } from "@/components/study-time-chart"
import { MoodChart } from "@/components/mood-chart"
import { CourseProgressChart } from "@/components/course-progress-chart"
import { BookOpen, Brain, Calendar, TrendingUp, Target, BarChart3 } from "lucide-react"

export default async function DashboardPage() {
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
          <Card className="flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Understanding Progress</CardTitle>
              </div>
              <CardDescription>
                Track your comprehension levels over time and identify learning trends
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <UnderstandingChart data={notesResult.data || []} />
            </CardContent>
            <CardFooter className="pt-3 pb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="h-3 w-3" />
                <span>Weekly averages based on note creation dates</span>
              </div>
            </CardFooter>
          </Card>

          {/* Study Time Chart */}
          <Card className="flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Daily Study Sessions</CardTitle>
              </div>
              <CardDescription>
                Monitor your study consistency and time investment patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <StudyTimeChart data={dailyEntriesResult.data || []} />
            </CardContent>
            <CardFooter className="pt-3 pb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Last 14 days • Build consistent study habits</span>
              </div>
            </CardFooter>
          </Card>

          {/* Mood Tracking Chart */}
          <Card className="flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Learning Mood Analysis</CardTitle>
              </div>
              <CardDescription>
                Understand how your emotional state affects your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <MoodChart data={dailyEntriesResult.data || []} />
            </CardContent>
            <CardFooter className="pt-3 pb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Brain className="h-3 w-3" />
                <span>Emotions impact learning • Track your wellbeing</span>
              </div>
            </CardFooter>
          </Card>

          {/* Course Progress Chart */}
          <Card className="flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Course Mastery Overview</CardTitle>
              </div>
              <CardDescription>
                Compare understanding levels across different courses and subjects
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <CourseProgressChart data={courseProgress || []} />
            </CardContent>
            <CardFooter className="pt-3 pb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-3 w-3" />
                <span>Top performing courses ranked by understanding level</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
