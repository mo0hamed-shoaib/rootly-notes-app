// src/components/charts/TopicMix.tsx
import { PieChart, Pie, Cell } from "recharts";
import type { Topic } from "@/types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface TopicMixProps {
  data: { name: Topic; value: number; count: number }[];
}

const topicColors: Record<Topic, string> = {
  hooks: "hsl(var(--chart-2))",
  reconciliation: "hsl(var(--chart-5))",
  rendering: "hsl(var(--chart-1))",
  state: "hsl(var(--chart-3))",
  routing: "#8e44ad",
  performance: "hsl(var(--chart-4))",
  other: "#95a5a6",
};

export function TopicMix({ data }: TopicMixProps) {
  const chartConfig = {
    hooks: {
      label: "Hooks",
      color: "hsl(var(--chart-2))",
    },
    reconciliation: {
      label: "Reconciliation",
      color: "hsl(var(--chart-5))",
    },
    rendering: {
      label: "Rendering",
      color: "hsl(var(--chart-1))",
    },
    state: {
      label: "State",
      color: "hsl(var(--chart-3))",
    },
    routing: {
      label: "Routing",
      color: "#8e44ad",
    },
    performance: {
      label: "Performance",
      color: "hsl(var(--chart-4))",
    },
    other: {
      label: "Other",
      color: "#95a5a6",
    },
  };

  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <p className="text-sm">No topic data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={"75%"}
              innerRadius={"45%"}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={topicColors[entry.name]} 
                />
              ))}
            </Pie>
            <ChartTooltip 
              content={<ChartTooltipContent />}
            />
          </PieChart>
        </ChartContainer>
      </div>
      
      {/* Compact Legend */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5 text-xs">
            <div 
              className="w-2.5 h-2.5 rounded-sm" 
              style={{ backgroundColor: topicColors[entry.name] }}
            />
            <span className="font-medium text-foreground">
              {entry.name.charAt(0).toUpperCase() + entry.name.slice(1)}
            </span>
            <span className="text-muted-foreground">
              {entry.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
