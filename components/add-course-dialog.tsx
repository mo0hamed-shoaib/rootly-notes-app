"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
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
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { supabase } from "@/lib/supabase/client"
import { Plus, Loader2, X, LinkIcon, Tag } from "lucide-react"
import { toast } from "sonner"

const courseSchema = z.object({
  instructor: z
    .string()
    .min(1, "Instructor name is required")
    .max(100, "Instructor name must be less than 100 characters"),
  title: z.string().min(1, "Course title is required").max(200, "Course title must be less than 200 characters"),
  links: z
    .array(
      z.object({
        value: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
      }),
    )
    .optional(),
  topics: z
    .array(
      z.object({
        value: z.string().min(1, "Topic cannot be empty").max(50, "Topic must be less than 50 characters"),
      }),
    )
    .optional(),
})

type CourseFormData = z.infer<typeof courseSchema>

export function AddCourseDialog() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      instructor: "",
      title: "",
      links: [{ value: "" }],
      topics: [{ value: "" }],
    },
  })

  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({
    control: form.control,
    name: "links",
  })

  const {
    fields: topicFields,
    append: appendTopic,
    remove: removeTopic,
  } = useFieldArray({
    control: form.control,
    name: "topics",
  })

  const onSubmit = async (data: CourseFormData) => {
    setIsSubmitting(true)
    try {
      // Filter out empty links and topics
      const links =
        data.links?.filter((link) => ((link.value ?? "").trim() !== "")).map((link) => (link.value ?? "")) || []
      const topics =
        data.topics?.filter((topic) => topic.value.trim() !== "").map((topic) => topic.value) || []

      const { error } = await supabase.from("courses").insert([
        {
          instructor: data.instructor,
          title: data.title,
          links,
          topics,
        },
      ])

      if (error) throw error

      toast.success("Course added successfully", {
        description: "Your new course has been created.",
      })

      form.reset()
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error adding course:", error)
      toast.error("Error adding course", {
        description: "Please try again.",
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
          Add Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
          <DialogDescription>Create a new course to organize your learning materials and notes.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Advanced React Patterns" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instructor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructor</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Dr. Sarah Johnson" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Topics */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FormLabel className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Topics
                </FormLabel>
                <Button type="button" variant="outline" size="sm" onClick={() => appendTopic({ value: "" })}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Topic
                </Button>
              </div>
              {topicFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <FormField
                    control={form.control}
                    name={`topics.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="e.g., Hooks, Context, Performance" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {topicFields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeTopic(index)}
                      className="px-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Links */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FormLabel className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Resource Links
                </FormLabel>
                <Button type="button" variant="outline" size="sm" onClick={() => appendLink({ value: "" })}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Link
                </Button>
              </div>
              {linkFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <FormField
                    control={form.control}
                    name={`links.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {linkFields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeLink(index)}
                      className="px-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Add Course
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
