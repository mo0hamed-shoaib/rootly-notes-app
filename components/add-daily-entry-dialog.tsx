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
import { supabase } from "@/lib/supabase/client"
import { Plus, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const dailyEntrySchema = z.object({
  date: z.string().min(1, "Date is required"),
  study_time: z.coerce.number().min(0, "Study time must be positive").max(1440, "Study time cannot exceed 24 hours"),
  mood: z.coerce.number().min(1).max(5),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
})

type DailyEntryFormData = z.infer<typeof dailyEntrySchema>

export function AddDailyEntryDialog() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<DailyEntryFormData>({
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
      const { error } = await supabase.from("daily_entries").insert([
        {
          date: data.date,
          study_time: data.study_time,
          mood: data.mood,
          notes: data.notes || "",
        },
      ])

      if (error) throw error

      toast({
        title: "Daily entry added successfully",
        description: "Your study progress has been recorded.",
      })

      form.reset()
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error adding daily entry:", error)
      toast({
        title: "Error adding daily entry",
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
          Add Daily Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Daily Entry</DialogTitle>
          <DialogDescription>Record your daily study progress and mood.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="study_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Study Time (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="60" {...field} />
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

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Add Entry
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
