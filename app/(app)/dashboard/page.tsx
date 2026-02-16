"use client";

import * as React from "react";
import { CircleDollarSign, CirclePercent, ClipboardCheck, Handshake, Layers3, Sparkles } from "lucide-react";
import { ActivityFeed } from "@/components/activity-feed";
import { LeadsFunnel } from "@/components/charts/leads-funnel";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { KpiCard } from "@/components/kpi-card";
import { PageTransition } from "@/components/page-transition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardTimeframe } from "@/lib/types";
import { getKpis, filterRevenueByTimeframe, getLeadBreakdown } from "@/lib/metrics";
import { useCRMStore } from "@/lib/store";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default function DashboardPage() {
  const [timeframe, setTimeframe] = React.useState<DashboardTimeframe>("1M");
  const leads = useCRMStore((state) => state.leads);
  const projects = useCRMStore((state) => state.projects);
  const tasks = useCRMStore((state) => state.tasks);
  const revenue = useCRMStore((state) => state.revenue);
  const activity = useCRMStore((state) => state.activity);
  const leadStatuses = useCRMStore((state) => state.leadStatuses);

  const revenueData = React.useMemo(() => filterRevenueByTimeframe(revenue, timeframe), [revenue, timeframe]);

  const kpis = React.useMemo(
    () =>
      getKpis({
        leads,
        projects,
        tasks,
        revenue,
        timeframe
      }),
    [leads, projects, tasks, revenue, timeframe]
  );

  const statusBreakdown = React.useMemo(() => getLeadBreakdown(leads, leadStatuses), [leads, leadStatuses]);

  return (
    <PageTransition>
      <section className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Monitor pipeline health, revenue trajectory, and delivery momentum.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          <KpiCard title="Total Revenue" value={formatCurrency(kpis.totalRevenue)} subtitle={`for ${timeframe}`} icon={CircleDollarSign} />
          <KpiCard title="New Leads" value={String(kpis.newLeads)} subtitle="captured in period" icon={Sparkles} />
          <KpiCard title="Pipeline Value" value={formatCurrency(kpis.pipelineValue)} subtitle="estimated possible revenue" icon={Layers3} />
          <KpiCard title="Conversion Rate" value={formatPercent(kpis.conversionRate)} subtitle="won vs. closed" icon={CirclePercent} />
          <KpiCard title="Active Projects" value={String(kpis.activeProjects)} subtitle="currently in delivery" icon={Handshake} />
          <KpiCard title="Tasks Due Soon" value={String(kpis.tasksDueSoon)} subtitle="within 3 days" icon={ClipboardCheck} />
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <RevenueChart timeframe={timeframe} onTimeframeChange={setTimeframe} data={revenueData} />
          </div>
          <LeadsFunnel data={statusBreakdown} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityFeed items={activity} />
          </CardContent>
        </Card>
      </section>
    </PageTransition>
  );
}
