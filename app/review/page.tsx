"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { ReviewSession } from "@/components/review-session";
import { ReviewControls } from "@/components/review-controls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { FileQuestion } from "lucide-react";
import { Brain, Flag, Shuffle } from "lucide-react";
import { useNotes } from "@/hooks/use-data";
import { useCourses } from "@/hooks/use-data";
import { ReviewSkeleton } from "@/components/loading-skeletons";

function ReviewPageContent() {
  const searchParams = useSearchParams();
  const course = searchParams.get("course") || undefined;
  const flagged = searchParams.get("flagged");
  const shuffle = (searchParams.get("shuffle") ?? "true") === "true";
  const limit = Math.max(
    1,
    Math.min(100, Number.parseInt(searchParams.get("limit") || "20"))
  );

  const filters = useMemo(
    () => ({
      courseId: course,
      flagged: flagged === "true" ? true : undefined,
    }),
    [course, flagged]
  );

  const { notes, isLoading } = useNotes(filters);
  const { courses } = useCourses();

  // Prepare session notes
  const sessionNotes = useMemo(() => {
    // Don't return empty during refetches - keep component mounted with current notes
    const filtered = shuffle
      ? [...notes].sort(() => Math.random() - 0.5)
      : notes;
    return filtered.slice(0, limit);
  }, [notes, shuffle, limit]);

  const flaggedInSession = sessionNotes.filter((n) => n.flag).length;

  if (isLoading) {
    return <ReviewSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Practice Session
            </h1>
            <p className="text-muted-foreground">
              Quick quiz on your notes. Start anytime.
            </p>
          </div>
          <div />
        </div>

        {/* Quick Controls */}
        <div className="mb-6">
          <ReviewControls courses={courses} />
        </div>

        {/* Session Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Session</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sessionNotes.length}</div>
              <p className="text-xs text-muted-foreground">Selected notes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Flagged</CardTitle>
              <Flag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{flaggedInSession}</div>
              <p className="text-xs text-muted-foreground">Priority items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Order</CardTitle>
              <Shuffle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {shuffle ? "Shuffled" : "Fixed"}
              </div>
              <p className="text-xs text-muted-foreground">Practice order</p>
            </CardContent>
          </Card>
        </div>

        {/* Practice Session */}
        {sessionNotes.length > 0 ? (
          <ReviewSession notes={sessionNotes} />
        ) : (
          <EmptyState
            title="No notes available"
            description="Add notes first, or adjust filters to include more content for practice."
            icon={<FileQuestion className="h-6 w-6 text-muted-foreground" />}
            primaryAction={{ label: "Add Notes", href: "/notes" }}
          />
        )}
      </div>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<ReviewSkeleton />}>
      <ReviewPageContent />
    </Suspense>
  );
}
