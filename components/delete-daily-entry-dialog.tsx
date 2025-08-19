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
import { supabase } from "@/lib/supabase/client"
import { Loader2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import type { DailyEntry } from "@/lib/types"

interface DeleteDailyEntryDialogProps {
  entry: DailyEntry
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteDailyEntryDialog({ entry, open, onOpenChange }: DeleteDailyEntryDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const { error } = await supabase.from("daily_entries").delete().eq("id", entry.id)

      if (error) throw error

      toast.success("Daily entry deleted successfully", {
        description: "The entry has been permanently removed.",
      })

      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Error deleting daily entry:", error)
      toast.error("Error deleting daily entry", {
        description: "Please try again.",
      })
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
            Delete Daily Entry
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this daily entry? This action cannot be undone.
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
          <p className="text-sm text-muted-foreground">{Math.round((entry.study_time / 60) * 10) / 10} hours</p>
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
