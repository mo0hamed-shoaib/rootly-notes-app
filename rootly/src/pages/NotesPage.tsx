// src/pages/NotesPage.tsx
import { BookOpen } from "lucide-react";
import { NoteList } from "@/components/notes/NoteList";
import { NewNoteDialog } from "@/components/notes/NewNoteDialog";
import type { Note, Course, DailyEntry } from "@/types";
import type { NoteInput } from "@/lib/zod/note";

interface NotesPageProps {
  notes: Note[];
  courses: Course[];
  dailyEntries: DailyEntry[];
  onCreateNote: (note: NoteInput) => void;
  onUpdateNote: (noteId: string, updates: Partial<Note>) => void;
  onDeleteNote?: (noteId: string) => void;
  isLoading?: boolean;
}

export function NotesPage({ 
  notes, 
  courses, 
  dailyEntries, 
  onCreateNote, 
  onUpdateNote, 
  onDeleteNote,
  isLoading = false 
}: NotesPageProps) {
  const handleNoteClick = (note: Note) => {
    console.log("Note clicked:", note);
    // In a real app, this would open a note detail modal or navigate to edit page
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Page Header - Centered and Symmetrical */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                Your Learning Journey
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Track progress, review questions, and build knowledge
              </p>
            </div>
          </div>
          
          {/* Action Button - Centered */}
          <div className="flex justify-center">
            <NewNoteDialog 
              courses={courses}
              onSubmit={onCreateNote}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Notes Section */}
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6 sm:space-y-8">
            {/* Section Header */}
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
                Your Questions
              </h2>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>{notes.length} total questions</span>
              </div>
            </div>
            
            {/* Notes List */}
            <NoteList 
              notes={notes}
              courses={courses}
              onNoteClick={handleNoteClick}
              onUpdateNote={onUpdateNote}
              onDeleteNote={onDeleteNote}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
