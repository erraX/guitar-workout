"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const chartConfig = {
  duration: {
    label: "Duration",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export function TopExercisesChart({
  chartData,
  compact = false,
}: {
  chartData: { name: string; duration: number }[];
  compact?: boolean;
}) {
  return (
    <div>
      <div className="text-lg font-medium mb-3">Top Exercises</div>
      <div className="text-sm text-gray-500 mb-3">
        The top 5 exercises you played this week.
      </div>
      <ChartContainer
        config={chartConfig}
        className={cn("min-h-[200px]", {
          "w-[400px]": !compact,
          "w-[350px]": compact,
        })}
      >
        <BarChart
          accessibilityLayer
          data={chartData}
          layout="vertical"
          margin={{
            left: -20,
          }}
        >
          <XAxis type="number" dataKey="duration" hide />
          <YAxis
            dataKey="name"
            type="category"
            tickLine={false}
            tickMargin={10}
            width={120}
            axisLine={false}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                valueFormatter={(value) =>
                  `: ${Math.round((value as number) / 60)} min`
                }
              />
            }
          />
          <Bar
            dataKey="duration"
            fill="var(--color-duration)"
            radius={5}
            barSize={25}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
