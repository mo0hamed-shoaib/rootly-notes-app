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
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DialogFooter } from "@/components/ui/dialog"
import { TimeInput } from "@/components/ui/time-input"
import { format } from "date-fns"
import { Plus, Loader2 } from "lucide-react"
import { useEditingGuard } from "@/hooks/use-editing-guard"
import { useDailyEntryMutations } from "@/hooks/use-mutations"

const dailyEntrySchema = z.object({
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

type DailyEntryFormData = z.infer<typeof dailyEntrySchema>

export function AddDailyEntryDialog() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { guardAction } = useEditingGuard()
  const { createDailyEntry } = useDailyEntryMutations()

  const form = useForm<z.input<typeof dailyEntrySchema>, any, DailyEntryFormData>({
    resolver: zodResolver(dailyEntrySchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      study_time: 60,
      mood: 3,
      notes: "",
    },
  })

  const onSubmit = async (data: DailyEntryFormData) => {
    setIsSubmitting(true)
    try {
      await createDailyEntry({
        date: data.date,
        study_time: data.study_time,
        mood: data.mood,
        notes: data.notes || "",
      })

      form.reset()
      setOpen(false)
    } catch (error) {
      // Error is handled by the mutation hook
      console.error("Error adding daily tracking:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full sm:w-auto"
          onClick={(e) => {
            if (!open) {
              guardAction("add daily tracking", () => setOpen(true))
              e.preventDefault()
            }
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Daily Tracking
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Daily Tracking</DialogTitle>
          <DialogDescription>Record your daily study progress and mood.</DialogDescription>
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
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger aria-label="Select mood">
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
                  <FormLabel>Notes (Optional)</FormLabel>
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

            <DialogFooter className="gap-3 sm:gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Add Entry
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
