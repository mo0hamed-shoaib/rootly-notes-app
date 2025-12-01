"use client"

import { useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface ReviewControlsProps {
  courses: { id: string; title: string; instructor: string }[]
}

export function ReviewControls({ courses }: ReviewControlsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const params = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams])
  const course = params.get("course") || "all"
  const flagged = (params.get("flagged") || "false") === "true"
  const shuffle = (params.get("shuffle") || "true") === "true"
  const limit = params.get("limit") || "20"

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value && value !== "" && value !== "all") {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    router.push(`/review?${next.toString()}`)
  }

  return (
    <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-3">
      <Select value={course} onValueChange={(v) => updateParam("course", v)}>
        <SelectTrigger className="w-full sm:w-[200px] h-9" aria-label={`Course filter: ${course === "all" ? "All courses" : courses.find(c => c.id === course)?.title || "All courses"}`}>
          <SelectValue placeholder="All courses" aria-label="Filter by course" />
        </SelectTrigger>
        <SelectContent className="w-[calc(100vw-2rem)] max-w-[300px] sm:max-w-[300px]">
          <SelectItem value="all">All courses</SelectItem>
          {courses.map((c) => (
            <SelectItem key={c.id} value={c.id} className="w-full">
              <div className="truncate w-full text-left" title={c.title}>
                {c.title}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={limit} onValueChange={(v) => updateParam("limit", v === "all" ? "100" : v)}>
        <SelectTrigger className="w-full sm:w-[120px] h-9" aria-label={`Limit: ${limit === "all" ? "All" : limit} notes`}>
          <SelectValue placeholder="Limit" aria-label="Limit number of notes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="all">All</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-start">
        <Switch checked={flagged} onCheckedChange={(v) => updateParam("flagged", v ? "true" : null)} id="flagged-only" />
        <Label htmlFor="flagged-only" className="text-sm">Flagged only</Label>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-start">
        <Switch checked={shuffle} onCheckedChange={(v) => updateParam("shuffle", v ? "true" : "false")} id="shuffle" />
        <Label htmlFor="shuffle" className="text-sm">Shuffle</Label>
      </div>
    </div>
  )
}


