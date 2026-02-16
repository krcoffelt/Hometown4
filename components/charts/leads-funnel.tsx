"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LeadsFunnel({ data }: { data: { status: string; count: number }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Status Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="h-[290px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 12 }}>
            <CartesianGrid strokeDasharray="4 6" horizontal={false} stroke="hsl(var(--border))" />
            <XAxis type="number" allowDecimals={false} stroke="hsl(var(--muted-foreground))" />
            <YAxis dataKey="status" type="category" width={120} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{ borderRadius: 10, border: "1px solid hsl(var(--border))", fontSize: 12 }}
              formatter={(value: number) => [`${value} leads`, "Count"]}
            />
            <Bar dataKey="count" radius={[0, 8, 8, 0]} fill="hsl(var(--chart-2))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
