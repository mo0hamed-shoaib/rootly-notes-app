"use client"

import { useMemo } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Clock, TrendingUp, Target } from "lucide-react"

interface StudyTimeChartProps {
  data: Array<{
    study_time: number
    date: string
  }>
  accentColor?: string
}

export function StudyTimeChart({ data, accentColor }: StudyTimeChartProps) {
  const { chartData, insights } = useMemo(() => {
    if (!data.length) return { chartData: [], insights: null }

    const processedData = data
      .map((entry) => ({
        day: new Date(entry.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        hours: Math.round((entry.study_time / 60) * 10) / 10, // Convert to hours with 1 decimal
        minutes: entry.study_time,
        date: entry.date,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-14) // Last 14 days

    // Calculate insights
    const totalHours = processedData.reduce((sum, item) => sum + item.hours, 0)
    const avgHoursPerDay = Number((totalHours / processedData.length).toFixed(1))
    const maxDay = processedData.reduce((max, item) => item.hours > max.hours ? item : max, processedData[0])
    const studyDays = processedData.filter(item => item.hours > 0).length
    const consistency = Number(((studyDays / processedData.length) * 100).toFixed(0))

    // Weekly comparison for trend
    const firstWeek = processedData.slice(0, 7)
    const secondWeek = processedData.slice(7)
    const firstWeekAvg = firstWeek.reduce((sum, item) => sum + item.hours, 0) / firstWeek.length
    const secondWeekAvg = secondWeek.length > 0 ? secondWeek.reduce((sum, item) => sum + item.hours, 0) / secondWeek.length : firstWeekAvg
    const weeklyTrend = secondWeekAvg > firstWeekAvg ? "increasing" : secondWeekAvg < firstWeekAvg ? "decreasing" : "stable"

    return {
      chartData: processedData,
      insights: { 
        totalHours, 
        avgHoursPerDay, 
        maxDay: maxDay?.day, 
        maxHours: maxDay?.hours, 
        consistency,
        weeklyTrend 
      }
    }
  }, [data])

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-[280px] text-muted-foreground">
        <div className="text-center">
          <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No study time data yet</p>
          <p className="text-xs mt-1">Start logging your daily study sessions!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <ChartContainer
        config={{
          hours: {
            label: "Study Hours",
            color: accentColor ?? "var(--chart-2)",
          },
        }}
        className="min-h-[280px] w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/30" />
            <XAxis 
              dataKey="day" 
              className="text-xs fill-muted-foreground"
              axisLine={false}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
              tick={{ fontSize: 11 }}
            />
            <YAxis 
              className="text-xs fill-muted-foreground"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
              label={{ 
                value: 'Hours Studied', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' }
              }}
            />
            <ChartTooltip 
              content={<ChartTooltipContent 
                labelFormatter={(value) => `${value}`}
                formatter={(value, name) => [
                  `${value}h`,
                  name === "hours" ? "Study Time" : name
                ]}
              />} 
            />
            <Bar 
              dataKey="hours" 
              fill="var(--color-hours)" 
              radius={[4, 4, 0, 0]}
              className="opacity-90 hover:opacity-100 transition-opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
      
      {insights && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-muted-foreground">
              <span className="font-medium text-foreground">{insights.avgHoursPerDay}h</span> avg per day
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-amber-500" />
            <span className="text-muted-foreground">
              <span className="font-medium text-foreground">{insights.consistency}%</span> consistency rate
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <TrendingUp className={`h-4 w-4 ${
              insights.weeklyTrend === "increasing" ? "text-green-500" : 
              insights.weeklyTrend === "decreasing" ? "text-red-500" : 
              "text-muted-foreground"
            }`} />
            <span className="text-muted-foreground">
              Weekly trend: <span className="font-medium text-foreground">{insights.weeklyTrend}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
