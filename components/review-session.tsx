"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UnderstandingBadge } from "@/components/understanding-badge"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabase/client"
import { Eye, EyeOff, RotateCcw, CheckCircle, Flag } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { Note } from "@/lib/types"

interface ReviewSessionProps {
  notes: (Note & { course?: { title: string; instructor: string } })[]
}

export function ReviewSession({ notes }: ReviewSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [completedNotes, setCompletedNotes] = useState<string[]>([])
  const router = useRouter()

  const currentNote = notes[currentIndex]
  const progress = ((currentIndex + 1) / notes.length) * 100
  const isLastNote = currentIndex === notes.length - 1

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

      if (isLastNote) {
        toast({
          title: "Review session completed!",
          description: `You reviewed ${notes.length} notes. Great job!`,
        })
        router.push("/")
      } else {
        setCurrentIndex((prev) => prev + 1)
        setShowAnswer(false)
      }
    } catch (error) {
      console.error("Error updating note:", error)
      toast({
        title: "Error updating note",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSkip = () => {
    if (isLastNote) {
      toast({
        title: "Review session completed!",
        description: `You reviewed ${completedNotes.length} out of ${notes.length} notes.`,
      })
      router.push("/")
    } else {
      setCurrentIndex((prev) => prev + 1)
      setShowAnswer(false)
    }
  }

  if (!currentNote) return null

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>
            {currentIndex + 1} of {notes.length}
          </span>
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

          {/* Understanding Update */}
          {showAnswer && (
            <div className="space-y-4">
              <h4 className="font-medium">How well do you understand this now?</h4>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <Button
                    key={level}
                    variant={currentNote.understanding_level === level ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleUpdateUnderstanding(level)}
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
            <Button variant="outline" onClick={handleSkip} disabled={isUpdating}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Skip for Now
            </Button>

            {showAnswer && (
              <Button onClick={() => handleUpdateUnderstanding(currentNote.understanding_level)} disabled={isUpdating}>
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
