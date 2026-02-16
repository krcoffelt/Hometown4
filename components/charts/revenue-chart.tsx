"use client";

import { motion, useReducedMotion } from "framer-motion";
import { format } from "date-fns";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardTimeframe, RevenuePoint } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const options: DashboardTimeframe[] = ["7D", "1M", "3M", "6M", "1Y"];

export function RevenueChart({
  timeframe,
  onTimeframeChange,
  data
}: {
  timeframe: DashboardTimeframe;
  onTimeframeChange: (value: DashboardTimeframe) => void;
  data: RevenuePoint[];
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Revenue Trend</CardTitle>
        <div className="inline-flex w-full flex-wrap items-center gap-1 rounded-md bg-muted p-1 sm:w-auto">
          {options.map((option) => (
            <Button
              key={option}
              size="sm"
              variant={option === timeframe ? "default" : "ghost"}
              onClick={() => onTimeframeChange(option)}
              aria-pressed={option === timeframe}
            >
              {option}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="h-[290px]">
        <motion.div
          key={timeframe}
          initial={prefersReducedMotion ? false : { opacity: 0.55 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.22 }}
          className="h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.map((point) => ({ ...point, label: format(new Date(point.date), "MMM d") }))}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 6" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} tickMargin={10} minTickGap={28} stroke="hsl(var(--muted-foreground))" />
              <YAxis
                tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                tick={{ fontSize: 11 }}
                tickMargin={12}
                width={42}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: "1px solid hsl(var(--border))", fontSize: 12 }}
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area type="monotone" dataKey="amount" stroke="hsl(var(--chart-1))" strokeWidth={2.3} fill="url(#revenueFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  );
}
