// src/components/courses/CourseDialog.tsx
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { courseSchema, type CourseInput } from "@/lib/zod/course";
import type { Course, Topic } from "@/types";

interface CourseDialogProps {
  course?: Course; // If provided, edit mode; otherwise, create mode
  onSubmit: (data: CourseInput) => void;
  isLoading?: boolean;
  trigger?: React.ReactNode;
}

const topics: Topic[] = [
  "hooks",
  "reconciliation", 
  "rendering",
  "state",
  "routing",
  "performance",
  "other"
];

export function CourseDialog({ course, onSubmit, isLoading = false, trigger }: CourseDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>(course?.tags || []);

  const form = useForm<CourseInput>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      instructor: course?.instructor || "",
      title: course?.title || "",
      links: {
        course: course?.links.course || "",
        repo: course?.links.repo || "",
        docs: course?.links.docs || "",
      },
      version: course?.version || "",
      startedAt: course?.startedAt ? new Date(course.startedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      tags: course?.tags || [],
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    const courseData = {
      ...data,
      tags: selectedTopics,
    };
    
    onSubmit(courseData);
    setOpen(false);
    form.reset();
    setSelectedTopics([]);
  });

  const toggleTopic = (topic: Topic) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const isEditMode = !!course;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            {isEditMode ? "Edit Course" : "Add Course"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Course" : "Add New Course"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              {...form.register("title")}
              placeholder="e.g., React Deep Dive"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          {/* Instructor */}
          <div className="space-y-2">
            <Label htmlFor="instructor">Instructor</Label>
            <Input
              id="instructor"
              {...form.register("instructor")}
              placeholder="e.g., Dan Abramov"
            />
            {form.formState.errors.instructor && (
              <p className="text-sm text-destructive">
                {form.formState.errors.instructor.message}
              </p>
            )}
          </div>

          {/* Version */}
          <div className="space-y-2">
            <Label htmlFor="version">Version (Optional)</Label>
            <Input
              id="version"
              {...form.register("version")}
              placeholder="e.g., React 18, TypeScript 5.0"
            />
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startedAt">Start Date</Label>
            <Input
              id="startedAt"
              type="date"
              {...form.register("startedAt")}
            />
            {form.formState.errors.startedAt && (
              <p className="text-sm text-destructive">
                {form.formState.errors.startedAt.message}
              </p>
            )}
          </div>

          {/* Links */}
          <div className="space-y-4">
            <Label>Links (Optional)</Label>
            
            <div className="space-y-2">
              <Label htmlFor="courseLink">Course URL</Label>
              <Input
                id="courseLink"
                type="url"
                {...form.register("links.course")}
                placeholder="https://..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="repoLink">Repository URL</Label>
              <Input
                id="repoLink"
                type="url"
                {...form.register("links.repo")}
                placeholder="https://github.com/..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="docsLink">Documentation URL</Label>
              <Input
                id="docsLink"
                type="url"
                {...form.register("links.docs")}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Topics */}
          <div className="space-y-3">
            <Label>Topics Covered</Label>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <Badge
                  key={topic}
                  variant={selectedTopics.includes(topic) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80 transition-colors"
                  onClick={() => toggleTopic(topic)}
                >
                  {topic}
                </Badge>
              ))}
            </div>
            {selectedTopics.length === 0 && (
              <p className="text-sm text-destructive">Select at least one topic</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || selectedTopics.length === 0}>
              {isLoading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Course" : "Create Course")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
