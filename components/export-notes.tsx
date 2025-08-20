"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileJson, Printer } from "lucide-react"
import type { Note } from "@/lib/types"

interface ExportNotesButtonProps {
  notes: (Note & { course?: { id: string; title: string; instructor: string } })[]
}

export function ExportNotesButton({ notes }: ExportNotesButtonProps) {
  const filenameBase = useMemo(() => {
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, "0")
    return `notes_${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(
      now.getMinutes()
    )}-${pad(now.getSeconds())}`
  }, [])

  const download = (data: BlobPart, mime: string, name: string) => {
    const blob = new Blob([data], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const handleDownloadJSON = () => {
    const cleaned = notes.map((n) => ({
      id: n.id,
      course_id: n.course_id,
      course_title: n.course?.title ?? null,
      question: n.question,
      answer: n.answer,
      code_snippet: n.code_snippet ?? null,
      code_language: n.code_language ?? null,
      understanding_level: n.understanding_level,
      flag: n.flag,
      created_at: n.created_at,
      updated_at: n.updated_at,
    }))
    download(JSON.stringify(cleaned, null, 2), "application/json", `${filenameBase}.json`)
  }

  // CSV export intentionally removed

  const handlePrint = () => {
    // Trigger native print dialog; styles are handled by page-level print CSS
    window.print()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleDownloadJSON}>
          <FileJson className="h-4 w-4 mr-2" />
          Download JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


