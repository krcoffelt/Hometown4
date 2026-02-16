"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { projectStatuses } from "@/lib/constants";
import { Client, ProjectInput } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  clientId: z.string().min(1, "Client is required"),
  name: z.string().min(2, "Project name is required"),
  status: z.enum(["Planning", "In Progress", "Review", "On Hold", "Complete"]),
  startDate: z.string().datetime({ offset: true }),
  deadline: z.string().datetime({ offset: true }),
  websiteUrl: z.string().url("Enter a valid URL"),
  notes: z.string().optional().default(""),
  value: z.coerce.number().min(0, "Must be zero or greater"),
  tags: z.array(z.string()).default([])
});

interface ProjectFormProps {
  clients: Client[];
  defaultValues?: Partial<ProjectInput>;
  onSubmit: (value: ProjectInput) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export function ProjectForm({ clients, defaultValues, onSubmit, onCancel, submitLabel = "Save project" }: ProjectFormProps) {
  const form = useForm<ProjectInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      clientId: clients[0]?.id ?? "",
      name: "",
      status: "Planning",
      startDate: new Date().toISOString(),
      deadline: new Date().toISOString(),
      websiteUrl: "https://",
      notes: "",
      value: 6000,
      tags: ["Web Design"],
      ...defaultValues
    }
  });

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="project-client">Client</Label>
          <Select id="project-client" {...form.register("clientId")}>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </Select>
          <p className="text-xs text-danger">{form.formState.errors.clientId?.message}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-name">Project Name</Label>
          <Input id="project-name" {...form.register("name")} />
          <p className="text-xs text-danger">{form.formState.errors.name?.message}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="project-status">Status</Label>
          <Select id="project-status" {...form.register("status")}>
            {projectStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-value">Value</Label>
          <Input id="project-value" type="number" min={0} {...form.register("value", { valueAsNumber: true })} />
          <p className="text-xs text-danger">{form.formState.errors.value?.message}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="project-start">Start Date</Label>
          <Input
            id="project-start"
            type="datetime-local"
            value={form.watch("startDate")?.slice(0, 16) ?? ""}
            onChange={(event) => {
              if (!event.target.value) return;
              form.setValue("startDate", new Date(event.target.value).toISOString());
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-deadline">Deadline</Label>
          <Input
            id="project-deadline"
            type="datetime-local"
            value={form.watch("deadline")?.slice(0, 16) ?? ""}
            onChange={(event) => {
              if (!event.target.value) return;
              form.setValue("deadline", new Date(event.target.value).toISOString());
            }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-url">Website URL</Label>
        <Input id="project-url" type="url" {...form.register("websiteUrl")} />
        <p className="text-xs text-danger">{form.formState.errors.websiteUrl?.message}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-tags">Tags (comma separated)</Label>
        <Input
          id="project-tags"
          value={(form.watch("tags") ?? []).join(", ")}
          onChange={(event) => {
            const values = event.target.value
              .split(",")
              .map((value) => value.trim())
              .filter(Boolean);
            form.setValue("tags", values);
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-notes">Notes</Label>
        <Textarea id="project-notes" rows={4} {...form.register("notes")} />
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
