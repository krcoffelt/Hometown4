import { addDays, isAfter, parseISO, startOfDay, subDays } from "date-fns";
import { timeframeToDays } from "@/lib/constants";
import { DashboardTimeframe, KPISet, Lead, Project, RevenuePoint, Task } from "@/lib/types";

export function filterRevenueByTimeframe(revenue: RevenuePoint[], timeframe: DashboardTimeframe) {
  const days = timeframeToDays[timeframe];
  const threshold = startOfDay(subDays(new Date(), days - 1));
  return revenue.filter((point) => isAfter(parseISO(point.date), threshold));
}

export function getKpis(args: {
  leads: Lead[];
  projects: Project[];
  tasks: Task[];
  revenue: RevenuePoint[];
  timeframe: DashboardTimeframe;
}): KPISet {
  const { leads, projects, tasks, revenue, timeframe } = args;
  const timeboundRevenue = filterRevenueByTimeframe(revenue, timeframe);
  const totalRevenue = timeboundRevenue.reduce((acc, point) => acc + point.amount, 0);
  const days = timeframeToDays[timeframe];
  const threshold = startOfDay(subDays(new Date(), days - 1));

  const newLeads = leads.filter((lead) => isAfter(parseISO(lead.createdAt), threshold)).length;
  const pipelineValue = leads
    .filter((lead) => !["Won", "Lost"].includes(lead.status))
    .reduce((acc, lead) => acc + lead.estimatedValue, 0);

  const won = leads.filter((lead) => lead.status === "Won").length;
  const lost = leads.filter((lead) => lead.status === "Lost").length;
  const conversionRate = won + lost > 0 ? (won / (won + lost)) * 100 : 0;

  const activeProjects = projects.filter((project) => project.status !== "Complete").length;
  const dueSoonThreshold = addDays(new Date(), 3);
  const tasksDueSoon = tasks.filter((task) => {
    if (task.status === "Done") return false;
    const dueDate = parseISO(task.dueDate);
    return dueDate <= dueSoonThreshold;
  }).length;

  return {
    totalRevenue,
    newLeads,
    pipelineValue,
    conversionRate,
    activeProjects,
    tasksDueSoon
  };
}

export function getLeadBreakdown(leads: Lead[], statuses: string[]) {
  return statuses.map((status) => ({
    status,
    count: leads.filter((lead) => lead.status === status).length
  }));
}
