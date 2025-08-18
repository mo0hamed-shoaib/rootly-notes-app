"use client"

import { useMemo } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface StudyTimeChartProps {
  data: Array<{
    study_time: number
    date: string
  }>
}

export function StudyTimeChart({ data }: StudyTimeChartProps) {
  const chartData = useMemo(() => {
    if (!data.length) return []

    return data
      .map((entry) => ({
        date: entry.date,
        studyTime: Math.round((entry.study_time / 60) * 10) / 10, // Convert to hours with 1 decimal
        studyTimeMinutes: entry.study_time,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-14) // Last 14 days
  }, [data])

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
        No study time data yet. Start logging your daily entries!
      </div>
    )
  }

  return (
    <ChartContainer
      config={{
        studyTime: {
          label: "Study Time (hours)",
          color: "var(--chart-2)",
        },
        studyTimeMinutes: {
          label: "Study Time (minutes)",
          color: "var(--chart-2)",
        },
      }}
      className="min-h-[200px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="studyTime" fill="var(--chart-2)" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
