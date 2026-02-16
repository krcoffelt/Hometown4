import { DashboardTimeframe, LeadSource, LeadStatus } from "@/lib/types";

export const defaultLeadStatuses: LeadStatus[] = [
  "New",
  "Contacted",
  "Discovery Scheduled",
  "Proposal Sent",
  "Negotiation",
  "Won",
  "Lost"
];

export const leadSources: LeadSource[] = ["Referral", "Website", "Cold Outreach", "Social", "Partner", "Other"];

export const owners = ["Kyle", "Alex", "Jordan"];

export const timeframeToDays: Record<DashboardTimeframe, number> = {
  "7D": 7,
  "1M": 30,
  "3M": 90,
  "6M": 180,
  "1Y": 365
};

export const taskPriorities = ["Low", "Medium", "High"] as const;

export const taskStatuses = ["Todo", "In Progress", "Done"] as const;

export const projectStatuses = ["Planning", "In Progress", "Review", "On Hold", "Complete"] as const;

export const mobileNavItems = [
  { href: "/dashboard", label: "Home" },
  { href: "/leads", label: "Leads" },
  { href: "/tasks", label: "Tasks" },
  { href: "/calendar", label: "Calendar" }
];
