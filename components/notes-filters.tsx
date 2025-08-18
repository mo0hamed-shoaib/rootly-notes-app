"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Search } from "lucide-react"

interface NotesFiltersProps {
  courses: { id: string; title: string; instructor: string }[]
}

export function NotesFilters({ courses }: NotesFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentSearch = searchParams.get("search") || ""
  const currentCourse = searchParams.get("course") || "all"
  const currentUnderstanding = searchParams.get("understanding") || "all"
  const currentFlagged = searchParams.get("flagged") || "all"

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/notes?${params.toString()}`)
  }

  const clearAllFilters = () => {
    router.push("/notes")
  }

  const hasActiveFilters =
    currentSearch || currentCourse !== "all" || currentUnderstanding !== "all" || currentFlagged !== "all"

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search questions and answers..."
          value={currentSearch}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={currentCourse} onValueChange={(value) => updateFilter("course", value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All courses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All courses</SelectItem>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={currentUnderstanding} onValueChange={(value) => updateFilter("understanding", value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Understanding level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
            <SelectItem value="1">1 - Confused</SelectItem>
            <SelectItem value="2">2 - Unclear</SelectItem>
            <SelectItem value="3">3 - Getting It</SelectItem>
            <SelectItem value="4">4 - Clear</SelectItem>
            <SelectItem value="5">5 - Crystal Clear</SelectItem>
          </SelectContent>
        </Select>

        <Select value={currentFlagged} onValueChange={(value) => updateFilter("flagged", value)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All notes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All notes</SelectItem>
            <SelectItem value="true">Flagged only</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearAllFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {currentSearch && (
            <Badge variant="secondary">
              Search: {currentSearch}
              <button
                onClick={() => updateFilter("search", "")}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentCourse !== "all" && (
            <Badge variant="secondary">
              Course: {courses.find((c) => c.id === currentCourse)?.title}
              <button
                onClick={() => updateFilter("course", "all")}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentUnderstanding !== "all" && (
            <Badge variant="secondary">
              Level: {currentUnderstanding}
              <button
                onClick={() => updateFilter("understanding", "all")}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentFlagged !== "all" && (
            <Badge variant="secondary">
              Flagged only
              <button
                onClick={() => updateFilter("flagged", "all")}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
