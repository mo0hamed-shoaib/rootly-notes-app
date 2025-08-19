"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UnderstandingBadge } from "@/components/understanding-badge"
import { EditNoteDialog } from "@/components/edit-note-dialog"
import { DeleteNoteDialog } from "@/components/delete-note-dialog"
import { Edit, Trash2, Flag, Calendar } from "lucide-react"
import type { Note } from "@/lib/types"

interface NotesGridProps {
  notes: (Note & { course?: { id: string; title: string; instructor: string } })[]
}

export function NotesGrid({ notes }: NotesGridProps) {
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [deletingNote, setDeletingNote] = useState<Note | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {notes.map((note) => (
          <Card id={`note-${note.id}`} key={note.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Question - Full display, no truncation */}
                  <h3 className="text-lg font-semibold leading-tight mb-2">{note.question}</h3>

                  {/* Course info */}
                  {note.course && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span>{note.course.title}</span>
                      <span>•</span>
                      <span>{note.course.instructor}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setEditingNote(note)} className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingNote(note)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <UnderstandingBadge level={note.understanding_level} />
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

            <CardContent>
              {/* Answer */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Answer:</h4>
                <p className="text-sm leading-relaxed">
                  {note.answer || <span className="italic text-muted-foreground">No answer yet</span>}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      {editingNote && (
        <EditNoteDialog
          note={editingNote}
          open={!!editingNote}
          onOpenChange={(open) => !open && setEditingNote(null)}
        />
      )}

      {/* Delete Dialog */}
      {deletingNote && (
        <DeleteNoteDialog
          note={deletingNote}
          open={!!deletingNote}
          onOpenChange={(open) => !open && setDeletingNote(null)}
        />
      )}
    </>
  )
}
