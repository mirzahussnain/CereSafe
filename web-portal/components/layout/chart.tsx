import { UserPrediction } from "@/lib/types";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

import { LineChart,CartesianGrid, XAxis ,YAxis ,Line } from "recharts";

type Trend = {
  date: string;
  risk_value: number;
};

const chartConfig = {
  risk_value: {
    label: "Stroke Risk (%)",
    color: "hsl(var(--chart-1))",
  },
  daily: {
    label: "Daily",
    color: "#3b82f6",
  },
  monthly: {
    label: "Monthly",
    color: "#22c55e",
  },
} satisfies ChartConfig;

export function PredictionTrendChart({ predictionsData }: { predictionsData: UserPrediction[] }) {
  const [activeChart, setActiveChart] = useState<"daily" | "monthly">("daily");
  const [dailyTrend, setDailyTrend] = useState<Trend[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<Trend[]>([]);

  useEffect(() => {
    // Daily trend: one entry per prediction
    const daily = predictionsData
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((prediction) => ({
        date: new Date(prediction.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).replace(/\//g, "-"),
        risk_value: parseFloat((prediction.probability * 100).toFixed(2)),
      }));

    // Monthly trend: average risk per month
    const monthlyMap = new Map<string, { total: number; count: number }>();
    predictionsData.forEach((prediction) => {
      const date = new Date(prediction.created_at);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
      const current = monthlyMap.get(monthKey) || { total: 0, count: 0 };
      current.total += prediction.probability * 100;
      current.count += 1;
      monthlyMap.set(monthKey, current);
    });

    const monthly = Array.from(monthlyMap.entries())
      .map(([date, { total, count }]) => ({
        date,
        risk_value: parseFloat((total / count).toFixed(2)),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    setDailyTrend(daily);
    setMonthlyTrend(monthly);
  }, [predictionsData]);

  const chartData = activeChart === "daily" ? dailyTrend : monthlyTrend;
  const hasEnoughDataForMonthly = predictionsData.length >= 10;

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch sm:flex-row border-b p-0">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-3 sm:pb-0">
          <CardTitle>Risk Trend</CardTitle>
          <CardDescription>Showing stroke risk trend</CardDescription>
        </div>
        <div className="flex">
          {(["daily", "monthly"] as const).map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              onClick={() => setActiveChart(key)}
            >
              <span className="text-xs text-muted-foreground">{chartConfig[key].label}</span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {chartData.length === 0 || (activeChart === "monthly" && !hasEnoughDataForMonthly) ? (
          <div className="h-[250px] flex items-center justify-center text-muted-foreground">
            {activeChart === "monthly" && !hasEnoughDataForMonthly
              ? "Not Enough Data (Requires 10+ Predictions)"
              : "No Data Available"}
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12, top: 10, bottom: 10 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) =>
                  activeChart === "daily"
                    ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    : value
                }
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="risk_value"
                    labelFormatter={(value) =>
                      activeChart === "daily"
                        ? new Date(value).toLocaleDateString("en-UK", { month: "short", day: "numeric", year: "numeric" })
                        : value
                    }
                  />
                }
              />
              <Line
                dataKey="risk_value"
                type="monotone"
                stroke={chartConfig[activeChart].color}
                strokeWidth={2}
                dot={true}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
