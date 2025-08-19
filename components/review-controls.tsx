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
    <div className="flex flex-wrap items-center gap-3">
      <Select value={course} onValueChange={(v) => updateParam("course", v)}>
        <SelectTrigger className="w-[200px] h-9">
          <SelectValue placeholder="All courses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All courses</SelectItem>
          {courses.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={limit} onValueChange={(v) => updateParam("limit", v === "all" ? "100" : v)}>
        <SelectTrigger className="w-[120px] h-9">
          <SelectValue placeholder="Limit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="all">All</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Switch checked={flagged} onCheckedChange={(v) => updateParam("flagged", v ? "true" : null)} id="flagged-only" />
        <Label htmlFor="flagged-only" className="text-sm">Flagged only</Label>
      </div>

      <div className="flex items-center gap-2">
        <Switch checked={shuffle} onCheckedChange={(v) => updateParam("shuffle", v ? "true" : "false")} id="shuffle" />
        <Label htmlFor="shuffle" className="text-sm">Shuffle</Label>
      </div>
    </div>
  )
}


