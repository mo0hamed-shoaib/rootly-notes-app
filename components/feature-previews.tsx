"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { UnderstandingBadge } from "@/components/understanding-badge"
import { MoodIndicator } from "@/components/mood-indicator"
import { BookOpen, Calendar, User, Clock, Flag, CodeXml, Eye, CheckCircle, RotateCcw, EyeOff } from "lucide-react"
import { formatStudyTime } from "@/lib/time-utils"
import { seedCourses, seedNotes, getSeedDailyEntries } from "@/lib/data/seed-data"
import { UnderstandingChart } from "@/components/understanding-chart"
import { StudyTimeChart } from "@/components/study-time-chart"
import { MoodChart } from "@/components/mood-chart"
import { CourseProgressChart } from "@/components/course-progress-chart"
import { Palette } from "lucide-react"

// Generate preview data
const previewCourses = seedCourses.map((course, idx) => ({
  ...course,
  id: `preview-course-${idx}`,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  note_count: idx === 0 ? 4 : 2,
}))

const previewNotes = seedNotes("preview-course-0", "preview-course-1").slice(0, 3).map((note, idx) => ({
  ...note,
  id: `preview-note-${idx}`,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  course: previewCourses[0],
}))

const previewDailyEntries = getSeedDailyEntries().slice(0, 3).map((entry, idx) => ({
  ...entry,
  id: `preview-entry-${idx}`,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}))

// Preview data for charts
const previewChartNotes = seedNotes("preview-course-0", "preview-course-1").map((note, idx) => ({
  understanding_level: note.understanding_level,
  created_at: new Date(Date.now() - idx * 86400000).toISOString(),
}))

const previewChartDailyEntries = getSeedDailyEntries().map((entry) => ({
  date: entry.date,
  study_time: entry.study_time,
  mood: entry.mood,
  notes: entry.notes,
}))

const previewChartCourses = previewCourses.map((course) => ({
  id: course.id,
  title: course.title,
  notes: seedNotes(course.id, course.id).map((note, idx) => ({
    id: `preview-note-${course.id}-${idx}`,
    understanding_level: note.understanding_level,
  })),
}))

export function CoursesPreview() {
  const courses = previewCourses.slice(0, 2)
  // Duplicate multiple times for seamless horizontal loop (need enough for smooth continuous scroll)
  const duplicatedCourses = [...courses, ...courses, ...courses, ...courses, ...courses, ...courses]
  
  return (
    <div className="px-3 py-0.5 pointer-events-none h-full overflow-hidden relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="flex animate-marquee-right gap-3 h-full items-center whitespace-nowrap">
        {duplicatedCourses.map((course, idx) => (
          <Card key={`${course.id}-${idx}`} className="border shadow-sm flex-shrink-0 w-[200px] inline-block">
            <CardHeader className="pb-1 pt-1.5 px-2.5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-semibold leading-tight mb-0.5 line-clamp-1">{course.title}</h2>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-0.5">
                    <User className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{course.instructor}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <BookOpen className="h-3 w-3 flex-shrink-0" />
                    <span>{course.note_count} notes</span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function NotesPreview() {
  // Get all notes for better marquee effect
  const allNotes = seedNotes("preview-course-0", "preview-course-1").slice(0, 4).map((note, idx) => ({
    ...note,
    id: `preview-note-${idx}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    course: previewCourses[0],
  }))
  // Duplicate for seamless loop
  const duplicatedNotes = [...allNotes, ...allNotes, ...allNotes]
  
  return (
    <div className="px-3 py-0.5 pointer-events-none h-full overflow-hidden relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="animate-marquee-up space-y-1.5">
        {duplicatedNotes.map((note, idx) => (
          <Card key={`${note.id}-${idx}`} className="border shadow-sm">
            <CardHeader className="pb-1 pt-1.5 px-2.5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xs font-semibold leading-tight mb-0.5 line-clamp-1">{note.question}</h2>
                  <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                    <UnderstandingBadge level={note.understanding_level} />
                    {note.flag && (
                      <Badge variant="outline" className="text-orange-600 border-orange-600 text-[10px] px-1.5 py-0">
                        <Flag className="h-2.5 w-2.5 mr-0.5" />
                        Flagged
                      </Badge>
                    )}
                    {note.code_snippet && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        <CodeXml className="h-2.5 w-2.5 mr-0.5" />
                        Code
                      </Badge>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">{note.answer}</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function DailyPreview() {
  // Get all daily entries for better marquee effect
  const allEntries = getSeedDailyEntries().map((entry, idx) => ({
    ...entry,
    id: `preview-entry-${idx}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }))
  // Duplicate for seamless loop
  const duplicatedEntries = [...allEntries, ...allEntries, ...allEntries]
  
  return (
    <div className="px-3 py-0.5 pointer-events-none h-full overflow-hidden relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="animate-marquee-up space-y-1.5">
        {duplicatedEntries.map((entry, idx) => (
          <Card key={`${entry.id}-${idx}`} className="border shadow-sm">
            <CardHeader className="pb-1 pt-1.5 px-2.5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="flex items-center gap-1.5 text-xs font-semibold mb-0.5">
                    <Calendar className="h-3 w-3" />
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </h2>
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="flex items-center gap-1 text-[10px]">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>{formatStudyTime(entry.study_time)}</span>
                    </div>
                    <MoodIndicator mood={entry.mood} />
                  </div>
                  <p className="text-[10px] text-muted-foreground line-clamp-1 leading-relaxed">{entry.notes}</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function ReviewPreview() {
  const totalNotes = previewNotes.length
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Cycle through notes
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % previewNotes.length)
        setShowAnswer(false)
        setIsTransitioning(false)
      }, 300)
    }, 5000) // Change note every 5 seconds

    return () => clearInterval(interval)
  }, [])

  // Auto-show answer after 1.5s
  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        setShowAnswer(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, isTransitioning])

  const note = previewNotes[currentIndex]
  const progress = ((currentIndex + 1) / totalNotes) * 100

  return (
    <div className="px-4 py-3 pointer-events-none h-full w-full flex flex-col gap-3 overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Progress */}
      <div className="space-y-1 flex-shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">{currentIndex + 1} of {totalNotes}</span>
        </div>
        <Progress value={progress} className="h-1" />
      </div>

      {/* Question */}
      <div className="flex-shrink-0">
        <h3 
          className={`text-sm font-semibold leading-tight transition-opacity duration-500 ease-in-out ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          {note.question}
        </h3>
      </div>

      {/* Show/Hide Answer Button */}
      <div className="flex items-center justify-end flex-shrink-0">
        <Button 
          variant={showAnswer ? "secondary" : "outline"} 
          size="sm" 
          className={`h-7 px-3 text-[10px] pointer-events-none transition-all duration-500 ease-in-out ${
            isTransitioning ? "opacity-0" : showAnswer ? "opacity-70" : "opacity-100"
          }`}
        >
          {showAnswer ? (
            <>
              <EyeOff className="h-3.5 w-3.5 mr-1.5" />
              Hide Answer
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              Show Answer
            </>
          )}
        </Button>
      </div>

      {/* Answer */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {!showAnswer ? (
          <div 
            className={`bg-muted/30 p-3 rounded-md text-center text-[10px] text-muted-foreground flex items-center justify-center h-full transition-all duration-500 ease-in-out ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            Click "Show Answer" to reveal
          </div>
        ) : (
          <div 
            className={`bg-muted/50 p-3 rounded-md text-[10px] text-foreground leading-relaxed overflow-y-auto break-words whitespace-normal h-full transition-all duration-500 ease-in-out ${
              isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
            style={{
              animation: showAnswer && !isTransitioning ? "fadeInUp 0.5s ease-out" : "none"
            }}
          >
            {note.answer}
          </div>
        )}
      </div>
    </div>
  )
}

export function ChartsPreview() {
  return (
    <div className="px-4 pt-2 pb-3 pointer-events-none overflow-hidden h-full flex items-start [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="w-full h-[180px] scale-70 origin-top">
        <UnderstandingChart data={previewChartNotes} />
      </div>
    </div>
  )
}

export function ThemesPreview() {
  // Actual accent colors from theme-toggle.tsx (using oklch format)
  const accentColors = [
    { name: "Rose", value: "oklch(0.645 0.246 16.439)" },
    { name: "Red", value: "oklch(0.65 0.25 25)" },
    { name: "Orange", value: "oklch(0.67 0.23 50)" },
    { name: "Yellow", value: "oklch(0.9 0.12 100)" },
    { name: "Green", value: "oklch(0.7 0.15 150)" },
    { name: "Blue", value: "oklch(0.72 0.16 240)" },
    { name: "Violet", value: "oklch(0.65 0.2 300)" },
  ]
  
  return (
    <div className="px-4 py-3 pointer-events-none h-full flex flex-col items-center justify-center gap-4">
      {/* Theme modes */}
      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-center gap-1.5">
          <div 
            className="w-16 h-16 rounded-lg border-2 shadow-sm flex items-center justify-center relative overflow-hidden"
            style={{ 
              backgroundColor: "oklch(1 0 0)",
              borderColor: "oklch(0.922 0 0)"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-oklch(0.97 0 0) opacity-30"></div>
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: "oklch(0.922 0 0)" }}></div>
            <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full" style={{ backgroundColor: "oklch(0.97 0 0)" }}></div>
          </div>
          <span className="text-[10px] font-medium text-muted-foreground">Light</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div 
            className="w-16 h-16 rounded-lg border-2 shadow-sm flex items-center justify-center relative overflow-hidden"
            style={{ 
              backgroundColor: "oklch(0.145 0 0)",
              borderColor: "oklch(0.269 0 0)"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-oklch(0.145 0 0) to-oklch(0.21 0 0) opacity-50"></div>
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: "oklch(0.269 0 0)" }}></div>
            <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full" style={{ backgroundColor: "oklch(0.21 0 0)" }}></div>
          </div>
          <span className="text-[10px] font-medium text-muted-foreground">Dark</span>
        </div>
      </div>
      
      {/* Accent colors */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {accentColors.map((color, idx) => (
          <div
            key={idx}
            className="w-6 h-6 rounded-full border-2 border-border shadow-sm"
            style={{ backgroundColor: color.value }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  )
}

