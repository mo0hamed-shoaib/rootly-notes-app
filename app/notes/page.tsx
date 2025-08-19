import { createClient } from "@/lib/supabase/server"
import { NotesGrid } from "@/components/notes-grid"
import { AddNoteDialog } from "@/components/add-note-dialog"
import { NotesFilters } from "@/components/notes-filters"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

interface NotesPageProps {
  searchParams: Promise<{
    course?: string
    understanding?: string
    flagged?: string
    search?: string
    page?: string
    pageSize?: string
  }>
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const resolvedSearchParams = await searchParams
  const supabase = await createClient()
  const page = Math.max(1, Number.parseInt(resolvedSearchParams.page || "1"))
  const pageSize = Math.max(1, Math.min(48, Number.parseInt(resolvedSearchParams.pageSize || "12")))
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  // Build query based on filters
  let query = supabase
    .from("notes")
    .select(
      `
      *,
      course:courses(*)
    `,
      { count: "exact" }
    )
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

  const { data: notes, count, error } = await query.range(from, to)

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
          <>
            <NotesGrid notes={notes} />
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
