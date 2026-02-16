import { addDays, formatISO, setHours, setMinutes, subDays } from "date-fns";
import { defaultLeadStatuses } from "@/lib/constants";
import { ActivityItem, Client, Lead, Project, RevenuePoint, Task } from "@/lib/types";

const now = new Date();

const at = (date: Date, hour: number, minute = 0) => formatISO(setMinutes(setHours(date, hour), minute));

const daysAgo = (days: number, hour = 10, minute = 0) => at(subDays(now, days), hour, minute);

const daysAhead = (days: number, hour = 10, minute = 0) => at(addDays(now, days), hour, minute);

export const leadsSeed: Lead[] = [
  {
    id: "lead_1",
    name: "Morgan Price",
    business: "Price Dental Studio",
    email: "morgan@pricedental.com",
    phone: "(555) 104-2233",
    status: "Proposal Sent",
    source: "Website",
    owner: "Kyle",
    estimatedValue: 12000,
    lastContacted: daysAgo(2, 14),
    nextStep: "Follow up on scope feedback",
    createdAt: daysAgo(18),
    notes: "Needs a full redesign with appointment integration.",
    timeline: [
      { id: "t1", createdAt: daysAgo(18), message: "Lead submitted via website form", type: "system" },
      { id: "t2", createdAt: daysAgo(15), message: "Discovery call completed", type: "note" },
      { id: "t3", createdAt: daysAgo(3), message: "Proposal sent with 2 package options", type: "status" }
    ],
    files: [{ id: "f1", label: "Proposal PDF", url: "https://example.com/proposal-pricedental" }],
    taskIds: ["task_1"]
  },
  {
    id: "lead_2",
    name: "Ava Bennett",
    business: "Bennett Family Law",
    email: "ava@bennettlaw.com",
    phone: "(555) 310-8877",
    status: "Negotiation",
    source: "Referral",
    owner: "Alex",
    estimatedValue: 18500,
    lastContacted: daysAgo(1, 11),
    nextStep: "Finalize maintenance scope",
    createdAt: daysAgo(24),
    notes: "Interested in SEO + copywriting retainers.",
    timeline: [
      { id: "t4", createdAt: daysAgo(24), message: "Referral from existing client", type: "system" },
      { id: "t5", createdAt: daysAgo(20), message: "Intro call complete", type: "note" },
      { id: "t6", createdAt: daysAgo(6), message: "Moved to negotiation", type: "status" }
    ],
    files: [],
    taskIds: ["task_2"]
  },
  {
    id: "lead_3",
    name: "Noah Ortiz",
    business: "Ortiz Landscaping",
    email: "noah@ortizlandscaping.com",
    phone: "(555) 909-4477",
    status: "New",
    source: "Social",
    owner: "Kyle",
    estimatedValue: 6000,
    lastContacted: null,
    nextStep: "Send intro email",
    createdAt: daysAgo(1, 9),
    notes: "Wants a lead-gen landing page first.",
    timeline: [{ id: "t7", createdAt: daysAgo(1, 9), message: "Lead captured from Instagram ad", type: "system" }],
    files: [],
    taskIds: []
  },
  {
    id: "lead_4",
    name: "Harper Lee",
    business: "Lee Wellness Co.",
    email: "hello@leewellness.co",
    phone: "(555) 880-1122",
    status: "Won",
    source: "Website",
    owner: "Jordan",
    estimatedValue: 14500,
    lastContacted: daysAgo(8),
    nextStep: "Kickoff project",
    createdAt: daysAgo(42),
    notes: "Closed with growth retainer upsell.",
    timeline: [
      { id: "t8", createdAt: daysAgo(42), message: "Discovery scheduled", type: "status" },
      { id: "t9", createdAt: daysAgo(28), message: "Proposal sent", type: "status" },
      { id: "t10", createdAt: daysAgo(12), message: "Contract signed", type: "status" }
    ],
    files: [{ id: "f2", label: "Contract", url: "https://example.com/contract-lee" }],
    taskIds: ["task_5"]
  },
  {
    id: "lead_5",
    name: "Ethan Brooks",
    business: "Brooks CPA Group",
    email: "ethan@brookscpa.com",
    phone: "(555) 500-7764",
    status: "Lost",
    source: "Cold Outreach",
    owner: "Alex",
    estimatedValue: 9500,
    lastContacted: daysAgo(30),
    nextStep: "Revisit next quarter",
    createdAt: daysAgo(55),
    notes: "Budget frozen for this quarter.",
    timeline: [
      { id: "t11", createdAt: daysAgo(55), message: "Outbound email responded", type: "system" },
      { id: "t12", createdAt: daysAgo(48), message: "Lost due to budget", type: "status" }
    ],
    files: [],
    taskIds: []
  },
  {
    id: "lead_6",
    name: "Sofia Grant",
    business: "Grant Interiors",
    email: "sofia@grantinteriors.com",
    phone: "(555) 246-6001",
    status: "Discovery Scheduled",
    source: "Partner",
    owner: "Kyle",
    estimatedValue: 13200,
    lastContacted: daysAgo(4),
    nextStep: "Prepare discovery agenda",
    createdAt: daysAgo(9),
    notes: "Portfolio-heavy site with bookings.",
    timeline: [
      { id: "t13", createdAt: daysAgo(9), message: "Partner referral submitted", type: "system" },
      { id: "t14", createdAt: daysAgo(4), message: "Discovery booked for next Tuesday", type: "task" }
    ],
    files: [],
    taskIds: ["task_3"]
  },
  {
    id: "lead_7",
    name: "Liam Reed",
    business: "Reed Fitness Club",
    email: "liam@reedfit.com",
    phone: "(555) 240-9930",
    status: "Contacted",
    source: "Website",
    owner: "Jordan",
    estimatedValue: 7800,
    lastContacted: daysAgo(2),
    nextStep: "Book discovery call",
    createdAt: daysAgo(6),
    notes: "Needs membership portal integration.",
    timeline: [
      { id: "t15", createdAt: daysAgo(6), message: "Lead created", type: "system" },
      { id: "t16", createdAt: daysAgo(2), message: "Intro call requested", type: "note" }
    ],
    files: [],
    taskIds: ["task_4"]
  }
];

export const clientsSeed: Client[] = [
  {
    id: "client_1",
    name: "Lee Wellness Co.",
    contactName: "Harper Lee",
    email: "hello@leewellness.co",
    phone: "(555) 880-1122",
    websites: ["https://leewellness.co"],
    industry: "Health & Wellness",
    createdAt: daysAgo(11),
    notes: "Monthly CRO and content updates."
  },
  {
    id: "client_2",
    name: "Northstar Dental",
    contactName: "Dr. Jasmine Patel",
    email: "jpatel@northstardental.com",
    phone: "(555) 293-1188",
    websites: ["https://northstardental.com", "https://book.northstardental.com"],
    industry: "Dental",
    createdAt: daysAgo(90),
    notes: "Retainer client with quarterly campaigns."
  },
  {
    id: "client_3",
    name: "Baker Home Realty",
    contactName: "Mason Baker",
    email: "mason@bakerhome.com",
    phone: "(555) 782-2219",
    websites: ["https://bakerhome.com"],
    industry: "Real Estate",
    createdAt: daysAgo(150),
    notes: "Brand refresh completed last quarter."
  }
];

export const projectsSeed: Project[] = [
  {
    id: "project_1",
    clientId: "client_1",
    name: "Growth Site Redesign",
    status: "In Progress",
    startDate: daysAgo(10),
    deadline: daysAhead(28),
    websiteUrl: "https://staging.leewellness.co",
    notes: "Homepage + service pages in sprint 1.",
    value: 14500,
    tags: ["Web Design", "SEO"]
  },
  {
    id: "project_2",
    clientId: "client_2",
    name: "Patient Booking Funnel",
    status: "Review",
    startDate: daysAgo(34),
    deadline: daysAhead(6),
    websiteUrl: "https://preview.northstardental.com",
    notes: "Awaiting final copy approval.",
    value: 9800,
    tags: ["CRO", "Landing Pages"]
  },
  {
    id: "project_3",
    clientId: "client_3",
    name: "Neighborhood Showcase",
    status: "Complete",
    startDate: daysAgo(80),
    deadline: daysAgo(16),
    websiteUrl: "https://bakerhome.com/neighborhoods",
    notes: "Delivered ahead of schedule.",
    value: 7200,
    tags: ["CMS", "Content"]
  }
];

export const tasksSeed: Task[] = [
  {
    id: "task_1",
    title: "Follow up on Price Dental proposal",
    dueDate: daysAhead(1, 11),
    priority: "High",
    status: "Todo",
    relatedType: "lead",
    relatedId: "lead_1",
    description: "Ask if they prefer growth or conversion package.",
    reminder: null
  },
  {
    id: "task_2",
    title: "Finalize service scope for Bennett Law",
    dueDate: daysAhead(2, 15),
    priority: "High",
    status: "In Progress",
    relatedType: "lead",
    relatedId: "lead_2",
    description: "Update estimate with optional copywriting add-on.",
    reminder: null
  },
  {
    id: "task_3",
    title: "Prepare discovery deck for Grant Interiors",
    dueDate: daysAhead(3, 9),
    priority: "Medium",
    status: "Todo",
    relatedType: "lead",
    relatedId: "lead_6",
    description: "Gather references and sitemap options.",
    reminder: null
  },
  {
    id: "task_4",
    title: "Send scheduling link to Reed Fitness",
    dueDate: daysAhead(0, 13),
    priority: "Medium",
    status: "Todo",
    relatedType: "lead",
    relatedId: "lead_7",
    description: "Provide 3 available windows for discovery.",
    reminder: null
  },
  {
    id: "task_5",
    title: "Kickoff Lee Wellness project",
    dueDate: daysAhead(0, 16),
    priority: "High",
    status: "In Progress",
    relatedType: "project",
    relatedId: "project_1",
    description: "Review goals, KPIs, and tech constraints.",
    reminder: null
  },
  {
    id: "task_6",
    title: "Review QA feedback on Northstar funnel",
    dueDate: daysAhead(5, 10),
    priority: "Low",
    status: "Todo",
    relatedType: "project",
    relatedId: "project_2",
    description: "Resolve final form validation notes.",
    reminder: null
  }
];

export const activitySeed: ActivityItem[] = [
  {
    id: "act_1",
    createdAt: daysAgo(0, 9, 12),
    actor: "Kyle",
    message: "Moved Grant Interiors to Discovery Scheduled",
    entityType: "lead",
    entityId: "lead_6"
  },
  {
    id: "act_2",
    createdAt: daysAgo(0, 8, 40),
    actor: "Kyle",
    message: "Created task: Send scheduling link to Reed Fitness",
    entityType: "task",
    entityId: "task_4"
  },
  {
    id: "act_3",
    createdAt: daysAgo(1, 15, 0),
    actor: "Alex",
    message: "Updated proposal scope for Bennett Family Law",
    entityType: "lead",
    entityId: "lead_2"
  },
  {
    id: "act_4",
    createdAt: daysAgo(2, 11, 30),
    actor: "Jordan",
    message: "Started project kickoff for Lee Wellness Co.",
    entityType: "project",
    entityId: "project_1"
  },
  {
    id: "act_5",
    createdAt: daysAgo(3, 16, 45),
    actor: "Kyle",
    message: "Sent proposal to Price Dental Studio",
    entityType: "lead",
    entityId: "lead_1"
  }
];

export const revenueSeed: RevenuePoint[] = Array.from({ length: 365 }, (_, index) => {
  const day = subDays(now, 364 - index);
  const seasonality = Math.sin(index / 23) * 260;
  const growth = index * 7;
  const variance = (index % 9) * 42;
  const amount = Math.max(0, Math.round(900 + seasonality + growth + variance));
  return {
    date: formatISO(day),
    amount
  };
});

export const seedLeadStatuses = [...defaultLeadStatuses];
