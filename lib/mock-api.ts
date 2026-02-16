"use client";

import { useCRMStore } from "@/lib/store";
import { ClientInput, LeadInput, ProjectInput, TaskInput } from "@/lib/types";

const latency = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * In-memory API adapter. Replace internals with Prisma/Postgres calls later
 * while keeping page components stable.
 */
export const crmApi = {
  async listDashboardData() {
    await latency();
    const state = useCRMStore.getState();
    return {
      leads: state.leads,
      clients: state.clients,
      projects: state.projects,
      tasks: state.tasks,
      activity: state.activity,
      revenue: state.revenue
    };
  },

  async createLead(payload: LeadInput) {
    await latency();
    return useCRMStore.getState().addLead(payload);
  },

  async updateLead(id: string, payload: Partial<LeadInput>) {
    await latency();
    useCRMStore.getState().updateLead(id, payload);
  },

  async createClient(payload: ClientInput) {
    await latency();
    return useCRMStore.getState().addClient(payload);
  },

  async createProject(payload: ProjectInput) {
    await latency();
    return useCRMStore.getState().addProject(payload);
  },

  async createTask(payload: TaskInput) {
    await latency();
    return useCRMStore.getState().addTask(payload);
  }
};
