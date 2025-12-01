"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useMemo } from "react"
import { DailyEntriesGrid } from "@/components/daily-entries-grid"
import { AddDailyEntryDialog } from "@/components/add-daily-entry-dialog"
import { EmptyState } from "@/components/empty-state"
import { CalendarX } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useDailyEntries } from "@/hooks/use-data"
import { DailyEntriesGridSkeleton } from "@/components/loading-skeletons"
import type React from "react"

const PAGE_SIZE = 12

function DailyPageContent() {
  const searchParams = useSearchParams()
  const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1"))

  const { entries, isLoading } = useDailyEntries()

  // Client-side pagination
  const paginatedEntries = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return entries.slice(start, end)
  }, [entries, page])

  const totalPages = Math.ceil(entries.length / PAGE_SIZE)

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
    return <DailyEntriesGridSkeleton />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Daily Tracking</h1>
            <p className="text-muted-foreground">Track your daily study progress and mood</p>
          </div>
          <div />
        </div>

        {/* Add Entry Button */}
        <div className="flex justify-end mb-6">
          <div className="w-full sm:w-auto">
            <AddDailyEntryDialog />
          </div>
        </div>

        {/* Daily Tracking Grid */}
        {paginatedEntries.length > 0 ? (
          <>
            <DailyEntriesGrid entries={paginatedEntries} />
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
            title="No Daily Tracking Found"
            description="Start tracking your daily study progress and mood."
            icon={<CalendarX className="h-6 w-6 text-muted-foreground" />}
            actionSlot={<AddDailyEntryDialog />}
          />
        )}
      </div>
    </div>
  )
}

export default function DailyPage() {
  return (
    <Suspense
      fallback={<DailyEntriesGridSkeleton />}
    >
      <DailyPageContent />
    </Suspense>
  )
}
