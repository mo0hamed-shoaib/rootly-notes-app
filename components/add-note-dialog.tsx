"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { supabase } from "@/lib/supabase/client"
import { Plus, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const noteSchema = z.object({
  course_id: z.string().min(1, "Please select a course"),
  question: z.string().min(1, "Question is required").max(1000, "Question must be less than 1000 characters"),
  answer: z.string().max(2000, "Answer must be less than 2000 characters").optional(),
  understanding_level: z.coerce.number().min(1).max(5),
  flag: z.boolean(),
})

type NoteFormData = z.infer<typeof noteSchema>

interface AddNoteDialogProps {
  courses: { id: string; title: string; instructor: string }[]
}

export function AddNoteDialog({ courses }: AddNoteDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      course_id: "",
      question: "",
      answer: "",
      understanding_level: 3,
      flag: false,
    },
  })

  const onSubmit = async (data: NoteFormData) => {
    setIsSubmitting(true)
    try {
      const { error } = await supabase.from("notes").insert([
        {
          course_id: data.course_id,
          question: data.question,
          answer: data.answer || "",
          understanding_level: data.understanding_level,
          flag: data.flag,
        },
      ])

      if (error) throw error

      toast({
        title: "Note added successfully",
        description: "Your learning question has been saved.",
      })

      form.reset()
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error adding note:", error)
      toast({
        title: "Error adding note",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Note
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Note</DialogTitle>
          <DialogDescription>Capture a new learning question and track your understanding.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="course_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title} - {course.instructor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What question are you trying to answer?"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Your current understanding or answer..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="understanding_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Understanding Level</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number.parseInt(value))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1 - Confused</SelectItem>
                        <SelectItem value="2">2 - Unclear</SelectItem>
                        <SelectItem value="3">3 - Getting It</SelectItem>
                        <SelectItem value="4">4 - Clear</SelectItem>
                        <SelectItem value="5">5 - Crystal Clear</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="flag"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Flag for review</FormLabel>
                      <p className="text-sm text-muted-foreground">Mark this note for priority review</p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Add Note
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
