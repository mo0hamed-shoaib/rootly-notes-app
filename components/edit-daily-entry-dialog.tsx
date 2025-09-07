"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { TimeInput } from "@/components/ui/time-input"
import { supabase } from "@/lib/supabase/client"
import { Loader2, Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { toast } from "sonner"
import type { DailyEntry } from "@/lib/types"

const editDailyEntrySchema = z.object({
  date: z.string().min(1, "Date is required"),
  study_time: z.preprocess(
    (v) => {
      if (typeof v === "string") {
        if (v.trim() === "") return undefined
        const n = Number(v)
        return Number.isNaN(n) ? undefined : n
      }
      return v
    },
    z
      .number({ required_error: "Study time is required" })
      .min(0, "Study time must be positive")
      .max(1440, "Study time cannot exceed 24 hours"),
  ),
  mood: z.coerce.number().min(1).max(5),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
})

type EditDailyEntryFormData = z.infer<typeof editDailyEntrySchema>

interface EditDailyEntryDialogProps {
  entry: DailyEntry
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditDailyEntryDialog({ entry, open, onOpenChange }: EditDailyEntryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<z.input<typeof editDailyEntrySchema>, any, EditDailyEntryFormData>({
    resolver: zodResolver(editDailyEntrySchema),
    defaultValues: {
      date: entry.date,
      study_time: entry.study_time,
      mood: entry.mood,
      notes: entry.notes,
    },
  })

  // Reset form when entry changes or when dialog opens (avoid stale unsaved input)
  useEffect(() => {
    if (!open && form.formState.isDirty) return
    form.reset({
      date: entry.date,
      study_time: entry.study_time,
      mood: entry.mood,
      notes: entry.notes,
    })
  }, [entry, open, form])

  const onSubmit = async (data: EditDailyEntryFormData) => {
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from("daily_entries")
        .update({
          date: data.date,
          study_time: data.study_time,
          mood: data.mood,
          notes: data.notes || "",
        })
        .eq("id", entry.id)

      if (error) throw error

      toast.success("Daily entry updated successfully", {
        description: "Your changes have been saved.",
      })

      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating daily entry:", error)
      toast.error("Error updating daily entry", {
        description: "Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Daily Entry</DialogTitle>
          <DialogDescription>Update your daily study progress and mood.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(new Date(field.value), "PPP") : "Pick a date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) =>
                          field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="study_time"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TimeInput
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mood</FormLabel>
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
                      <SelectItem value="1">😞 Terrible</SelectItem>
                      <SelectItem value="2">😕 Poor</SelectItem>
                      <SelectItem value="3">😐 Okay</SelectItem>
                      <SelectItem value="4">😊 Good</SelectItem>
                      <SelectItem value="5">😄 Excellent</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="How did your study session go? Any insights or challenges?"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
