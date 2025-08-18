"use client"

import { useMemo } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface CourseProgressChartProps {
  data: Array<{
    id: string
    title: string
    notes: Array<{
      id: string
      understanding_level: number
    }>
  }>
}

export function CourseProgressChart({ data }: CourseProgressChartProps) {
  const chartData = useMemo(() => {
    if (!data.length) return []

    return data
      .filter((course) => course.notes && course.notes.length > 0)
      .map((course) => {
        const avgUnderstanding = course.notes.length
          ? course.notes.reduce((sum, note) => sum + note.understanding_level, 0) / course.notes.length
          : 0

        return {
          course: course.title.length > 15 ? course.title.substring(0, 15) + "..." : course.title,
          fullTitle: course.title,
          understanding: Number(avgUnderstanding.toFixed(1)),
          noteCount: course.notes.length,
        }
      })
      .sort((a, b) => b.understanding - a.understanding)
      .slice(0, 6) // Top 6 courses for better visibility
  }, [data])

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        <div className="text-center">
          <p className="text-sm">No course data yet</p>
          <p className="text-xs mt-1">Add some courses and notes to see progress!</p>
        </div>
      </div>
    )
  }

  return (
    <ChartContainer
      config={{
        understanding: {
          label: "Avg Understanding",
          color: "var(--chart-4)",
        },
        noteCount: {
          label: "Notes Count",
          color: "var(--chart-5)",
        },
      }}
      className="min-h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="course" angle={-45} textAnchor="end" height={80} fontSize={12} />
          <YAxis domain={[0, 5]} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="understanding" fill="var(--chart-4)" radius={[4, 4, 0, 0]} name="Avg Understanding" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
