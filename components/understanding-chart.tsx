"use client"

import { useMemo } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BookOpen, AlertTriangle, Star } from "lucide-react"

interface UnderstandingChartProps {
  data: Array<{
    understanding_level: number
    created_at: string
  }>
}

export function UnderstandingChart({ data }: UnderstandingChartProps) {
  const { chartData, insights } = useMemo(() => {
    if (!data.length) return { chartData: [], insights: null as null | {
      total: number
      atRisk: number
      strong: number
      avg: number
    } }

    // Distribution by level (1..5)
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    for (const note of data) {
      const lvl = Math.max(1, Math.min(5, Math.round(note.understanding_level)))
      counts[lvl] += 1
    }

    const total = Object.values(counts).reduce((s, n) => s + n, 0)
    const chartData = [1, 2, 3, 4, 5].map((lvl) => ({
      level: `Level ${lvl}`,
      numeric: lvl,
      count: counts[lvl] || 0,
      percent: total ? Number(((counts[lvl] / total) * 100).toFixed(1)) : 0,
    }))

    const atRisk = (counts[1] || 0) + (counts[2] || 0)
    const strong = (counts[4] || 0) + (counts[5] || 0)
    const avg = total
      ? Number(
          (
            (1 * (counts[1] || 0) +
              2 * (counts[2] || 0) +
              3 * (counts[3] || 0) +
              4 * (counts[4] || 0) +
              5 * (counts[5] || 0)) /
            total
          ).toFixed(1),
        )
      : 0

    return { chartData, insights: { total, atRisk, strong, avg } }
  }, [data])

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-[240px] text-muted-foreground">
        <div className="text-center">
          <p className="text-sm">No understanding data yet</p>
          <p className="text-xs mt-1">Start adding notes to track your comprehension progress!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <ChartContainer
        config={{
          count: {
            label: "Notes",
            color: "var(--chart-1)",
          },
        }}
        className="h-[280px] w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 0, right: 12, top: 8, bottom: 8 }}
          >
            <CartesianGrid horizontal strokeDasharray="3 3" className="stroke-muted/30" />
            <XAxis type="number" dataKey="count" className="text-xs fill-muted-foreground" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
            <YAxis
              dataKey="level"
              type="category"
              className="text-xs fill-muted-foreground"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
            />
            <ChartTooltip 
              content={<ChartTooltipContent 
                hideLabel
                formatter={(value, name, props) => [`${value} notes • ${props?.payload?.percent}%`, props?.payload?.level]}
              />} 
            />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={5}
              className="opacity-90 hover:opacity-100 transition-opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
      
      {insights && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span>
              Total notes: <span className="text-foreground font-medium">{insights.total}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span>
              At‑risk (≤2): <span className="font-medium text-red-500">{insights.atRisk}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Star className="h-4 w-4 text-green-500" />
            <span>
              Strong (≥4): <span className="font-medium text-green-500">{insights.strong}</span> • Avg <span className="font-medium">{insights.avg}/5</span>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
