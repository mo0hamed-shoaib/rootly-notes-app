// src/components/notes/NewNoteDialog.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { noteSchema, type NoteInput } from "@/lib/zod/note";
import type { Topic, Course } from "@/types";

interface NewNoteDialogProps {
  courses: Course[];
  onSubmit: (note: NoteInput) => void;
  isLoading?: boolean;
}

const topicOptions: Topic[] = [
  "hooks",
  "reconciliation", 
  "rendering",
  "state",
  "routing",
  "performance",
  "other",
];

const topicColors: Record<Topic, string> = {
  hooks: "topic-hooks hover:bg-blue-200 dark:hover:bg-blue-800/40",
  reconciliation: "topic-reconciliation hover:bg-purple-200 dark:hover:bg-purple-800/40",
  rendering: "topic-rendering hover:bg-green-200 dark:hover:bg-green-800/40",
  state: "topic-state hover:bg-yellow-200 dark:hover:bg-yellow-800/40",
  routing: "topic-routing hover:bg-indigo-200 dark:hover:bg-indigo-800/40",
  performance: "topic-performance hover:bg-red-200 dark:hover:bg-red-800/40",
  other: "topic-other hover:bg-gray-200 dark:hover:bg-gray-600/40",
};

export function NewNoteDialog({ courses, onSubmit, isLoading = false }: NewNoteDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);

  const form = useForm<NoteInput>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      courseId: courses.length > 0 ? courses[0].id : "",
      question: "",
      status: "active",
      understanding: 0,
      topics: [],
      flags: {},
    },
  });

  const handleSubmit = (data: NoteInput) => {
    onSubmit({ ...data, topics: selectedTopics });
    form.reset({
      courseId: courses.length > 0 ? courses[0].id : "",
      question: "",
      status: "active",
      understanding: 0,
      topics: [],
      flags: {},
    });
    setSelectedTopics([]);
    setOpen(false);
  };

  const toggleTopic = (topic: Topic) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset({
        courseId: courses.length > 0 ? courses[0].id : "",
        question: "",
        status: "active",
        understanding: 0,
        topics: [],
        flags: {},
      });
      setSelectedTopics([]);
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button data-new-note-button>
          <Plus className="w-4 h-4 mr-2" />
          New Question
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold">Add a Learning Question</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Create a focused question to track your learning progress
          </p>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Course Selection */}
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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

            {/* Question */}
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="How does useEffect work?"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Topics */}
            <div className="space-y-3">
              <FormLabel className="text-sm font-medium">Topics</FormLabel>
              <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/20">
                {topicOptions.map((topic) => (
                  <Badge
                    key={topic}
                    variant={selectedTopics.includes(topic) ? "default" : "outline"}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      selectedTopics.includes(topic) 
                        ? 'bg-primary text-primary-foreground shadow-sm' 
                        : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                    onClick={() => toggleTopic(topic)}
                  >
                    {topic}
                    {selectedTopics.includes(topic) && (
                      <X className="w-3 h-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
              {selectedTopics.length === 0 && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <span className="w-1 h-1 bg-destructive rounded-full"></span>
                  Select at least one topic
                </p>
              )}
            </div>

            <Separator />

            {/* Understanding Level */}
            <FormField
              control={form.control}
              name="understanding"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Understanding: {field.value}%</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={100}
                      step={5}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Flags */}
            <div className="space-y-3">
              <FormLabel>Study Flags</FormLabel>
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="flags.focus"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>🔥 Focus (needs review)</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="flags.blackBox"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>⚡ Black Box (deep dive)</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
                className="px-6"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isLoading || selectedTopics.length === 0}
                className="px-6 shadow-sm"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  "Save Question"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
