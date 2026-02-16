"use client";

import { formatISO } from "date-fns";
import { create } from "zustand";
import {
  ActivityItem,
  Client,
  ClientInput,
  Lead,
  LeadInput,
  Project,
  ProjectInput,
  RevenuePoint,
  Task,
  TaskInput,
  TimelineEntry
} from "@/lib/types";
import { activitySeed, clientsSeed, leadsSeed, projectsSeed, revenueSeed, seedLeadStatuses, tasksSeed } from "@/lib/mock-data";
import { generateId } from "@/lib/utils";

interface CRMState {
  leadStatuses: string[];
  leads: Lead[];
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  activity: ActivityItem[];
  revenue: RevenuePoint[];
  addLeadStatus: (status: string) => void;
  removeLeadStatus: (status: string) => void;
  addLead: (input: LeadInput) => string;
  updateLead: (id: string, input: Partial<LeadInput>) => void;
  deleteLead: (id: string) => void;
  addLeadTimelineEntry: (leadId: string, entry: Omit<TimelineEntry, "id" | "createdAt">) => void;
  addClient: (input: ClientInput) => string;
  updateClient: (id: string, input: Partial<ClientInput>) => void;
  deleteClient: (id: string) => void;
  addProject: (input: ProjectInput) => string;
  updateProject: (id: string, input: Partial<ProjectInput>) => void;
  deleteProject: (id: string) => void;
  addTask: (input: TaskInput) => string;
  updateTask: (id: string, input: Partial<TaskInput>) => void;
  deleteTask: (id: string) => void;
}

function prependActivity(current: ActivityItem[], item: Omit<ActivityItem, "id" | "createdAt">) {
  const activity: ActivityItem = {
    id: generateId("activity"),
    createdAt: formatISO(new Date()),
    ...item
  };
  return [activity, ...current].slice(0, 50);
}

function appendTimeline(lead: Lead, entry: Omit<TimelineEntry, "id" | "createdAt">) {
  const next: TimelineEntry = {
    id: generateId("timeline"),
    createdAt: formatISO(new Date()),
    ...entry
  };
  return { ...lead, timeline: [next, ...lead.timeline] };
}

export const useCRMStore = create<CRMState>((set) => ({
  leadStatuses: seedLeadStatuses,
  leads: leadsSeed,
  clients: clientsSeed,
  projects: projectsSeed,
  tasks: tasksSeed,
  activity: activitySeed,
  revenue: revenueSeed,
  addLeadStatus: (status) => {
    const clean = status.trim();
    if (!clean) return;
    set((state) => {
      if (state.leadStatuses.some((item) => item.toLowerCase() === clean.toLowerCase())) return state;
      return { leadStatuses: [...state.leadStatuses, clean] };
    });
  },
  removeLeadStatus: (status) => {
    set((state) => {
      const nextStatuses = state.leadStatuses.filter((item) => item !== status);
      const fallback = nextStatuses[0] ?? "New";
      return {
        leadStatuses: nextStatuses,
        leads: state.leads.map((lead) => (lead.status === status ? { ...lead, status: fallback } : lead))
      };
    });
  },
  addLead: (input) => {
    const id = generateId("lead");
    const now = formatISO(new Date());
    const lead: Lead = {
      id,
      ...input,
      createdAt: now,
      timeline: [
        {
          id: generateId("timeline"),
          createdAt: now,
          type: "system",
          message: "Lead created"
        }
      ],
      files: [],
      taskIds: []
    };

    set((state) => ({
      leads: [lead, ...state.leads],
      activity: prependActivity(state.activity, {
        actor: input.owner,
        message: `Added lead ${input.business}`,
        entityType: "lead",
        entityId: id
      })
    }));

    return id;
  },
  updateLead: (id, input) => {
    set((state) => {
      const current = state.leads.find((lead) => lead.id === id);
      if (!current) return state;
      const statusChanged = input.status && input.status !== current.status;
      let updatedLead = { ...current, ...input };

      if (statusChanged) {
        updatedLead = appendTimeline(updatedLead, {
          type: "status",
          message: `Status changed from ${current.status} to ${input.status}`
        });
      }

      return {
        leads: state.leads.map((lead) => (lead.id === id ? updatedLead : lead)),
        activity: prependActivity(state.activity, {
          actor: input.owner ?? current.owner,
          message: statusChanged
            ? `Moved ${current.business} to ${input.status}`
            : `Updated lead ${current.business}`,
          entityType: "lead",
          entityId: id
        })
      };
    });
  },
  deleteLead: (id) => {
    set((state) => ({
      leads: state.leads.filter((lead) => lead.id !== id),
      tasks: state.tasks.filter((task) => !(task.relatedType === "lead" && task.relatedId === id)),
      activity: prependActivity(state.activity, {
        actor: "You",
        message: "Removed a lead",
        entityType: "lead",
        entityId: id
      })
    }));
  },
  addLeadTimelineEntry: (leadId, entry) => {
    set((state) => ({
      leads: state.leads.map((lead) => (lead.id === leadId ? appendTimeline(lead, entry) : lead)),
      activity: prependActivity(state.activity, {
        actor: "You",
        message: `Added update to ${state.leads.find((lead) => lead.id === leadId)?.business ?? "lead"}`,
        entityType: "lead",
        entityId: leadId
      })
    }));
  },
  addClient: (input) => {
    const id = generateId("client");
    const client: Client = {
      id,
      ...input,
      createdAt: formatISO(new Date())
    };

    set((state) => ({
      clients: [client, ...state.clients],
      activity: prependActivity(state.activity, {
        actor: "You",
        message: `Added client ${input.name}`,
        entityType: "client",
        entityId: id
      })
    }));

    return id;
  },
  updateClient: (id, input) => {
    set((state) => ({
      clients: state.clients.map((client) => (client.id === id ? { ...client, ...input } : client)),
      activity: prependActivity(state.activity, {
        actor: "You",
        message: "Updated client profile",
        entityType: "client",
        entityId: id
      })
    }));
  },
  deleteClient: (id) => {
    set((state) => ({
      clients: state.clients.filter((client) => client.id !== id),
      projects: state.projects.filter((project) => project.clientId !== id),
      tasks: state.tasks.filter((task) => !(task.relatedType === "client" && task.relatedId === id)),
      activity: prependActivity(state.activity, {
        actor: "You",
        message: "Removed client",
        entityType: "client",
        entityId: id
      })
    }));
  },
  addProject: (input) => {
    const id = generateId("project");
    const project: Project = {
      id,
      ...input
    };

    set((state) => ({
      projects: [project, ...state.projects],
      activity: prependActivity(state.activity, {
        actor: "You",
        message: `Created project ${input.name}`,
        entityType: "project",
        entityId: id
      })
    }));

    return id;
  },
  updateProject: (id, input) => {
    set((state) => ({
      projects: state.projects.map((project) => (project.id === id ? { ...project, ...input } : project)),
      activity: prependActivity(state.activity, {
        actor: "You",
        message: "Updated project",
        entityType: "project",
        entityId: id
      })
    }));
  },
  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
      tasks: state.tasks.filter((task) => !(task.relatedType === "project" && task.relatedId === id)),
      activity: prependActivity(state.activity, {
        actor: "You",
        message: "Removed project",
        entityType: "project",
        entityId: id
      })
    }));
  },
  addTask: (input) => {
    const id = generateId("task");
    const task: Task = {
      id,
      ...input
    };

    set((state) => ({
      tasks: [task, ...state.tasks],
      activity: prependActivity(state.activity, {
        actor: "You",
        message: `Created task ${input.title}`,
        entityType: "task",
        entityId: id
      })
    }));

    return id;
  },
  updateTask: (id, input) => {
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...input } : task)),
      activity: prependActivity(state.activity, {
        actor: "You",
        message: "Updated task",
        entityType: "task",
        entityId: id
      })
    }));
  },
  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
      activity: prependActivity(state.activity, {
        actor: "You",
        message: "Removed task",
        entityType: "task",
        entityId: id
      })
    }));
  }
}));

export const useEntityById = () => {
  const state = useCRMStore.getState();
  return {
    getLead: (id: string) => state.leads.find((lead) => lead.id === id),
    getClient: (id: string) => state.clients.find((client) => client.id === id),
    getProject: (id: string) => state.projects.find((project) => project.id === id)
  };
};

export function useStoreSnapshot() {
  return useCRMStore.getState();
}
