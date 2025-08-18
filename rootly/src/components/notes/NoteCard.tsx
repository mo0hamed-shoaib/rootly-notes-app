// src/components/notes/NoteCard.tsx
import { Flag, Zap, Award, Clock, Trash2, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EditNoteDialog } from "./EditNoteDialog";
import type { Note, Course } from "@/types";
import { motion } from "motion/react";

interface NoteCardProps {
  note: Note;
  courses: Course[];
  onClick?: () => void;
  onDelete?: (noteId: string) => void;
  onUpdate?: (noteId: string, updates: Partial<Note>) => void;
  compact?: boolean;
}

const getStatusColor = (status: Note["status"]) => {
  switch (status) {
    case "draft":
      return "status-draft";
    case "active":
      return "status-active";
    case "answered":
      return "status-answered";
    default:
      return "status-draft";
  }
};

export function NoteCard({ note, courses, onClick, onDelete, onUpdate, compact = false }: NoteCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(note.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      className="h-full"
    >
      <Card 
        className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 border hover:border-primary/20 h-full flex flex-col group ${compact ? 'text-sm' : ''}`}
        onClick={onClick}
      >
        <CardHeader className={`${compact ? 'pb-2' : 'pb-4'}`}>
          <div className={`flex items-start justify-between gap-3 ${compact ? 'mb-2' : 'mb-3'}`}>
            <CardTitle className={`${compact ? 'text-sm' : 'text-base'} font-semibold leading-snug flex-1 group-hover:text-primary transition-colors`}>
              {note.question}
            </CardTitle>
            <div className={`flex items-center gap-1 shrink-0 ${compact ? 'scale-95' : ''}`}>
              {/* Action Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onUpdate && (
                    <DropdownMenuItem asChild>
                      <EditNoteDialog
                        note={note}
                        courses={courses}
                        onUpdate={onUpdate}
                      />
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Flags */}
              {note.flags.focus && (
                <Badge variant="secondary" className="flag-focus text-xs">
                  <Flag className="w-3 h-3 mr-1" />
                  Focus
                </Badge>
              )}
              {note.flags.blackBox && (
                <Badge variant="secondary" className="flag-deep text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  Deep
                </Badge>
              )}
              {note.flags.mastered && (
                <Badge variant="secondary" className="flag-done text-xs">
                  <Award className="w-3 h-3 mr-1" />
                  Done
                </Badge>
              )}
            </div>
          </div>
          
          {/* Topics */}
          <div className={`flex flex-wrap ${compact ? 'gap-1' : 'gap-1.5'}`}>
            {note.topics.map((topic) => (
              <Badge
                key={topic}
                variant="outline"
                className={`text-xs px-2 py-1 bg-secondary/50 border-secondary hover:bg-secondary transition-colors ${compact ? 'scale-95' : ''}`}
              >
                {topic}
              </Badge>
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Understanding Progress */}
            <div className="space-y-2">
              <div className={`flex items-center justify-between ${compact ? 'text-xs' : 'text-sm'}`}>
                <span className="text-muted-foreground">Understanding</span>
                <span className="font-medium">{note.understanding}%</span>
              </div>
              <Progress value={note.understanding} className={`${compact ? 'h-1.5' : 'h-2'}`} />
            </div>
            
            <Separator />
            
            {/* Status & Metadata */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
              </div>
              <Badge
                variant={note.status === "answered" ? "default" : note.status === "active" ? "secondary" : "outline"}
                className={`${getStatusColor(note.status)} ${compact ? 'text-[10px]' : 'text-xs'}`}
              >
                {note.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
