"use client"

import { useState } from "react"
 
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
 
import { Loader2, AlertTriangle } from "lucide-react"
import type { Note } from "@/lib/types"
import { useNoteMutations } from "@/hooks/use-mutations"

interface DeleteNoteDialogProps {
  note: Note
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteNoteDialog({ note, open, onOpenChange }: DeleteNoteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { deleteNote } = useNoteMutations()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteNote(note.id)
      onOpenChange(false)
    } catch (error) {
      // Error is handled by the mutation hook
      console.error("Error deleting note:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Note
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this note? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm font-medium mb-1">Question:</p>
          <p className="text-sm text-muted-foreground line-clamp-3">{note.question}</p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Delete Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
