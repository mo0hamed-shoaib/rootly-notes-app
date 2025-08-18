// src/components/notes/EditNoteDialog.tsx
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { noteSchema, type NoteInput } from "@/lib/zod/note";
import type { Note, Course, Topic } from "@/types";
import { motion } from "motion/react";

interface EditNoteDialogProps {
  note: Note;
  courses: Course[];
  onUpdate: (noteId: string, updates: Partial<Note>) => void;
  isLoading?: boolean;
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

export function EditNoteDialog({ note, courses, onUpdate, isLoading = false }: EditNoteDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>(note.topics);

  const form = useForm<NoteInput>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      courseId: note.courseId,
      question: note.question,
      topics: note.topics,
      status: note.status,
      understanding: note.understanding,
      flags: note.flags,
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    const updates = {
      ...data,
      topics: selectedTopics,
      updatedAt: new Date().toISOString(),
    };
    
    onUpdate(note.id, updates);
    setOpen(false);
    form.reset();
  });

  const toggleTopic = (topic: Topic) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const course = courses.find(c => c.id === note.courseId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <span className="sr-only">Edit note</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Question */}
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              {...form.register("question")}
              placeholder="What is your question?"
              className="min-h-[80px] resize-none"
            />
            {form.formState.errors.question && (
              <p className="text-sm text-destructive">
                {form.formState.errors.question.message}
              </p>
            )}
          </div>

          {/* Course */}
          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <Select
              value={form.watch("courseId")}
              onValueChange={(value) => form.setValue("courseId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title} - {course.instructor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.courseId && (
              <p className="text-sm text-destructive">
                {form.formState.errors.courseId.message}
              </p>
            )}
          </div>

          {/* Topics */}
          <div className="space-y-3">
            <Label>Topics</Label>
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

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={form.watch("status")}
              onValueChange={(value: "draft" | "active" | "answered") => 
                form.setValue("status", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="answered">Answered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Understanding */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Understanding: {form.watch("understanding")}%</Label>
            </div>
            <Slider
              value={[form.watch("understanding")]}
              onValueChange={([value]) => form.setValue("understanding", value)}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          {/* Flags */}
          <div className="space-y-3">
            <Label>Flags</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="focus"
                  checked={form.watch("flags.focus")}
                  onCheckedChange={(checked) => 
                    form.setValue("flags.focus", checked as boolean)
                  }
                />
                <Label htmlFor="focus" className="text-sm font-normal">
                  Focus (needs review)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="blackBox"
                  checked={form.watch("flags.blackBox")}
                  onCheckedChange={(checked) => 
                    form.setValue("flags.blackBox", checked as boolean)
                  }
                />
                <Label htmlFor="blackBox" className="text-sm font-normal">
                  Black Box (deep dive needed)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mastered"
                  checked={form.watch("flags.mastered")}
                  onCheckedChange={(checked) => 
                    form.setValue("flags.mastered", checked as boolean)
                  }
                />
                <Label htmlFor="mastered" className="text-sm font-normal">
                  Mastered
                </Label>
              </div>
            </div>
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
              {isLoading ? "Updating..." : "Update Question"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
