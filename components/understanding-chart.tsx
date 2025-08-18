"use client"

import { useMemo } from "react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface UnderstandingChartProps {
  data: Array<{
    understanding_level: number
    created_at: string
  }>
}

export function UnderstandingChart({ data }: UnderstandingChartProps) {
  const chartData = useMemo(() => {
    if (!data.length) return []

    // Group notes by week and calculate average understanding
    const weeklyData = data.reduce(
      (acc, note) => {
        const date = new Date(note.created_at)
        const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay())
        const weekKey = weekStart.toISOString().split("T")[0]

        if (!acc[weekKey]) {
          acc[weekKey] = { total: 0, count: 0, date: weekStart }
        }
        acc[weekKey].total += note.understanding_level
        acc[weekKey].count += 1

        return acc
      },
      {} as Record<string, { total: number; count: number; date: Date }>,
    )

    return Object.entries(weeklyData)
      .map(([key, value]) => ({
        date: key,
        understanding: Number((value.total / value.count).toFixed(1)),
        notes: value.count,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-12) // Last 12 weeks
  }, [data])

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
        No data available yet. Start adding notes to see your progress!
      </div>
    )
  }

  return (
    <ChartContainer
      config={{
        understanding: {
          label: "Avg Understanding",
          color: "hsl(var(--chart-1))",
        },
        notes: {
          label: "Notes Count",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="min-h-[200px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          />
          <YAxis domain={[1, 5]} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="understanding"
            stroke="hsl(var(--chart-1))"
            fill="hsl(var(--chart-1))"
            fillOpacity={0.3}
          />
          {/* Added Area component for notes count */}
          <Area
            type="monotone"
            dataKey="notes"
            stroke="hsl(var(--chart-2))"
            fill="hsl(var(--chart-2))"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
