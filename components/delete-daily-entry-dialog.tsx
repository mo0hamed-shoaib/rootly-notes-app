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
import { formatStudyTime } from "@/lib/time-utils"
import type { DailyEntry } from "@/lib/types"
import { useDailyEntryMutations } from "@/hooks/use-mutations"

interface DeleteDailyEntryDialogProps {
  entry: DailyEntry
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteDailyEntryDialog({ entry, open, onOpenChange }: DeleteDailyEntryDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { deleteDailyEntry } = useDailyEntryMutations()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteDailyEntry(entry.id)
      onOpenChange(false)
    } catch (error) {
      // Error is handled by the mutation hook
      console.error("Error deleting daily tracking:", error)
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
            Delete Daily Tracking
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this daily tracking? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm font-medium mb-1">Date:</p>
          <p className="text-sm text-muted-foreground mb-2">
            {new Date(entry.date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p className="text-sm font-medium mb-1">Study Time:</p>
          <p className="text-sm text-muted-foreground">{formatStudyTime(entry.study_time)}</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Delete Entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
