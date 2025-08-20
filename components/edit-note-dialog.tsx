"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select as UiSelect, SelectContent as UiSelectContent, SelectItem as UiSelectItem, SelectTrigger as UiSelectTrigger, SelectValue as UiSelectValue } from "@/components/ui/select"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { supabase } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { Note, CodeLanguage } from "@/lib/types"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { LanguageCombobox } from "@/components/language-combobox"
 

const editNoteSchema = z.object({
  question: z.string().min(1, "Question is required").max(1000, "Question must be less than 1000 characters"),
  answer: z.string().max(2000, "Answer must be less than 2000 characters").optional(),
  code_snippet: z.string().max(20000, "Snippet too long").optional(),
  code_language: z.custom<CodeLanguage>().optional(),
  understanding_level: z.coerce.number().min(1).max(5),
  flag: z.boolean(),
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
      code_snippet: note.code_snippet ?? "",
      code_language: (note.code_language as CodeLanguage | null) ?? "plaintext",
      understanding_level: note.understanding_level,
      flag: note.flag,
    },
  })

  // Reset form when note changes
  useEffect(() => {
    form.reset({
      question: note.question,
      answer: note.answer,
      code_snippet: note.code_snippet ?? "",
      code_language: (note.code_language as CodeLanguage | null) ?? "plaintext",
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
          code_snippet: data.code_snippet || null,
          code_language: data.code_language || "plaintext",
          understanding_level: data.understanding_level,
          flag: data.flag,
        })
        .eq("id", note.id)

      if (error) throw error

      toast.success("Note updated successfully", {
        description: "Your changes have been saved.",
      })

      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating note:", error)
      toast.error("Error updating note", {
        description: "Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
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

            <Accordion type="single" collapsible>
              <AccordionItem value="code">
                <AccordionTrigger className="text-sm font-medium">Code snippet (Optional)</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                    <FormField
                      control={form.control}
                      name="code_language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Language</FormLabel>
                          <LanguageCombobox value={(field.value as CodeLanguage) ?? "plaintext"} onChange={field.onChange as (v: CodeLanguage) => void} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="code_snippet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Code</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Paste your code here..."
                              className="min-h-[160px] font-mono"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

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
                  <FormItem className="flex flex-row items-center justify-between p-2">
                    <div className="space-y-1">
                      <FormLabel>Flag for review</FormLabel>
                      <p className="text-sm text-muted-foreground">Adds more priority</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
