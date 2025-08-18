// src/components/charts/StudyStreak.tsx
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { format, subDays } from "date-fns";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface StudyStreakProps {
  data: { date: string; minutes: number }[];
}

export function StudyStreak({ data }: StudyStreakProps) {
  // Fill in missing days with 0 minutes for the last 7 days
  const fillMissingDays = (studyData: { date: string; minutes: number }[]) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      return format(date, 'yyyy-MM-dd');
    }).reverse();

    return last7Days.map(date => {
      const existingData = studyData.find(d => d.date === date);
      return {
        date,
        minutes: existingData?.minutes || 0,
        displayDate: format(new Date(date), 'MMM dd')
      };
    });
  };

  const chartData = fillMissingDays(data);

  const chartConfig = {
    minutes: {
      label: "Study Time",
      color: "hsl(var(--chart-1))",
    },
  };

  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <p className="text-sm">No study data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <XAxis 
            dataKey="displayDate" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10 }}
            interval={1}
            height={30}
          />
          <YAxis hide />
          <ChartTooltip 
            content={<ChartTooltipContent />}
          />
          <Area
            type="monotone"
            dataKey="minutes"
            stroke="hsl(var(--chart-1))"
            fill="hsl(var(--chart-1))"
            fillOpacity={0.1}
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
