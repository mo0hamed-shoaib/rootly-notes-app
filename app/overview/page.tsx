"use client";

import { useMemo, Suspense } from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  BookOpen,
  Brain,
  Calendar,
  TrendingUp,
  Target,
  BarChart3,
} from "lucide-react";
import { useCourses } from "@/hooks/use-data";
import { useNotes } from "@/hooks/use-data";
import { useDailyEntries } from "@/hooks/use-data";
import { OverviewSkeleton } from "@/components/loading-skeletons";

// Lazy load chart components - they're heavy and not needed for initial render
const UnderstandingChart = dynamic(
  () =>
    import("@/components/understanding-chart").then((mod) => ({
      default: mod.UnderstandingChart,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        Loading chart...
      </div>
    ),
  }
);

const StudyTimeChart = dynamic(
  () =>
    import("@/components/study-time-chart").then((mod) => ({
      default: mod.StudyTimeChart,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        Loading chart...
      </div>
    ),
  }
);

const MoodChart = dynamic(
  () =>
    import("@/components/mood-chart").then((mod) => ({
      default: mod.MoodChart,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        Loading chart...
      </div>
    ),
  }
);

const CourseProgressChart = dynamic(
  () =>
    import("@/components/course-progress-chart").then((mod) => ({
      default: mod.CourseProgressChart,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        Loading chart...
      </div>
    ),
  }
);

export default function OverviewPage() {
  const { courses, isLoading: coursesLoading } = useCourses();
  const { notes, isLoading: notesLoading } = useNotes();
  const { entries, isLoading: entriesLoading } = useDailyEntries();

  const isLoading = coursesLoading || notesLoading || entriesLoading;

  // Calculate stats
  const stats = useMemo(() => {
    const totalCourses = courses.length;
    const totalNotes = notes.length;
    const avgUnderstanding =
      notes.length > 0
        ? (
            notes.reduce((sum, note) => sum + note.understanding_level, 0) /
            notes.length
          ).toFixed(1)
        : "0";
    const totalStudyTime = entries
      .filter((e) => {
        const entryDate = new Date(e.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return entryDate >= thirtyDaysAgo;
      })
      .reduce((sum, entry) => sum + entry.study_time, 0);

    return { totalCourses, totalNotes, avgUnderstanding, totalStudyTime };
  }, [courses, notes, entries]);

  // Prepare course progress data
  const courseProgress = useMemo(() => {
    return courses.slice(0, 10).map((course) => ({
      id: course.id,
      title: course.title,
      notes: notes
        .filter((note) => note.course_id === course.id)
        .map((note) => ({
          id: note.id,
          understanding_level: note.understanding_level,
        })),
    }));
  }, [courses, notes]);

  // Get last 30 days of entries for charts
  const recentEntries = useMemo(() => {
    return entries
      .filter((e) => {
        const entryDate = new Date(e.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return entryDate >= thirtyDaysAgo;
      })
      .slice(0, 30);
  }, [entries]);

  if (isLoading) {
    return <OverviewSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rootly Notes</h1>
            <p className="text-muted-foreground">
              Your learning journey tracker
            </p>
          </div>
          <div className="flex items-center gap-4"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Courses
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                Active learning paths
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalNotes}</div>
              <p className="text-xs text-muted-foreground">
                Questions captured
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Understanding
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.avgUnderstanding}/5
              </div>
              <p className="text-xs text-muted-foreground">
                Comprehension level
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Time</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(stats.totalStudyTime / 60)}h
              </div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Understanding Progress Chart */}
          <Card className="flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Understanding Progress</CardTitle>
              </div>
              <CardDescription>
                Track your comprehension levels over time and identify learning
                trends
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <UnderstandingChart data={notes} />
            </CardContent>
          </Card>

          {/* Study Time Chart */}
          <Card className="flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Daily Study Sessions</CardTitle>
              </div>
              <CardDescription>
                Monitor your study consistency and time investment patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <StudyTimeChart data={recentEntries} />
            </CardContent>
          </Card>

          {/* Mood Tracking Chart */}
          <Card className="flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Learning Mood Analysis</CardTitle>
              </div>
              <CardDescription>
                Understand how your emotional state affects your learning
                journey
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <MoodChart data={recentEntries} />
            </CardContent>
          </Card>

          {/* Course Progress Chart */}
          <Card className="flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Course Mastery Overview</CardTitle>
              </div>
              <CardDescription>
                Compare understanding levels across different courses and
                subjects
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <CourseProgressChart data={courseProgress} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
