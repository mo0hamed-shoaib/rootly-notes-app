// src/pages/ReviewPage.tsx
import { useState, useMemo, useEffect } from "react";
import { Brain, RotateCcw, CheckCircle, XCircle, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import type { Note, Topic } from "@/types";
import { motion, AnimatePresence } from "motion/react";

interface ReviewPageProps {
  notes: Note[];
  onUpdateNote: (noteId: string, updates: Partial<Note>) => void;
}

interface ReviewSession {
  notes: Note[];
  currentIndex: number;
  completed: string[];
  sessionStats: {
    improved: number;
    maintained: number;
    declined: number;
  };
}

const topicColors: Record<Topic, string> = {
  hooks: "topic-hooks",
  reconciliation: "topic-reconciliation",
  rendering: "topic-rendering",
  state: "topic-state",
  routing: "topic-routing",
  performance: "topic-performance",
  other: "topic-other",
};

export function ReviewPage({ notes, onUpdateNote }: ReviewPageProps) {
  const [session, setSession] = useState<ReviewSession | null>(null);
  const [selectedUnderstanding, setSelectedUnderstanding] = useState<number>(50);

  // Create pseudorandom sample for review
  const createReviewSession = (sessionSize: number = 10) => {
    // Prioritize notes that need review
    const prioritized = notes
      .filter(note => note.status === "active")
      .sort((a, b) => {
        // Priority: Focus > Low understanding > Black box > Regular
        const getPriority = (note: Note) => {
          if (note.flags.focus) return 4;
          if (note.understanding < 30) return 3;
          if (note.flags.blackBox) return 2;
          return 1;
        };
        return getPriority(b) - getPriority(a);
      });

    // Ensure topic diversity - group by topics and sample from each
    const topicGroups: Record<Topic, Note[]> = {
      hooks: [],
      reconciliation: [],
      rendering: [],
      state: [],
      routing: [],
      performance: [],
      other: [],
    };

    prioritized.forEach(note => {
      note.topics.forEach(topic => {
        topicGroups[topic].push(note);
      });
    });

    // Sample from each topic group to ensure diversity
    const reviewNotes: Note[] = [];
    const topicsWithNotes = Object.entries(topicGroups).filter(([_, notes]) => notes.length > 0);
    
    for (let i = 0; i < sessionSize && reviewNotes.length < sessionSize; i++) {
      const topicIndex = i % topicsWithNotes.length;
      const [_, topicNotes] = topicsWithNotes[topicIndex];
      const noteIndex = Math.floor(i / topicsWithNotes.length) % topicNotes.length;
      
      const note = topicNotes[noteIndex];
      if (!reviewNotes.find(n => n.id === note.id)) {
        reviewNotes.push(note);
      }
    }

    // Fill remaining slots with any available notes
    const remaining = prioritized.filter(note => !reviewNotes.find(n => n.id === note.id));
    reviewNotes.push(...remaining.slice(0, sessionSize - reviewNotes.length));

    setSession({
      notes: reviewNotes,
      currentIndex: 0,
      completed: [],
      sessionStats: { improved: 0, maintained: 0, declined: 0 }
    });
  };

  const handleAnswer = (understanding: number) => {
    if (!session) return;

    const currentNote = session.notes[session.currentIndex];
    const oldUnderstanding = currentNote.understanding;
    
    // Update the note
    onUpdateNote(currentNote.id, {
      understanding,
      updatedAt: new Date().toISOString(),
    });

    // Update session stats
    const newStats = { ...session.sessionStats };
    if (understanding > oldUnderstanding + 5) {
      newStats.improved++;
    } else if (understanding < oldUnderstanding - 5) {
      newStats.declined++;
    } else {
      newStats.maintained++;
    }

    setSession({
      ...session,
      currentIndex: session.currentIndex + 1,
      completed: [...session.completed, currentNote.id],
      sessionStats: newStats
    });

    setSelectedUnderstanding(50); // Reset for next question
  };

  const resetSession = () => {
    setSession(null);
    setSelectedUnderstanding(50);
  };

  const sessionProgress = session 
    ? Math.round((session.completed.length / session.notes.length) * 100)
    : 0;

  const isSessionComplete = session && session.currentIndex >= session.notes.length;
  const currentNote = session && !isSessionComplete ? session.notes[session.currentIndex] : null;

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Page Header - Centered and Symmetrical */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                  Review Mode
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  Test your understanding with focused practice
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <Brain className="w-16 h-16 mx-auto text-muted-foreground/50 mb-6" />
              <h2 className="text-xl font-semibold mb-4">Ready for a review session?</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                We'll show you a mix of questions that need attention, prioritizing focus items and topics where you need practice.
              </p>
              
              <div className="space-y-4">
                <Button 
                  onClick={() => createReviewSession(10)}
                  className="btn-primary mr-4"
                  disabled={notes.filter(n => n.status === "active").length === 0}
                >
                  Start Review Session (10 questions)
                </Button>
                <Button 
                  onClick={() => createReviewSession(5)}
                  variant="outline"
                  disabled={notes.filter(n => n.status === "active").length === 0}
                >
                  Quick Review (5 questions)
                </Button>
              </div>

              {notes.filter(n => n.status === "active").length === 0 && (
                <p className="text-sm text-muted-foreground mt-4">
                  No active questions available for review
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSessionComplete) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-6" />
            <h2 className="text-2xl font-bold mb-4">Session Complete! 🎉</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto mb-8">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 tabular-nums">{session.sessionStats.improved}</div>
                  <div className="text-sm text-muted-foreground">Improved</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">{session.sessionStats.maintained}</div>
                  <div className="text-sm text-muted-foreground">Maintained</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">{session.sessionStats.declined}</div>
                  <div className="text-sm text-muted-foreground">Need Work</div>
                </CardContent>
              </Card>
            </div>

            <div className="space-x-4">
              <Button onClick={resetSession} className="btn-primary">
                <RotateCcw className="w-4 h-4 mr-2" />
                New Session
              </Button>
              <Button variant="outline" onClick={() => window.history.back()}>
                Back to Notes
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Keyboard shortcuts */}
        {session && (
          <Shortcuts
            value={selectedUnderstanding}
            onChange={setSelectedUnderstanding}
            onSubmit={() => handleAnswer(selectedUnderstanding)}
            onExit={resetSession}
          />
        )}
        {/* Header with progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Review Session</h1>
            <Button variant="ghost" onClick={resetSession}>
              <XCircle className="w-4 h-4 mr-2" />
              End Session
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Question {session.currentIndex + 1} of {session.notes.length}</span>
              <span>{sessionProgress}% complete</span>
            </div>
            <Progress value={sessionProgress} className="h-2" />
          </div>
        </div>

        {/* Current Question */}
        <AnimatePresence mode="wait">
          {currentNote && (
            <motion.div
              key={currentNote.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-xl">{currentNote.question}</CardTitle>
                    <div className="flex items-center gap-1 shrink-0">
                      {currentNote.flags.focus && (
                        <Badge variant="secondary" className="flag-focus">
                          Focus
                        </Badge>
                      )}
                      {currentNote.flags.blackBox && (
                        <Badge variant="secondary" className="flag-deep">
                          Black Box
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {currentNote.topics.map((topic) => (
                      <Badge
                        key={topic}
                        variant="secondary"
                        className={`text-xs ${topicColors[topic]}`}
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-2">Current understanding: {currentNote.understanding}%</p>
                      <div className="flex justify-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= Math.round(currentNote.understanding / 20) 
                                ? "star-active fill-current text-yellow-500" 
                                : "star-muted text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="text-center">
                        <label className="block text-sm font-medium mb-2">
                          How well do you understand this now?
                        </label>
                        <div className="text-2xl font-bold text-foreground mb-2 tabular-nums">
                          {selectedUnderstanding}%
                        </div>
                        <div className="px-2">
                          <Slider
                            min={0}
                            max={100}
                            step={5}
                            value={[selectedUnderstanding]}
                            onValueChange={(value) => setSelectedUnderstanding(value[0])}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>

                      <div className="text-center">
                        <Button onClick={() => handleAnswer(selectedUnderstanding)}>
                          Next Question
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Shortcuts({
  value,
  onChange,
  onSubmit,
  onExit,
}: {
  value: number;
  onChange: (v: number) => void;
  onSubmit: () => void;
  onExit: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onChange(Math.max(0, value - 5));
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        onChange(Math.min(100, value + 5));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        onSubmit();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        onExit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [value, onChange, onSubmit, onExit]);
  return null;
}
