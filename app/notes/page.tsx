"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"
import { NotesGrid } from "@/components/notes-grid"
import { AddNoteDialog } from "@/components/add-note-dialog"
import { AddCourseDialog } from "@/components/add-course-dialog"
import { NotesFilters } from "@/components/notes-filters"
import { ExportNotesButton } from "@/components/export-notes"
import { EmptyState } from "@/components/empty-state"
import { FileQuestion, BookOpen } from "lucide-react"
import { NotesPrintStyles } from "@/components/notes-print-styles"
import { ToggleAnswersButton } from "@/components/toggle-answers-button"
import { useNotes } from "@/hooks/use-data"
import { useCourses } from "@/hooks/use-data"
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

const PAGE_SIZE = 12

function NotesPageContent() {
  const searchParams = useSearchParams()
  const course = searchParams.get("course") || undefined
  const understanding = searchParams.get("understanding")
  const flagged = searchParams.get("flagged")
  const search = searchParams.get("search") || undefined
  const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1"))

  const filters = useMemo(
    () => ({
      courseId: course,
      understandingLevel: understanding ? Number.parseInt(understanding) : undefined,
      flagged: flagged === "true" ? true : flagged === "false" ? false : undefined,
      search,
    }),
    [course, understanding, flagged, search]
  )

  const { notes, isLoading } = useNotes(filters)
  const { courses } = useCourses()

  // Client-side pagination
  const paginatedNotes = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return notes.slice(start, end)
  }, [notes, page])

  const totalPages = Math.ceil(notes.length / PAGE_SIZE)

  const buildPageHref = (targetPage: number) => {
    const sp = new URLSearchParams()
    if (course) sp.set("course", course)
    if (understanding) sp.set("understanding", understanding)
    if (flagged) sp.set("flagged", flagged)
    if (search) sp.set("search", search)
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
      <div className="notes-page min-h-screen bg-background">
        <NotesPrintStyles />
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="notes-page min-h-screen bg-background">
      <NotesPrintStyles />
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="notes-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
            <p className="text-muted-foreground">Manage your learning questions and answers</p>
          </div>
          <div />
        </div>

        {/* Filters and Add Button */}
        <div className="notes-controls flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
          <div className="flex-1">
            <NotesFilters courses={courses} />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 justify-center sm:justify-end">
            <div className="w-full sm:w-auto">
              {courses.length > 0 ? <AddNoteDialog courses={courses} /> : <AddCourseDialog />}
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
              <ToggleAnswersButton />
              <ExportNotesButton notes={notes} />
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        {paginatedNotes.length > 0 ? (
          <>
            <NotesGrid notes={paginatedNotes} highlight={search} />
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
            title={courses.length > 0 ? "No Notes Found" : "No Courses Yet"}
            description={
              courses.length > 0
                ? search || course || understanding || flagged
                  ? "Try adjusting your filters to see more notes."
                  : "Start by adding your first learning question."
                : "You need to create a course before you can add notes. Notes are organized by courses to help you track your learning progress."
            }
            icon={
              courses.length > 0 ? (
                <FileQuestion className="h-6 w-6 text-muted-foreground" />
              ) : (
                <BookOpen className="h-6 w-6 text-muted-foreground" />
              )
            }
            actionSlot={courses.length > 0 ? <AddNoteDialog courses={courses} /> : <AddCourseDialog />}
          />
        )}
      </div>
    </div>
  )
}

export default function NotesPage() {
  return (
    <Suspense
      fallback={
        <div className="notes-page min-h-screen bg-background">
          <NotesPrintStyles />
          <div className="container mx-auto px-4 py-6 max-w-6xl">
            <div className="flex items-center justify-center min-h-[400px]">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <NotesPageContent />
    </Suspense>
  )
}
