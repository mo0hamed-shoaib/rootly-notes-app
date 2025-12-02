"use client";

import { useMemo } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Smile, Frown, Meh, Heart, TrendingUp } from "lucide-react";

interface MoodChartProps {
  data: Array<{
    mood: number;
    date: string;
  }>;
}

const moodLabels = {
  1: "Terrible",
  2: "Poor",
  3: "Okay",
  4: "Good",
  5: "Excellent",
};

const moodColors = {
  1: "hsl(var(--destructive))", // red for terrible
  2: "hsl(25, 95%, 53%)", // orange for poor
  3: "hsl(45, 93%, 47%)", // yellow for okay
  4: "hsl(142, 76%, 36%)", // green for good
  5: "hsl(160, 84%, 39%)", // emerald for excellent
};

const moodEmojis = {
  1: "😢",
  2: "😕",
  3: "😐",
  4: "😊",
  5: "😄",
};

export function MoodChart({ data }: MoodChartProps) {
  const { chartData, insights } = useMemo(() => {
    if (!data.length) return { chartData: [], insights: null };

    const filteredData = data
      .filter((entry) => entry.mood && entry.mood >= 1 && entry.mood <= 5)
      .map((entry) => ({
        day: new Date(entry.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        mood: entry.mood,
        moodLabel:
          moodLabels[entry.mood as keyof typeof moodLabels] || "Unknown",
        moodEmoji: moodEmojis[entry.mood as keyof typeof moodEmojis] || "😐",
        date: entry.date,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-21); // Last 21 days

    // Calculate insights
    const avgMood = Number(
      (
        filteredData.reduce((sum, item) => sum + item.mood, 0) /
        filteredData.length
      ).toFixed(1)
    );
    const bestDay = filteredData.reduce(
      (max, item) => (item.mood > max.mood ? item : max),
      filteredData[0]
    );
    const worstDay = filteredData.reduce(
      (min, item) => (item.mood < min.mood ? item : min),
      filteredData[0]
    );

    // Calculate mood distribution
    const moodCounts = filteredData.reduce((acc, item) => {
      acc[item.mood] = (acc[item.mood] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const dominantMood = Object.entries(moodCounts).reduce(
      (max, [mood, count]) =>
        count > max.count ? { mood: Number(mood), count } : max,
      { mood: 3, count: 0 }
    );

    // Weekly trend - compare last 7 days vs previous 7 days
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6); // 6 days ago + today = 7 days
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(today.getDate() - 13);
    fourteenDaysAgo.setHours(0, 0, 0, 0);

    const lastWeekData = filteredData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= sevenDaysAgo;
    });

    const previousWeekData = filteredData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate < sevenDaysAgo && itemDate >= fourteenDaysAgo;
    });

    const lastWeekAvg =
      lastWeekData.length > 0
        ? lastWeekData.reduce((sum, item) => sum + item.mood, 0) /
          lastWeekData.length
        : 0;
    const previousWeekAvg =
      previousWeekData.length > 0
        ? previousWeekData.reduce((sum, item) => sum + item.mood, 0) /
          previousWeekData.length
        : 0;

    // Use 10% threshold to avoid marking tiny fluctuations as trends
    const weeklyTrend =
      lastWeekAvg > previousWeekAvg * 1.1
        ? "improving"
        : lastWeekAvg < previousWeekAvg * 0.9
        ? "declining"
        : "stable";

    return {
      chartData: filteredData,
      insights: {
        avgMood,
        bestDay: bestDay?.day,
        worstDay: worstDay?.day,
        dominantMood: dominantMood.mood,
        dominantMoodLabel:
          moodLabels[dominantMood.mood as keyof typeof moodLabels],
        weeklyTrend,
      },
    };
  }, [data]);

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-[260px] text-muted-foreground">
        <div className="text-center">
          <Meh className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No mood data yet</p>
          <p className="text-xs mt-1">
            Start tracking how you feel during your studies!
          </p>
        </div>
      </div>
    );
  }

  const dominantMood = insights?.dominantMood ?? 3;
  const MoodIcon = dominantMood >= 4 ? Smile : dominantMood <= 2 ? Frown : Meh;

  return (
    <div className="space-y-4">
      <ChartContainer
        config={{
          mood: {
            label: "Mood Level",
            color: "var(--chart-3)",
          },
        }}
        className="h-[280px] w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              className="stroke-muted/30"
            />
            <ReferenceLine
              y={3}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="2 2"
              opacity={0.5}
            />
            <XAxis
              dataKey="day"
              className="text-xs fill-muted-foreground"
              axisLine={false}
              tickLine={false}
              height={60}
              tick={{ fontSize: 11 }}
              tickMargin={8}
            />
            <YAxis
              domain={[1, 5]}
              className="text-xs fill-muted-foreground"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 16 }}
              tickFormatter={(value) =>
                moodEmojis[value as keyof typeof moodEmojis] || "😐"
              }
              label={{
                value: "Mood Level",
                angle: -90,
                position: "insideLeft",
                style: {
                  textAnchor: "middle",
                  fill: "hsl(var(--muted-foreground))",
                },
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value) => [
                    `${moodEmojis[value as keyof typeof moodEmojis]} ${
                      moodLabels[value as keyof typeof moodLabels]
                    }`,
                    "",
                  ]}
                />
              }
            />
            <Line
              type="natural"
              dataKey="mood"
              stroke="var(--color-mood)"
              strokeWidth={2.5}
              connectNulls={false}
              dot={{
                fill: "var(--color-mood)",
                strokeWidth: 2,
                r: 5,
                stroke: "hsl(var(--background))",
              }}
              activeDot={{
                r: 6,
                stroke: "var(--color-mood)",
                strokeWidth: 2,
                fill: "var(--color-mood)",
              }}
              className="opacity-90 hover:opacity-100 transition-opacity"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      {insights && (
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            <span className="text-muted-foreground">
              Average mood:{" "}
              <span className="font-medium text-foreground">
                {insights.avgMood}/5
              </span>{" "}
              {
                moodEmojis[
                  Math.round(insights.avgMood) as keyof typeof moodEmojis
                ]
              }
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MoodIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Most common:{" "}
              <span className="font-medium text-foreground">
                {insights.dominantMoodLabel}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp
              className={`h-4 w-4 ${
                insights.weeklyTrend === "improving"
                  ? "text-green-500"
                  : insights.weeklyTrend === "declining"
                  ? "text-red-500"
                  : "text-muted-foreground"
              }`}
            />
            <span className="text-muted-foreground">
              Weekly trend:{" "}
              <span className="font-medium text-foreground">
                {insights.weeklyTrend}
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
