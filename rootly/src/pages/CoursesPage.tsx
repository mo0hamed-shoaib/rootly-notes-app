// src/pages/CoursesPage.tsx
import { BookOpen, Plus, Edit, Trash2, MoreVertical, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CourseDialog } from "@/components/courses/CourseDialog";
import type { Course, Topic, CourseInput } from "@/types";

interface CoursesPageProps {
  courses: Course[];
  onCreateCourse: (course: CourseInput) => void;
  onUpdateCourse: (courseId: string, updates: Partial<Course>) => void;
  onDeleteCourse: (courseId: string) => void;
  isLoading?: boolean;
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

export function CoursesPage({ 
  courses, 
  onCreateCourse, 
  onUpdateCourse, 
  onDeleteCourse, 
  isLoading = false 
}: CoursesPageProps) {
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
                Courses
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Manage your learning materials
              </p>
            </div>
          </div>
          
          {/* Action Button - Centered */}
          <div className="flex justify-center">
            <CourseDialog
              onSubmit={onCreateCourse}
              isLoading={isLoading}
              trigger={
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Course
                </Button>
              }
            />
          </div>
        </div>

        {/* Courses Section */}
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6 sm:space-y-8">
            {/* Section Header */}
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
                Your Courses
              </h2>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>{courses.length} total courses</span>
              </div>
            </div>

            {/* Courses Grid */}
            {courses.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No courses yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Create your first course to start organizing your learning materials
                </p>
                <CourseDialog
                  onSubmit={onCreateCourse}
                  isLoading={isLoading}
                  trigger={
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Create First Course
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {courses.map((course) => (
                  <Card key={course.id} className="h-full border shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/20 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors flex-1">
                          {course.title}
                        </CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              // Handle edit - we'll need to pass the course data
                              const courseData: CourseInput = {
                                instructor: course.instructor,
                                title: course.title,
                                links: course.links,
                                version: course.version || "",
                                startedAt: course.startedAt,
                                tags: course.tags,
                              };
                              // For now, we'll just call the update function
                              // In a real app, you'd open an edit dialog
                              onUpdateCourse(course.id, courseData);
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onDeleteCourse(course.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        by {course.instructor}
                      </p>
                      
                      {/* Topics */}
                      <div className="flex flex-wrap gap-1">
                        {course.tags?.map((topic) => (
                          <Badge
                            key={topic}
                            variant="outline"
                            className={`text-xs px-2 py-1 ${topicColors[topic]}`}
                          >
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      {/* Course Info */}
                      <div className="space-y-2">
                        {course.version && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-medium">Version:</span>
                            <span>{course.version}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="font-medium">Started:</span>
                          <span>{new Date(course.startedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Links */}
                      {(course.links.course || course.links.repo || course.links.docs) && (
                        <div className="mt-4 pt-3 border-t">
                          <div className="flex flex-wrap gap-2">
                            {course.links.course && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={course.links.course} target="_blank" rel="noopener noreferrer" className="gap-1">
                                  <ExternalLink className="w-3 h-3" />
                                  Course
                                </a>
                              </Button>
                            )}
                            {course.links.repo && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={course.links.repo} target="_blank" rel="noopener noreferrer" className="gap-1">
                                  <ExternalLink className="w-3 h-3" />
                                  Repo
                                </a>
                              </Button>
                            )}
                            {course.links.docs && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={course.links.docs} target="_blank" rel="noopener noreferrer" className="gap-1">
                                  <ExternalLink className="w-3 h-3" />
                                  Docs
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
