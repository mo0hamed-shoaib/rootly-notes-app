"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BookOpen, Award, TrendingUp, Star } from "lucide-react";

interface CourseProgressChartProps {
  data: Array<{
    id: string;
    title: string;
    notes: Array<{
      id: string;
      understanding_level: number;
    }>;
  }>;
}

export function CourseProgressChart({ data }: CourseProgressChartProps) {
  const { chartData, insights } = useMemo(() => {
    if (!data.length) return { chartData: [], insights: null };

    const processedData = data
      .filter((course) => course.notes && course.notes.length > 0)
      .map((course) => {
        const avgUnderstanding = course.notes.length
          ? course.notes.reduce(
              (sum, note) => sum + note.understanding_level,
              0
            ) / course.notes.length
          : 0;

        return {
          shortTitle:
            course.title.length > 12
              ? course.title.substring(0, 12) + "…"
              : course.title,
          fullTitle: course.title,
          understanding: Number(avgUnderstanding.toFixed(1)),
          noteCount: course.notes.length,
          id: course.id,
        };
      })
      .sort((a, b) => b.understanding - a.understanding)
      .slice(0, 6); // Top 6 courses to avoid crowded axis

    // Calculate insights
    const bestCourse = processedData[0];
    const avgUnderstanding = Number(
      (
        processedData.reduce((sum, item) => sum + item.understanding, 0) /
        processedData.length
      ).toFixed(1)
    );
    const totalNotes = processedData.reduce(
      (sum, item) => sum + item.noteCount,
      0
    );
    const excellentCourses = processedData.filter(
      (course) => course.understanding >= 4
    ).length;
    const strugglingCourses = processedData.filter(
      (course) => course.understanding < 3
    ).length;

    return {
      chartData: processedData,
      insights: {
        bestCourse: bestCourse?.fullTitle,
        bestScore: bestCourse?.understanding,
        avgUnderstanding,
        totalNotes,
        excellentCourses,
        strugglingCourses,
        totalCourses: processedData.length,
      },
    };
  }, [data]);

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-[340px] text-muted-foreground">
        <div className="text-center">
          <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No course progress data yet</p>
          <p className="text-xs mt-1">
            Add courses and notes to track your learning progress!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ChartContainer
        config={{
          understanding: {
            label: "Understanding Level",
            color: "var(--chart-4)",
          },
        }}
        className="h-[280px] w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
            <XAxis
              dataKey="shortTitle"
              className="text-xs fill-muted-foreground"
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              interval={0}
              tick={{ fontSize: 10 }}
            />
            <YAxis
              domain={[0, 5]}
              className="text-xs fill-muted-foreground"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
              allowDecimals={false}
              ticks={[0, 1, 2, 3, 4, 5]}
              label={{
                value: "Understanding Level",
                angle: -90,
                position: "insideLeft",
                style: {
                  textAnchor: "middle",
                  fill: "hsl(var(--muted-foreground))",
                },
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    chartData.find((item) => item.shortTitle === value)
                      ?.fullTitle || value
                  }
                  formatter={(value, name) => [
                    `${value}/5 (${
                      chartData.find((item) => item.understanding === value)
                        ?.noteCount || 0
                    } notes)`,
                    name === "understanding" ? "Understanding Level" : name,
                  ]}
                />
              }
            />
            <Bar
              dataKey="understanding"
              fill="var(--color-understanding)"
              radius={[4, 4, 0, 0]}
              className="opacity-90 hover:opacity-100 transition-opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {insights && (
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-yellow-500" />
            <span className="text-muted-foreground">
              Top course score:{" "}
              <span className="font-medium text-foreground">
                {insights.bestScore}/5
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-green-500" />
            <span className="text-muted-foreground">
              Excellent courses (≥4):{" "}
              <span className="font-medium text-foreground">
                {insights.excellentCourses}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span className="text-muted-foreground">
              Overall average:{" "}
              <span className="font-medium text-foreground">
                {insights.avgUnderstanding}/5
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
