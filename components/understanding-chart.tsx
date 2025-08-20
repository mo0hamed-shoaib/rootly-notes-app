"use client"

import { useMemo } from "react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface UnderstandingChartProps {
  data: Array<{
    understanding_level: number
    created_at: string
  }>
}

export function UnderstandingChart({ data }: UnderstandingChartProps) {
  const { chartData, insights } = useMemo(() => {
    if (!data.length) return { chartData: [], insights: null }

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

    const processedData = Object.entries(weeklyData)
      .map(([key, value]) => ({
        week: new Date(key).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        understanding: Number((value.total / value.count).toFixed(1)),
        noteCount: value.count,
        date: key,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-12) // Last 12 weeks

    // Calculate insights
    let trend = "stable"
    let trendValue = 0
    if (processedData.length >= 2) {
      const firstHalf = processedData.slice(0, Math.floor(processedData.length / 2))
      const secondHalf = processedData.slice(Math.floor(processedData.length / 2))
      
      const firstAvg = firstHalf.reduce((sum, item) => sum + item.understanding, 0) / firstHalf.length
      const secondAvg = secondHalf.reduce((sum, item) => sum + item.understanding, 0) / secondHalf.length
      
      trendValue = Number(((secondAvg - firstAvg) / firstAvg * 100).toFixed(1))
      trend = trendValue > 5 ? "improving" : trendValue < -5 ? "declining" : "stable"
    }

    const totalNotes = processedData.reduce((sum, item) => sum + item.noteCount, 0)
    const avgUnderstanding = Number((processedData.reduce((sum, item) => sum + item.understanding, 0) / processedData.length).toFixed(1))

    return {
      chartData: processedData,
      insights: { trend, trendValue, totalNotes, avgUnderstanding }
    }
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

  const TrendIcon = insights?.trend === "improving" ? TrendingUp : insights?.trend === "declining" ? TrendingDown : Minus

  return (
    <div className="space-y-4">
      <ChartContainer
        config={{
          understanding: {
            label: "Understanding Level",
            color: "var(--chart-1)",
          },
          noteCount: {
            label: "Notes Count",
            color: "var(--muted)",
          },
        }}
        className="min-h-[240px] w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart accessibilityLayer data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/30" />
            <XAxis 
              dataKey="week" 
              className="text-xs fill-muted-foreground"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
            />
            <YAxis 
              domain={[1, 5]} 
              className="text-xs fill-muted-foreground"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
              label={{ 
                value: 'Understanding Level (1-5)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' }
              }}
            />
            <ChartTooltip 
              content={<ChartTooltipContent 
                labelFormatter={(value) => `Week of ${value}`}
                formatter={(value, name, props) => {
                  if (name === "understanding") {
                    return [`${value}/5 (${props.payload.noteCount} notes)`, "Understanding Level"]
                  }
                  return [value, name]
                }}
              />} 
            />
            <Area
              type="monotone"
              dataKey="understanding"
              stroke="var(--color-understanding)"
              strokeWidth={2}
              fill="var(--color-understanding)"
              fillOpacity={0.2}
              className="transition-opacity"
              dot={{ 
                fill: "var(--color-understanding)", 
                strokeWidth: 2, 
                r: 4,
                stroke: "hsl(var(--background))"
              }}
              activeDot={{ 
                r: 6, 
                stroke: "var(--color-understanding)",
                strokeWidth: 2,
                fill: "var(--color-understanding)"
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
      
      {insights && (
        <div className="flex items-center gap-2 text-sm">
          <TrendIcon className={`h-4 w-4 ${
            insights.trend === "improving" ? "text-green-500" : 
            insights.trend === "declining" ? "text-red-500" : 
            "text-muted-foreground"
          }`} />
          <span className="text-muted-foreground">
            {insights.trend === "improving" && `Understanding trending up by ${Math.abs(insights.trendValue)}% over time`}
            {insights.trend === "declining" && `Understanding trending down by ${Math.abs(insights.trendValue)}% over time`}
            {insights.trend === "stable" && `Understanding level remains stable at ${insights.avgUnderstanding}/5`}
          </span>
        </div>
      )}
    </div>
  )
}
