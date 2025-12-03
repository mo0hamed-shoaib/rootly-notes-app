"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { UnderstandingBadge } from "@/components/understanding-badge";
import { Progress } from "@/components/ui/progress";
import {
  Eye,
  EyeOff,
  RotateCcw,
  CheckCircle,
  Flag,
  Play,
  CircleStop,
  Target,
  Timer,
  TrendingDown,
  TrendingUp,
  Minus,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import type { Note } from "@/lib/types";
import { useEditingGuard } from "@/hooks/use-editing-guard";
import { useNoteMutations } from "@/hooks/use-mutations";

interface ReviewSessionProps {
  notes: Note[];
  onComplete?: (data: {
    responses: { noteId: string; previous: number; next: number }[];
    startedAt: number | null;
  }) => void;
}

export function ReviewSession({ notes, onComplete }: ReviewSessionProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [snapshotNotes, setSnapshotNotes] = useState<Note[]>([]);
  const [orderedNoteIds, setOrderedNoteIds] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [completedNotes, setCompletedNotes] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [responses, setResponses] = useState<
    { noteId: string; previous: number; next: number }[]
  >([]);
  // const [ended, setEnded] = useState(false); // Removed - state lifted to parent
  const startedAtRef = useRef<number | null>(null);
  const STORAGE_KEY = "rootly_review_session_v1";
  const { guardAction } = useEditingGuard();
  const { updateNote } = useNoteMutations();

  const idToNote = useMemo(() => {
    const map = new Map<string, Note>();
    const sourceNotes = isStarted ? snapshotNotes : notes;
    for (const n of sourceNotes) map.set(n.id, n);
    return map;
  }, [notes, snapshotNotes, isStarted]);

  const sessionNotes: Note[] = useMemo(() => {
    if (orderedNoteIds.length === 0) return [];
    return orderedNoteIds
      .map((id) => idToNote.get(id))
      .filter(Boolean) as Note[];
  }, [orderedNoteIds, idToNote]);

  const currentNote = sessionNotes[currentIndex];
  const progress =
    sessionNotes.length > 0
      ? ((currentIndex + 1) / sessionNotes.length) * 100
      : 0;
  const isLastNote =
    sessionNotes.length > 0 && currentIndex === sessionNotes.length - 1;

  function saveSession(next: {
    orderedIds?: string[];
    currentIndex?: number;
    completed?: string[];
    isStarted?: boolean;
    responses?: { noteId: string; previous: number; next: number }[];
    startedAt?: number | null;
  }) {
    try {
      const payload = {
        orderedIds: next.orderedIds ?? orderedNoteIds,
        currentIndex: next.currentIndex ?? currentIndex,
        completed: next.completed ?? completedNotes,
        isStarted: next.isStarted ?? isStarted,
        responses: next.responses ?? responses,
        startedAt: next.startedAt ?? startedAtRef.current,
        savedAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}
  }

  function clearSession() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  // Restore session on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        orderedIds: string[];
        currentIndex: number;
        completed: string[];
        isStarted: boolean;
        responses?: { noteId: string; previous: number; next: number }[];
        startedAt?: number;
      };
      const noteMap = new Map<string, Note>();
      for (const n of notes) noteMap.set(n.id, n);
      const filteredIds = (parsed.orderedIds || []).filter((id) =>
        noteMap.has(id)
      );
      if (filteredIds.length > 0 && parsed.isStarted) {
        setSnapshotNotes(notes);
        setOrderedNoteIds(filteredIds);
        setCurrentIndex(
          Math.min(parsed.currentIndex ?? 0, filteredIds.length - 1)
        );
        setCompletedNotes(
          (parsed.completed || []).filter((id) => noteMap.has(id))
        );
        setResponses(parsed.responses || []);
        setIsStarted(true);
        startedAtRef.current = parsed.startedAt || Date.now();
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startSession = () => {
    const order = notes.map((n) => n.id);
    setSnapshotNotes(notes);
    setOrderedNoteIds(order);
    setCurrentIndex(0);
    setCompletedNotes([]);
    setShowAnswer(false);
    setSelectedLevel(null);
    setIsStarted(true);
    setResponses([]);
    startedAtRef.current = Date.now();
    saveSession({
      orderedIds: order,
      currentIndex: 0,
      completed: [],
      isStarted: true,
      responses: [],
      startedAt: Date.now(),
    });
  };

  const endSession = () => {
    clearSession();
    setSnapshotNotes([]);
    setIsStarted(false);
    setOrderedNoteIds([]);
    setCurrentIndex(0);
    setCompletedNotes([]);
    setShowAnswer(false);
    setSelectedLevel(null);
    toast.success("Practice session ended", {
      description: "You can start a new session anytime.",
    });
  };

  const closeSummary = () => {
    // setEnded(false); // Removed
    setSnapshotNotes([]); // Clear snapshot when closing summary
  };

  const handleUpdateUnderstanding = async (newLevel: number) => {
    if (!currentNote) return;

    setIsUpdating(true);
    try {
      await updateNote(
        currentNote.id,
        {
          understanding_level: newLevel as 1 | 2 | 3 | 4 | 5,
          updated_at: new Date().toISOString(),
        },
        { silent: true }
      );

      setCompletedNotes((prev) => [...prev, currentNote.id]);

      const newResponses = [
        ...responses,
        {
          noteId: currentNote.id,
          previous: currentNote.understanding_level,
          next: newLevel,
        },
      ];
      setResponses(newResponses);

      saveSession({
        currentIndex: Math.min(
          currentIndex + 1,
          Math.max(sessionNotes.length - 1, 0)
        ),
        completed: [...completedNotes, currentNote.id],
        responses: newResponses,
      });

      if (isLastNote) {
        console.log("[ReviewSession] Completing session:", {
          sessionNotesLength: sessionNotes.length,
          responsesLength: responses.length + 1,
          completedNotesLength: completedNotes.length + 1,
        });

        toast.success("Practice session completed!", {
          description: `You reviewed ${sessionNotes.length} notes.`,
        });
        clearSession();
        // DON'T clear snapshot here - we need it for the summary!
        setIsStarted(false);
        // setEnded(true); // Removed - state lifted to parent
        setShowAnswer(false);
        setSelectedLevel(null);

        // Notify parent
        onComplete?.({
          responses: newResponses,
          startedAt: startedAtRef.current,
        });

        console.log("[ReviewSession] Called onComplete");
      } else {
        setCurrentIndex((prev) => prev + 1);
        setShowAnswer(false);
        setSelectedLevel(null);
      }
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Error updating note", { description: "Please try again." });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSkip = () => {
    if (!currentNote) return;
    saveSession({
      currentIndex: Math.min(
        currentIndex + 1,
        Math.max(sessionNotes.length - 1, 0)
      ),
    });
    if (isLastNote) {
      toast.success("Practice session completed!", {
        description: `You reviewed ${completedNotes.length} out of ${sessionNotes.length} notes.`,
      });
      endSession();
    } else {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
      setSelectedLevel(null);
    }
  };

  // Session ended - show summary logic moved to parent
  /*
  if (ended) {
    console.log("[ReviewSession] Rendering SessionSummary:", {
      ended,
      snapshotNotesLength: snapshotNotes.length,
      responsesLength: responses.length,
    });

    return (
      <SessionSummary
        notes={snapshotNotes.length > 0 ? snapshotNotes : notes}
        responses={responses}
        startedAt={startedAtRef.current}
        onRestart={startSession}
        onClose={closeSummary}
      />
    );
  }
  */

  if (!isStarted) {
    return (
      <Card className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,theme(colors.primary/10),transparent_60%)]"
        />
        <CardHeader>
          <CardTitle className="text-center">Ready to practice?</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Start a quick quiz session with the notes selected on this page. You
            can leave and return to continue.
          </p>
          <Button
            onClick={() => guardAction("start review session", startSession)}
            className="px-6"
          >
            <Play className="h-4 w-4 mr-2" /> Start
          </Button>
        </CardContent>
      </Card>
    );
  }

  // currentNote is guaranteed from here

  return (
    <div className="space-y-6">
      {/* Progress + End */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} of {sessionNotes.length}
          </span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="px-3">
                <CircleStop className="h-4 w-4 mr-2" /> End Session
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>End session?</AlertDialogTitle>
                <AlertDialogDescription>
                  You can start again later. Your current progress in this
                  session will be cleared.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={endSession}>
                  End Session
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Review Card */}
      <Card className="relative">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-xl leading-tight mb-3">
                {currentNote.question}
              </CardTitle>

              {/* Course info */}
              {currentNote.course && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <span>{currentNote.course.title}</span>
                  <span>•</span>
                  <span>{currentNote.course.instructor}</span>
                </div>
              )}

              {/* Current understanding and flags */}
              <div className="flex items-center gap-2 flex-wrap">
                <UnderstandingBadge level={currentNote.understanding_level} />
                {currentNote.flag && (
                  <Badge
                    variant="outline"
                    className="text-orange-600 border-orange-600"
                  >
                    <Flag className="h-3 w-3 mr-1" />
                    Flagged
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Answer Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Answer</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAnswer(!showAnswer)}
              >
                {showAnswer ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide Answer
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Show Answer
                  </>
                )}
              </Button>
            </div>

            {showAnswer ? (
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="leading-relaxed">
                  {currentNote.answer || (
                    <span className="italic text-muted-foreground">
                      No answer recorded yet
                    </span>
                  )}
                </p>
              </div>
            ) : (
              <div className="bg-muted/30 p-8 rounded-lg text-center text-muted-foreground">
                Click "Show Answer" to reveal the answer
              </div>
            )}
          </div>

          {/* Understanding Selection */}
          {showAnswer && (
            <div className="space-y-4">
              <h4 className="font-medium">
                How well do you understand this now?
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <Button
                    key={level}
                    variant={
                      (selectedLevel ?? currentNote.understanding_level) ===
                      level
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedLevel(level)}
                    disabled={isUpdating}
                    className="flex flex-col gap-1 h-auto py-3"
                  >
                    <span className="font-semibold">{level}</span>
                    <span className="text-xs">
                      {
                        {
                          1: "Confused",
                          2: "Unclear",
                          3: "Getting It",
                          4: "Clear",
                          5: "Crystal Clear",
                        }[level]
                      }
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      variant="outline"
                      onClick={handleSkip}
                      disabled={isUpdating}
                      aria-label="Skip note"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Skip for Now
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>Skip this note</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {showAnswer && (
              <Button
                onClick={() =>
                  handleUpdateUnderstanding(
                    selectedLevel ?? currentNote.understanding_level
                  )
                }
                disabled={isUpdating}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isLastNote ? "Complete Session" : "Next Question"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Session Stats */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Completed: {completedNotes.length}</span>
            <span>Remaining: {notes.length - currentIndex - 1}</span>
            <span>Total: {notes.length}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function SessionSummary({
  notes,
  responses,
  startedAt,
  onRestart,
  onClose,
}: {
  notes: Note[];
  responses: { noteId: string; previous: number; next: number }[];
  startedAt: number | null;
  onRestart: () => void;
  onClose: () => void;
}) {
  const durationMs = startedAt ? Date.now() - startedAt : 0;
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);

  const byId = useMemo(() => {
    const m = new Map<string, Note>();
    for (const n of notes) m.set(n.id, n);
    return m;
  }, [notes]);

  const improved = responses.filter((r) => r.next > r.previous).length;
  const regressed = responses.filter((r) => r.next < r.previous).length;
  const unchanged = responses.length - improved - regressed;
  const correctCount = responses.filter((r) => r.next >= 4).length;
  const accuracyPct =
    responses.length > 0
      ? Math.round((correctCount / responses.length) * 100)
      : 0;

  const weakest = useMemo(() => {
    const list = [...responses]
      .map((r) => ({ ...r, note: byId.get(r.noteId)! }))
      .sort((a, b) => a.next - b.next)
      .slice(0, 5);
    return list;
  }, [responses, byId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Session Summary</span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onRestart}>
              <RotateCcw className="h-4 w-4 mr-2" /> Restart
            </Button>
            <Button variant="default" onClick={onClose}>
              <CircleStop className="h-4 w-4 mr-2" /> Close
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1 p-4 rounded-lg bg-muted/30 border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              <span>Accuracy</span>
            </div>
            <div className="text-2xl font-bold">{accuracyPct}%</div>
            <div className="text-xs text-muted-foreground">
              {correctCount} correct responses
            </div>
          </div>
          <div className="flex flex-col gap-1 p-4 rounded-lg bg-muted/30 border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Timer className="h-4 w-4" />
              <span>Time Spent</span>
            </div>
            <div className="text-2xl font-bold">
              {minutes}m {seconds}s
            </div>
            <div className="text-xs text-muted-foreground">
              Session duration
            </div>
          </div>
          <div className="flex flex-col gap-1 p-4 rounded-lg bg-muted/30 border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" />
              <span>Total Reviewed</span>
            </div>
            <div className="text-2xl font-bold">{responses.length}</div>
            <div className="text-xs text-muted-foreground">Notes processed</div>
          </div>
        </div>

        <Separator />

        {/* Performance Overview */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            Performance Overview
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-1 text-green-600 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">Improved</span>
              </div>
              <span className="text-xl font-bold text-green-700 dark:text-green-400">
                {improved}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <Minus className="h-4 w-4" />
                <span className="text-sm font-medium">Unchanged</span>
              </div>
              <span className="text-xl font-bold">{unchanged}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-1 text-red-600 mb-1">
                <TrendingDown className="h-4 w-4" />
                <span className="text-sm font-medium">Regressed</span>
              </div>
              <span className="text-xl font-bold text-red-700 dark:text-red-400">
                {regressed}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Review Activity */}
        <div className="space-y-4">
          <h4 className="font-medium">Review Activity</h4>
          <div className="space-y-2">
            {weakest.length === 0 ? (
              <div className="text-sm text-muted-foreground italic pl-6">
                No notes reviewed in this session.
              </div>
            ) : (
              weakest.map((w) => (
                <div
                  key={w.noteId}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card/50"
                >
                  <span className="text-sm font-medium truncate mr-4 flex-1">
                    {w.note.question}
                  </span>
                  <div className="flex items-center gap-2 text-sm shrink-0">
                    <span className="text-muted-foreground">
                      Lvl {w.previous}
                    </span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span
                      className={
                        w.next > w.previous
                          ? "font-semibold text-green-600"
                          : w.next < w.previous
                          ? "font-semibold text-red-600"
                          : "font-semibold"
                      }
                    >
                      Lvl {w.next}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
