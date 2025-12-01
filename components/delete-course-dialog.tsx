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
import type { Course } from "@/lib/types"
import { useCourseMutations } from "@/hooks/use-mutations"

interface DeleteCourseDialogProps {
  course: Course
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteCourseDialog({ course, open, onOpenChange }: DeleteCourseDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { deleteCourse } = useCourseMutations()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteCourse(course.id)
      onOpenChange(false)
    } catch (error) {
      // Error is handled by the mutation hook
      console.error("Error deleting course:", error)
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
            Delete Course
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this course? This will also delete all associated notes. This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm font-medium mb-1">Course:</p>
          <p className="text-sm text-muted-foreground">{course.title}</p>
          <p className="text-sm text-muted-foreground">by {course.instructor}</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Delete Course
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
