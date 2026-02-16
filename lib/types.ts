export type LeadStatus = string;

export type LeadSource =
  | "Referral"
  | "Website"
  | "Cold Outreach"
  | "Social"
  | "Partner"
  | "Other";

export type ProjectStatus = "Planning" | "In Progress" | "Review" | "On Hold" | "Complete";

export type TaskPriority = "Low" | "Medium" | "High";

export type TaskStatus = "Todo" | "In Progress" | "Done";

export type EntityType = "lead" | "client" | "project" | "task";

export type DashboardTimeframe = "7D" | "1M" | "3M" | "6M" | "1Y";

export interface TimelineEntry {
  id: string;
  createdAt: string;
  message: string;
  type: "note" | "status" | "task" | "system";
}

export interface FileLink {
  id: string;
  label: string;
  url: string;
}

export interface Lead {
  id: string;
  name: string;
  business: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: LeadSource;
  owner: string;
  estimatedValue: number;
  lastContacted: string | null;
  nextStep: string;
  createdAt: string;
  notes: string;
  timeline: TimelineEntry[];
  files: FileLink[];
  taskIds: string[];
}

export interface Client {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  websites: string[];
  industry: string;
  createdAt: string;
  notes: string;
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  status: ProjectStatus;
  startDate: string;
  deadline: string;
  websiteUrl: string;
  notes: string;
  value: number;
  tags: string[];
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  relatedType: "lead" | "client" | "project";
  relatedId: string;
  description: string;
  reminder: string | null;
}

export interface ActivityItem {
  id: string;
  createdAt: string;
  actor: string;
  message: string;
  entityType: EntityType;
  entityId: string;
}

export interface RevenuePoint {
  date: string;
  amount: number;
}

export interface LeadInput {
  name: string;
  business: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: LeadSource;
  owner: string;
  estimatedValue: number;
  lastContacted: string | null;
  nextStep: string;
  notes: string;
}

export interface ClientInput {
  name: string;
  contactName: string;
  email: string;
  phone: string;
  websites: string[];
  industry: string;
  notes: string;
}

export interface ProjectInput {
  clientId: string;
  name: string;
  status: ProjectStatus;
  startDate: string;
  deadline: string;
  websiteUrl: string;
  notes: string;
  value: number;
  tags: string[];
}

export interface TaskInput {
  title: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  relatedType: "lead" | "client" | "project";
  relatedId: string;
  description: string;
  reminder: string | null;
}

export interface KPISet {
  totalRevenue: number;
  newLeads: number;
  pipelineValue: number;
  conversionRate: number;
  activeProjects: number;
  tasksDueSoon: number;
}
