"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UnderstandingBadge } from "@/components/understanding-badge"
import { EditNoteDialog } from "@/components/edit-note-dialog"
import { DeleteNoteDialog } from "@/components/delete-note-dialog"
import { Edit, Trash2, Flag, Calendar, CodeXml, Eye, EyeOff } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CodeSnippetDialog } from "@/components/code-snippet-dialog"
import type { Note } from "@/lib/types"
import { useEditingGuard } from "@/hooks/use-editing-guard"

interface NotesGridProps {
  notes: (Note & { course?: { id: string; title: string; instructor: string } })[]
  highlight?: string
}

function escapeRegExp(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function renderWithHighlight(text: string, query?: string) {
  if (!query) return text
  const trimmed = query.trim()
  if (!trimmed) return text
  const regex = new RegExp(`(${escapeRegExp(trimmed)})`, "ig")
  const parts = text.split(regex)
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <mark
        key={index}
        className="bg-amber-200/80 dark:bg-amber-200/80 ring-1 ring-amber-500/30 dark:ring-amber-500/30 rounded px-0.5"
      >
        {part}
      </mark>
    ) : (
      <span key={index}>{part}</span>
    )
  )
}

export function NotesGrid({ notes, highlight }: NotesGridProps) {
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [deletingNote, setDeletingNote] = useState<Note | null>(null)
  const [snippetNote, setSnippetNote] = useState<Note | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isSnippetOpen, setIsSnippetOpen] = useState(false)
  const { guardAction } = useEditingGuard()
  
  // Answer visibility state
  const [showAnswersByDefault, setShowAnswersByDefault] = useState(false)
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set())

  // Listen for global toggle changes
  useEffect(() => {
    const handleGlobalToggle = () => {
      const toggleBtn = document.getElementById('toggle-answers-btn')
      if (toggleBtn) {
        const showAnswers = toggleBtn.getAttribute('data-show-answers') === 'true'
        setShowAnswersByDefault(showAnswers)
        
        if (showAnswers) {
          // Show all answers
          setExpandedNotes(new Set(notes.map(note => note.id)))
        } else {
          // Hide all answers (default state)
          setExpandedNotes(new Set())
        }
      }
    }

    // Initial state - ensure answers are hidden by default
    handleGlobalToggle()

    // Listen for attribute changes
    const observer = new MutationObserver(handleGlobalToggle)
    const toggleBtn = document.getElementById('toggle-answers-btn')
    if (toggleBtn) {
      observer.observe(toggleBtn, { attributes: true, attributeFilter: ['data-show-answers'] })
    }

    return () => observer.disconnect()
  }, [notes])

  const toggleAnswer = (noteId: string) => {
    setExpandedNotes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(noteId)) {
        newSet.delete(noteId)
      } else {
        newSet.add(noteId)
      }
      return newSet
    })
  }

  const isAnswerVisible = (noteId: string) => {
    return expandedNotes.has(noteId)
  }

  return (
    <>
      <div className="notes-grid grid grid-cols-1 lg:grid-cols-2 gap-6">
        {notes.map((note) => (
          <Card 
            data-print-card 
            id={`note-${note.id}`} 
            key={note.id} 
            className="relative flex flex-col h-full"
          >
            <CardHeader className="pb-3 flex-shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Question */}
                  <h2 className="text-lg font-semibold leading-tight mb-2">
                    {renderWithHighlight(note.question, highlight)}
                  </h2>

                  {/* Course info */}
                  {note.course && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span>{note.course.title}</span>
                      <span>•</span>
                      <span>{note.course.instructor}</span>
                    </div>
                  )}
                </div>

                {/* Actions (hidden on print) */}
                <div className="note-actions flex items-center gap-1 flex-shrink-0">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAnswer(note.id)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                          aria-label={isAnswerVisible(note.id) ? "Hide answer" : "Show answer"}
                        >
                          {isAnswerVisible(note.id) ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isAnswerVisible(note.id) ? "Hide answer" : "Show answer"}
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 w-8 p-0 ${note.code_snippet ? "text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300" : "text-muted-foreground"}`}
                            onClick={() => {
                              if (note.code_snippet) {
                                setSnippetNote(note)
                                setIsSnippetOpen(true)
                              }
                            }}
                            disabled={!note.code_snippet}
                            aria-label={note.code_snippet ? "View code snippet" : "No code snippet"}
                          >
                            <CodeXml className="h-4 w-4" />
                          </Button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {note.code_snippet ? "View code snippet" : "No code snippet"}
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => guardAction("edit note", () => { setEditingNote(note); setIsEditOpen(true) })}
                          className="h-8 w-8 p-0"
                          aria-label="Edit note"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit note</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => guardAction("delete note", () => { setDeletingNote(note); setIsDeleteOpen(true) })}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          aria-label="Delete note"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete note</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Badges */}
              <div className="note-badges flex items-center gap-2 flex-wrap">
                <UnderstandingBadge level={note.understanding_level} />
                {note.code_snippet && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="text-violet-700 border-violet-700 dark:text-violet-400 dark:border-violet-400">
                          <CodeXml className="h-3 w-3 mr-1" />
                          Has Snippet
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>Has code snippet</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {note.flag && (
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    <Flag className="h-3 w-3 mr-1" />
                    Flagged
                  </Badge>
                )}
                <Badge variant="outline" className="text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(note.created_at).toLocaleDateString()}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col justify-end">
              {/* Answer - Always rendered but conditionally visible */}
              {isAnswerVisible(note.id) ? (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Answer:</h4>
                  <p className="text-sm leading-relaxed">
                    {note.answer
                      ? renderWithHighlight(note.answer, highlight)
                      : <span className="italic text-muted-foreground">No answer yet</span>}
                  </p>
                </div>
              ) : (
                <>
                  {/* Placeholder when answer is hidden - now aligned consistently */}
                  <div className="bg-muted/30 p-4 rounded-lg text-center text-muted-foreground text-sm print:hidden">
                    Click the eye icon to reveal answer
                  </div>
                  
                  {/* Hidden answer content for print */}
                  <div className="hidden print:block space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Answer:</h4>
                    <p className="text-sm leading-relaxed">
                      {note.answer
                        ? renderWithHighlight(note.answer, highlight)
                        : <span className="italic text-muted-foreground">No answer yet</span>}
                    </p>
                    
                    {/* Code snippet - only visible in print */}
                    {note.code_snippet && (
                      <div className="code-snippet-container">
                        <div className="code-snippet-label">Code Snippet:</div>
                        {note.code_language && note.code_language !== "plaintext" && (
                          <div className="code-language">Language: {note.code_language}</div>
                        )}
                        <pre className="text-sm">
                          <code>{note.code_snippet}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      {editingNote && (
        <EditNoteDialog
          note={editingNote}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
        />
      )}

      {/* Delete Dialog */}
      {deletingNote && (
        <DeleteNoteDialog
          note={deletingNote}
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
        />
      )}

      {/* Code Snippet Dialog */}
      {snippetNote && (
        <CodeSnippetDialog
          open={isSnippetOpen}
          onOpenChange={setIsSnippetOpen}
          code={snippetNote.code_snippet || ""}
          language={snippetNote.code_language || "plaintext"}
        />
      )}
    </>
  )
}