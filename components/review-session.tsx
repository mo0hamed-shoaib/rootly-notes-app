"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { UnderstandingBadge } from "@/components/understanding-badge"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabase/client"
import { Eye, EyeOff, RotateCcw, CheckCircle, Flag, Play, CircleStop } from "lucide-react"
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
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import type { Note } from "@/lib/types"
import { useEditingGuard } from "@/hooks/use-editing-guard"

interface ReviewSessionProps {
  notes: (Note & { course?: { title: string; instructor: string } })[]
}

export function ReviewSession({ notes }: ReviewSessionProps) {
  const [isStarted, setIsStarted] = useState(false)
  const [orderedNoteIds, setOrderedNoteIds] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [completedNotes, setCompletedNotes] = useState<string[]>([])
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)
  const [responses, setResponses] = useState<{ noteId: string; previous: number; next: number }[]>([])
  const [ended, setEnded] = useState(false)
  const startedAtRef = useRef<number | null>(null)
  const router = useRouter()
  const STORAGE_KEY = "rootly_review_session_v1"
  const { guardAction } = useEditingGuard()

  const idToNote = useMemo(() => {
    const map = new Map<string, Note>()
    for (const n of notes) map.set(n.id, n)
    return map
  }, [notes])

  const sessionNotes: Note[] = useMemo(() => {
    if (orderedNoteIds.length === 0) return []
    return orderedNoteIds.map((id) => idToNote.get(id)).filter(Boolean) as Note[]
  }, [orderedNoteIds, idToNote])

  const currentNote = sessionNotes[currentIndex]
  const progress = sessionNotes.length > 0 ? ((currentIndex + 1) / sessionNotes.length) * 100 : 0
  const isLastNote = sessionNotes.length > 0 && currentIndex === sessionNotes.length - 1

  function saveSession(next: {
    orderedIds?: string[]
    currentIndex?: number
    completed?: string[]
    isStarted?: boolean
  }) {
    try {
      const payload = {
        orderedIds: next.orderedIds ?? orderedNoteIds,
        currentIndex: next.currentIndex ?? currentIndex,
        completed: next.completed ?? completedNotes,
        isStarted: next.isStarted ?? isStarted,
        savedAt: Date.now(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {}
  }

  function clearSession() {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }

  // Restore session on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as {
        orderedIds: string[]
        currentIndex: number
        completed: string[]
        isStarted: boolean
      }
      const filteredIds = (parsed.orderedIds || []).filter((id) => idToNote.has(id))
      if (filteredIds.length > 0 && parsed.isStarted) {
        setOrderedNoteIds(filteredIds)
        setCurrentIndex(Math.min(parsed.currentIndex ?? 0, filteredIds.length - 1))
        setCompletedNotes((parsed.completed || []).filter((id) => idToNote.has(id)))
        setIsStarted(true)
        startedAtRef.current = Date.now()
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const startSession = () => {
    const order = notes.map((n) => n.id)
    setOrderedNoteIds(order)
    setCurrentIndex(0)
    setCompletedNotes([])
    setShowAnswer(false)
    setSelectedLevel(null)
    setIsStarted(true)
    setResponses([])
    setEnded(false)
    startedAtRef.current = Date.now()
    saveSession({ orderedIds: order, currentIndex: 0, completed: [], isStarted: true })
  }

  const endSession = () => {
    clearSession()
    setIsStarted(false)
    setOrderedNoteIds([])
    setCurrentIndex(0)
    setCompletedNotes([])
    setShowAnswer(false)
    setSelectedLevel(null)
    setEnded(true)
    toast.success("Practice session ended", { description: "You can start a new session anytime." })
  }

  const closeSummary = () => {
    setEnded(false)
  }

  const handleUpdateUnderstanding = async (newLevel: number) => {
    if (!currentNote) return

    setIsUpdating(true)
    try {
      const { error } = await supabase
        .from("notes")
        .update({
          understanding_level: newLevel,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentNote.id)

      if (error) throw error

      setCompletedNotes((prev) => [...prev, currentNote.id])
      setResponses((prev) => [
        ...prev,
        { noteId: currentNote.id, previous: currentNote.understanding_level, next: newLevel },
      ])
      saveSession({ currentIndex: Math.min(currentIndex + 1, Math.max(sessionNotes.length - 1, 0)), completed: [...completedNotes, currentNote.id] })

      if (isLastNote) {
        toast.success("Practice session completed!", { description: `You reviewed ${sessionNotes.length} notes.` })
        clearSession()
        setIsStarted(false)
        setEnded(true)
        setShowAnswer(false)
        setSelectedLevel(null)
      } else {
        setCurrentIndex((prev) => prev + 1)
        setShowAnswer(false)
        setSelectedLevel(null)
      }
    } catch (error) {
      console.error("Error updating note:", error)
      toast.error("Error updating note", { description: "Please try again." })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSkip = () => {
    if (!currentNote) return
    saveSession({ currentIndex: Math.min(currentIndex + 1, Math.max(sessionNotes.length - 1, 0)) })
    if (isLastNote) {
      toast.success("Practice session completed!", {
        description: `You reviewed ${completedNotes.length} out of ${sessionNotes.length} notes.`,
      })
      endSession()
    } else {
      setCurrentIndex((prev) => prev + 1)
      setShowAnswer(false)
      setSelectedLevel(null)
    }
  }

  // Not started state
  if (ended) {
    return (
      <SessionSummary
        notes={notes}
        responses={responses}
        startedAt={startedAtRef.current}
        onRestart={startSession}
        onClose={closeSummary}
      />
    )
  }

  if (!isStarted && !ended) {
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
            Start a quick quiz session with the notes selected on this page. You can leave and return to continue.
          </p>
          <Button 
            onClick={() => guardAction("start review session", startSession)} 
            className="px-6"
          >
            <Play className="h-4 w-4 mr-2" /> Start
          </Button>
        </CardContent>
      </Card>
    )
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
                  You can start again later. Your current progress in this session will be cleared.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={endSession}>End Session</AlertDialogAction>
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
              <CardTitle className="text-xl leading-tight mb-3">{currentNote.question}</CardTitle>

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
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
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
              <h3 className="text-lg font-medium">Answer</h3>
              <Button variant="outline" size="sm" onClick={() => setShowAnswer(!showAnswer)}>
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
                  {currentNote.answer || <span className="italic text-muted-foreground">No answer recorded yet</span>}
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
              <h4 className="font-medium">How well do you understand this now?</h4>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <Button
                    key={level}
                    variant={(selectedLevel ?? currentNote.understanding_level) === level ? "default" : "outline"}
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
                    <Button variant="outline" onClick={handleSkip} disabled={isUpdating} aria-label="Skip note">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Skip for Now
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>Skip this note</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {showAnswer && (
              <Button onClick={() => handleUpdateUnderstanding(selectedLevel ?? currentNote.understanding_level)} disabled={isUpdating}>
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
  )
}

function SessionSummary({
  notes,
  responses,
  startedAt,
  onRestart,
  onClose,
}: {
  notes: Note[]
  responses: { noteId: string; previous: number; next: number }[]
  startedAt: number | null
  onRestart: () => void
  onClose: () => void
}) {
  const durationMs = startedAt ? Date.now() - startedAt : 0
  const minutes = Math.floor(durationMs / 60000)
  const seconds = Math.floor((durationMs % 60000) / 1000)

  const byId = useMemo(() => {
    const m = new Map<string, Note>()
    for (const n of notes) m.set(n.id, n)
    return m
  }, [notes])

  const improved = responses.filter((r) => r.next > r.previous).length
  const regressed = responses.filter((r) => r.next < r.previous).length
  const unchanged = responses.length - improved - regressed
  const correctCount = responses.filter((r) => r.next >= 4).length
  const accuracyPct = responses.length > 0 ? Math.round((correctCount / responses.length) * 100) : 0

  const weakest = useMemo(() => {
    const list = [...responses]
      .map((r) => ({ ...r, note: byId.get(r.noteId)! }))
      .sort((a, b) => a.next - b.next)
      .slice(0, 5)
    return list
  }, [responses, byId])

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
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Time spent</div>
            <div className="text-2xl font-bold">{minutes}m {seconds}s</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Responses</div>
            <div className="text-2xl font-bold">{responses.length}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Improved</div>
            <div className="text-2xl font-bold">{improved}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
            <div className="text-2xl font-bold">{accuracyPct}%</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div>Unchanged: {unchanged}</div>
          <div>Regressed: {regressed}</div>
          <div>Total notes: {notes.length}</div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Weakest notes</h4>
          <ul className="space-y-2">
            {weakest.length === 0 && (
              <li className="text-sm text-muted-foreground">No responses recorded.</li>
            )}
            {weakest.map((w) => (
              <li key={w.noteId} className="flex items-center justify-between gap-2">
                <a
                  className="text-sm underline underline-offset-2"
                  href={`/notes#note-${w.noteId}`}
                >
                  {w.note.question}
                </a>
                <div className="flex items-center gap-2 text-xs">
                  <span>Level {w.previous} → {w.next}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
