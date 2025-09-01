"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { EditCourseDialog } from "@/components/edit-course-dialog"
import { DeleteCourseDialog } from "@/components/delete-course-dialog"
import { Edit, Trash2, ExternalLink, BookOpen, Calendar, User } from "lucide-react"
import type { Course } from "@/lib/types"
import { useEditingGuard } from "@/hooks/use-editing-guard"

interface CoursesGridProps {
  courses: (Course & { note_count: number })[]
}

export function CoursesGrid({ courses }: CoursesGridProps) {
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const { guardAction } = useEditingGuard()

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="relative flex flex-col h-full">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Course Title */}
                  <h3 className="text-lg font-semibold leading-tight mb-2">{course.title}</h3>

                  {/* Instructor */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <User className="h-4 w-4" />
                    <span>{course.instructor}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.note_count} notes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(course.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => guardAction("edit course", () => { setEditingCourse(course); setIsEditOpen(true) })}
                          className="h-8 w-8 p-0"
                          aria-label="Edit course"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit course</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => guardAction("delete course", () => { setDeletingCourse(course); setIsDeleteOpen(true) })}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          aria-label="Delete course"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete course</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col space-y-4">
              {/* Topics */}
              {course.topics && course.topics.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Topics:</h4>
                  <div className="flex flex-wrap gap-1">
                    {course.topics.map((topic, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {course.links && course.links.length > 0 && (
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Resources:</h4>
                  <div className="space-y-1">
                    {course.links.slice(0, 3).map((link, index) => (
                      <Link
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span className="truncate">{new URL(link).hostname}</span>
                      </Link>
                    ))}
                    {course.links.length > 3 && (
                      <p className="text-xs text-muted-foreground">+{course.links.length - 3} more links</p>
                    )}
                  </div>
                </div>
              )}

              {/* View Notes Button - Always at bottom */}
              <div className="mt-auto pt-4">
                <Link href={`/notes?course=${course.id}`}>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Notes ({course.note_count})
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      {editingCourse && (
        <EditCourseDialog
          course={editingCourse}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
        />
      )}

      {/* Delete Dialog */}
      {deletingCourse && (
        <DeleteCourseDialog
          course={deletingCourse}
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
        />
      )}
    </>
  )
}
