// src/components/notes/NoteList.tsx
import { useMemo, useState } from "react";
import { Search, Filter, SortAsc, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { NoteCard } from "./NoteCard";
import type { Note, Topic, Course } from "@/types";

interface NoteListProps {
  notes: Note[];
  courses: Course[];
  onNoteClick?: (note: Note) => void;
  onUpdateNote?: (noteId: string, updates: Partial<Note>) => void;
  onDeleteNote?: (noteId: string) => void;
}

type SortOption = "recent" | "oldest" | "understanding-low" | "understanding-high";
type StatusFilter = "all" | "draft" | "active" | "answered";

const topicOptions: Topic[] = [
  "hooks",
  "reconciliation", 
  "rendering",
  "state",
  "routing",
  "performance",
  "other",
];

const sortOptions = [
  { value: "recent" as const, label: "Recently Updated" },
  { value: "oldest" as const, label: "Oldest First" },
  { value: "understanding-low" as const, label: "Lowest Understanding" },
  { value: "understanding-high" as const, label: "Highest Understanding" },
];

const statusOptions = [
  { value: "all" as const, label: "All Status" },
  { value: "draft" as const, label: "Draft" },
  { value: "active" as const, label: "Active" },
  { value: "answered" as const, label: "Answered" },
];

export function NoteList({ notes, courses, onNoteClick, onUpdateNote, onDeleteNote }: NoteListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [compact, setCompact] = useState<boolean>(false);

  const toggleTopic = (topic: Topic) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const filteredAndSortedNotes = useMemo(() => notes
    .filter((note) => {
      // Search filter
      if (searchQuery && !note.question.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Topic filter
      if (selectedTopics.length > 0 && !selectedTopics.some(topic => note.topics.includes(topic))) {
        return false;
      }
      
      // Course filter
      if (selectedCourse && selectedCourse !== "all" && note.courseId !== selectedCourse) {
        return false;
      }
      
      // Status filter
      if (statusFilter !== "all" && note.status !== statusFilter) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case "oldest":
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        case "understanding-low":
          return a.understanding - b.understanding;
        case "understanding-high":
          return b.understanding - a.understanding;
        default:
          return 0;
      }
    }), [notes, searchQuery, selectedTopics, selectedCourse, statusFilter, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTopics([]);
    setSelectedCourse("all");
    setStatusFilter("all");
    setSortBy("recent");
  };

  const hasActiveFilters = searchQuery || selectedTopics.length > 0 || (selectedCourse && selectedCourse !== "all") || statusFilter !== "all";

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="sticky top-[58px] z-30 space-y-4 p-4 bg-background/90 backdrop-blur border rounded-lg">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background"
            spellCheck={false}
            autoComplete="off"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Course Filter */}
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <SortAsc className="w-4 h-4 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={sortBy === option.value ? "bg-accent" : ""}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Topics
                {selectedTopics.length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {selectedTopics.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by topics</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {topicOptions.map((topic) => (
                <DropdownMenuItem
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className="flex items-center justify-between"
                >
                  <span className="capitalize">{topic}</span>
                  {selectedTopics.includes(topic) && (
                    <Badge variant="secondary" className="text-xs">✓</Badge>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Density Toggle */}
          <Toggle
            pressed={compact}
            onPressedChange={(p) => setCompact(!!p)}
            aria-label="Toggle compact cards"
          >
            {compact ? "Compact" : "Comfort"}
          </Toggle>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Active Topic Filters */}
        {selectedTopics.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <span className="text-xs text-muted-foreground font-medium self-center">Active filters:</span>
            {selectedTopics.map((topic) => (
              <Badge
                key={topic}
                variant="secondary"
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                onClick={() => toggleTopic(topic)}
              >
                {topic}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {filteredAndSortedNotes.length} of {notes.length} questions
          {hasActiveFilters && " (filtered)"}
        </span>
        <span className="text-xs">
          Sorted by {sortOptions.find(opt => opt.value === sortBy)?.label}
        </span>
      </div>

      {/* Notes Grid */}
      {filteredAndSortedNotes.length === 0 ? (
        <EmptyState
          hasFilters={!!hasActiveFilters}
        />
      ) : (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${compact ? 'gap-3' : 'gap-4 lg:gap-6'}`}>
          {filteredAndSortedNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              courses={courses}
              compact={compact}
              onClick={() => onNoteClick?.(note)}
              onUpdate={onUpdateNote}
              onDelete={onDeleteNote}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="text-center py-16">
      <Filter className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
      <h3 className="text-lg font-medium mb-2">No questions found</h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
        {hasFilters 
          ? "Try adjusting your filters or search terms to find more questions."
          : "Create your first learning question to get started on your learning journey."
        }
      </p>
      <NewNoteCTA />
    </div>
  );
}

function NewNoteCTA() {
  // Use the dialog via a hidden trigger to open programmatically
  return (
    <div className="flex justify-center">
      {/* Consumers can pass their own dialog. For now, simple link back to header button */}
      <Button asChild>
        <a href="#" onClick={(e) => { e.preventDefault(); const btn = document.querySelector('[data-new-note-button]') as HTMLButtonElement | null; btn?.click(); }}>
          Create a Question
        </a>
      </Button>
    </div>
  );
}
