"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
} from "@/components/ui/chart"
import type { ExpenseDataPoint } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SpendingTrendChartProps {
  data: ExpenseDataPoint[];
}

const chartConfig = {
  amount: {
    label: "Spending",
    color: "hsl(var(--chart-2))",
  },
} satisfies import("@/components/ui/chart").ChartConfig;

export function SpendingTrendChart({ data }: SpendingTrendChartProps) {
   if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending Trend</CardTitle>
          <CardDescription>Track your spending over time.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No spending trend data available.</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Trend</CardTitle>
        <CardDescription>Your spending habits over the past months.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart data={data} accessibilityLayer margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickFormatter={(value) => `$${value}`}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <Tooltip content={<ChartTooltipContent />} />
             <Legend content={<ChartLegendContent />} />
            <Line type="monotone" dataKey="amount" stroke="var(--color-amount)" strokeWidth={2} dot={true} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
