"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useMemo } from "react"
import { CoursesGrid } from "@/components/courses-grid"
import { AddCourseDialog } from "@/components/add-course-dialog"
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
import { useCourses } from "@/hooks/use-data"
import { useNotes } from "@/hooks/use-data"
import type React from "react"

const PAGE_SIZE = 12

function CoursesPageContent() {
  const searchParams = useSearchParams()
  const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1"))

  const { courses, isLoading } = useCourses()
  const { notes } = useNotes()

  // Calculate note counts for each course
  const coursesWithCounts = useMemo(() => {
    return courses.map((course) => ({
      ...course,
      note_count: notes.filter((note) => note.course_id === course.id).length,
    }))
  }, [courses, notes])

  // Client-side pagination
  const paginatedCourses = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return coursesWithCounts.slice(start, end)
  }, [coursesWithCounts, page])

  const totalPages = Math.ceil(coursesWithCounts.length / PAGE_SIZE)

  const buildPageHref = (targetPage: number) => {
    const sp = new URLSearchParams()
    sp.set("page", String(targetPage))
    return `?${sp.toString()}`
  }

  const renderPageItems = () => {
    const items: React.ReactNode[] = []
    const pushPage = (p: number) => {
      items.push(
        <PaginationItem key={p}>
          <PaginationLink href={buildPageHref(p)} isActive={p === page}>
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

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
        {paginatedCourses.length > 0 ? (
          <>
            <CoursesGrid courses={paginatedCourses} />
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    {page > 1 && (
                      <PaginationItem>
                        <PaginationPrevious href={buildPageHref(page - 1)} />
                      </PaginationItem>
                    )}
                    {renderPageItems()}
                    {page < totalPages && (
                      <PaginationItem>
                        <PaginationNext href={buildPageHref(page + 1)} />
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

export default function CoursesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-6 max-w-6xl">
            <div className="flex items-center justify-center min-h-[400px]">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <CoursesPageContent />
    </Suspense>
  )
}
