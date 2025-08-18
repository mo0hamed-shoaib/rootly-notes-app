"use client"

import { useMemo } from "react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface MoodChartProps {
  data: Array<{
    mood: number
    date: string
  }>
}

const moodLabels = {
  1: "Terrible",
  2: "Poor",
  3: "Okay",
  4: "Good",
  5: "Excellent",
}

export function MoodChart({ data }: MoodChartProps) {
  const chartData = useMemo(() => {
    if (!data.length) return []

    return data
      .filter((entry) => entry.mood && entry.mood >= 1 && entry.mood <= 5)
      .map((entry) => ({
        date: entry.date,
        mood: entry.mood,
        moodLabel: moodLabels[entry.mood as keyof typeof moodLabels] || "Unknown",
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-21) // Last 21 days
  }, [data])

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
        No mood data yet. Start tracking your daily mood!
      </div>
    )
  }

  return (
    <ChartContainer
      config={{
        mood: {
          label: "Mood Level",
          color: "var(--chart-3)",
        },
        moodLabel: {
          label: "Mood",
          color: "var(--chart-3)",
        },
      }}
      className="min-h-[200px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          />
          <YAxis domain={[1, 5]} tickFormatter={(value) => moodLabels[value as keyof typeof moodLabels] || "Unknown"} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="var(--chart-3)"
            strokeWidth={2}
            dot={{ fill: "var(--chart-3)", strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
