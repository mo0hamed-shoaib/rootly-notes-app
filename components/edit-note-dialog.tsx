"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { supabase } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { Note } from "@/lib/types"

const editNoteSchema = z.object({
  question: z.string().min(1, "Question is required").max(1000, "Question must be less than 1000 characters"),
  answer: z.string().max(2000, "Answer must be less than 2000 characters").optional(),
  understanding_level: z.coerce.number().min(1).max(5),
  flag: z.boolean().default(false),
})

type EditNoteFormData = z.infer<typeof editNoteSchema>

interface EditNoteDialogProps {
  note: Note
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditNoteDialog({ note, open, onOpenChange }: EditNoteDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<EditNoteFormData>({
    resolver: zodResolver(editNoteSchema),
    defaultValues: {
      question: note.question,
      answer: note.answer,
      understanding_level: note.understanding_level,
      flag: note.flag,
    },
  })

  // Reset form when note changes
  useEffect(() => {
    form.reset({
      question: note.question,
      answer: note.answer,
      understanding_level: note.understanding_level,
      flag: note.flag,
    })
  }, [note, form])

  const onSubmit = async (data: EditNoteFormData) => {
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from("notes")
        .update({
          question: data.question,
          answer: data.answer || "",
          understanding_level: data.understanding_level,
          flag: data.flag,
        })
        .eq("id", note.id)

      if (error) throw error

      toast({
        title: "Note updated successfully",
        description: "Your changes have been saved.",
      })

      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating note:", error)
      toast({
        title: "Error updating note",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
          <DialogDescription>Update your learning question and understanding level.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <FormLabel>Answer</FormLabel>
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
                      value={field.value.toString()}
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

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
