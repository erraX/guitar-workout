"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

export interface WeeklyInsightsChartProps {
  baseTotalDuration: number;
  prevTotalDuration: number;
  chartData: { day: string; base: number; prev: number }[];
  compact?: boolean;
}

const chartConfig = {
  prev: {
    label: "Last week",
    color: "#c5defd",
  },
  base: {
    label: "This week",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export function WeeklyInsightsChart({
  baseTotalDuration,
  prevTotalDuration,
  chartData,
  compact = false,
}: WeeklyInsightsChartProps) {
  const baseTotalDurationHours = Number((baseTotalDuration / 3600).toFixed(1));
  const prevTotalDurationHours = Number((prevTotalDuration / 3600).toFixed(1));
  const baseTotalDurationHoursPerDay = Number(
    (baseTotalDurationHours / 7).toFixed(1)
  );
  const prevTotalDurationHoursPerDay = Number(
    (prevTotalDurationHours / 7).toFixed(1)
  );

  return (
    <div
      className={cn("min-h-[200px]", {
        "w-[400px]": !compact,
        "w-[350px]": compact,
      })}
    >
      <div className="text-lg font-medium mb-3">Weekly insights</div>
      <div className="text-sm text-gray-500 mb-3">
        You&apos;ve practiced {baseTotalDurationHours} hours(
        {baseTotalDurationHoursPerDay} h/day) in this week,
        {prevTotalDurationHours} hours ({prevTotalDurationHoursPerDay} h/day)
        last week
      </div>
      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={chartData}>
          <YAxis
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => `${value} h`}
          />
          <XAxis
            dataKey="day"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="prev" fill="var(--color-prev)" radius={4} />
          <Bar dataKey="base" fill="var(--color-base)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
