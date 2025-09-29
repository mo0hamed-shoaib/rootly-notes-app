import { createClient } from "@/lib/supabase/server"
import { CoursesGrid } from "@/components/courses-grid"
import { AddCourseDialog } from "@/components/add-course-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/empty-state"
import { GraduationCap } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type React from "react"

interface CoursesPageProps {
  searchParams: Promise<{
    page?: string
    pageSize?: string
  }>
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const supabase = await createClient()
  const resolvedSearchParams = await searchParams
  const page = Math.max(1, Number.parseInt(resolvedSearchParams.page || "1"))
  const pageSize = Math.max(1, Math.min(48, Number.parseInt(resolvedSearchParams.pageSize || "12")))
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  // Get courses with note counts
  const { data: courses, count, error } = await supabase
    .from("courses")
    .select(
      `
      *,
      notes(count)
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to)

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
          <div className="w-full sm:w-auto">
            <AddCourseDialog />
          </div>
        </div>

        {/* Courses Grid */}
        {coursesWithCounts && coursesWithCounts.length > 0 ? (
          <>
            <CoursesGrid courses={coursesWithCounts} />
            {typeof count === "number" && count > pageSize && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    {page > 1 && (
                      <PaginationItem>
                        <PaginationPrevious href={`?${buildPageHref(resolvedSearchParams, page - 1, pageSize)}`} />
                      </PaginationItem>
                    )}
                    {renderPageItems(count, page, pageSize, resolvedSearchParams)}
                    {page < Math.ceil(count / pageSize) && (
                      <PaginationItem>
                        <PaginationNext href={`?${buildPageHref(resolvedSearchParams, page + 1, pageSize)}`} />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="No Courses Found"
            description="Start by adding your first course to organize your learning."
            icon={<GraduationCap className="h-6 w-6 text-muted-foreground" />}
            actionSlot={<AddCourseDialog />}
          />
        )}
      </div>
    </div>
  )
}

function buildPageHref(
  params: Record<string, string | undefined>,
  targetPage: number,
  pageSize: number
) {
  const sp = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (!value) continue
    if (key === "page" || key === "pageSize") continue
    sp.set(key, value)
  }
  sp.set("page", String(targetPage))
  sp.set("pageSize", String(pageSize))
  return sp.toString()
}

function renderPageItems(
  totalCount: number,
  page: number,
  pageSize: number,
  params: Record<string, string | undefined>
) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const items: React.ReactNode[] = []
  const pushPage = (p: number) => {
    items.push(
      <PaginationItem key={p}>
        <PaginationLink href={`?${buildPageHref(params, p, pageSize)}`} isActive={p === page}>
          {p}
        </PaginationLink>
      </PaginationItem>
    )
  }
  if (totalPages <= 7) {
    for (let p = 1; p <= totalPages; p++) pushPage(p)
  } else {
    pushPage(1)
    if (page > 3) items.push(<PaginationEllipsis key="start-ellipsis" />)
    const start = Math.max(2, page - 1)
    const end = Math.min(totalPages - 1, page + 1)
    for (let p = start; p <= end; p++) pushPage(p)
    if (page < totalPages - 2) items.push(<PaginationEllipsis key="end-ellipsis" />)
    pushPage(totalPages)
  }
  return items
}
