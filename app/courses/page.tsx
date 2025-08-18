import { createClient } from "@/lib/supabase/server"
import { CoursesGrid } from "@/components/courses-grid"
import { AddCourseDialog } from "@/components/add-course-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function CoursesPage() {
  const supabase = await createClient()

  // Get courses with note counts
  const { data: courses, error } = await supabase
    .from("courses")
    .select(`
      *,
      notes(count)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching courses:", error)
  }

  // Transform the data to include note counts
  const coursesWithCounts =
    courses?.map((course) => ({
      ...course,
      note_count: course.notes?.[0]?.count || 0,
    })) || []

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
            <p className="text-muted-foreground">Manage your learning courses and resources</p>
          </div>
          <div />
        </div>

        {/* Add Course Button */}
        <div className="flex justify-end mb-6">
          <AddCourseDialog />
        </div>

        {/* Courses Grid */}
        {coursesWithCounts && coursesWithCounts.length > 0 ? (
          <CoursesGrid courses={coursesWithCounts} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Courses Found</CardTitle>
              <CardDescription>Start by adding your first course to organize your learning.</CardDescription>
            </CardHeader>
            <CardContent>
              <AddCourseDialog />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
