"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { taskPriorities, taskStatuses } from "@/lib/constants";
import { Client, Lead, Project, TaskInput } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  title: z.string().min(2, "Task title is required"),
  dueDate: z.string().datetime({ offset: true }),
  priority: z.enum(["Low", "Medium", "High"]),
  status: z.enum(["Todo", "In Progress", "Done"]),
  relatedType: z.enum(["lead", "client", "project"]),
  relatedId: z.string().min(1, "Related record is required"),
  description: z.string().min(3, "Description is required"),
  reminder: z.string().nullable()
});

interface TaskFormProps {
  leads: Lead[];
  clients: Client[];
  projects: Project[];
  defaultValues?: Partial<TaskInput>;
  onSubmit: (value: TaskInput) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export function TaskForm({ leads, clients, projects, defaultValues, onSubmit, onCancel, submitLabel = "Save task" }: TaskFormProps) {
  const form = useForm<TaskInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      dueDate: new Date().toISOString(),
      priority: "Medium",
      status: "Todo",
      relatedType: "lead",
      relatedId: leads[0]?.id ?? "",
      description: "",
      reminder: null,
      ...defaultValues
    }
  });

  const relatedType = form.watch("relatedType");
  const relatedOptions =
    relatedType === "lead"
      ? leads.map((lead) => ({ id: lead.id, label: `${lead.business} (${lead.name})` }))
      : relatedType === "client"
        ? clients.map((client) => ({ id: client.id, label: client.name }))
        : projects.map((project) => ({ id: project.id, label: project.name }));

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="task-title">Title</Label>
        <Input id="task-title" {...form.register("title")} />
        <p className="text-xs text-danger">{form.formState.errors.title?.message}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="task-due">Due Date</Label>
          <Input
            id="task-due"
            type="datetime-local"
            value={form.watch("dueDate")?.slice(0, 16) ?? ""}
            onChange={(event) => {
              if (!event.target.value) return;
              form.setValue("dueDate", new Date(event.target.value).toISOString());
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="task-priority">Priority</Label>
          <Select id="task-priority" {...form.register("priority")}>
            {taskPriorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="task-status">Status</Label>
          <Select id="task-status" {...form.register("status")}>
            {taskStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="task-related-type">Related Type</Label>
          <Select
            id="task-related-type"
            {...form.register("relatedType")}
            onChange={(event) => {
              const value = event.target.value as "lead" | "client" | "project";
              form.setValue("relatedType", value);
              const nextId =
                value === "lead" ? leads[0]?.id : value === "client" ? clients[0]?.id : projects[0]?.id;
              form.setValue("relatedId", nextId ?? "");
            }}
          >
            <option value="lead">Lead</option>
            <option value="client">Client</option>
            <option value="project">Project</option>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="task-related-id">Related Record</Label>
        <Select id="task-related-id" {...form.register("relatedId")}>
          {relatedOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </Select>
        <p className="text-xs text-danger">{form.formState.errors.relatedId?.message}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="task-description">Description</Label>
        <Textarea id="task-description" rows={4} {...form.register("description")} />
      </div>

      <div className="flex justify-end gap-2">
        {onCancel ? (
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
