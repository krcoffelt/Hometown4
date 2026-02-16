"use client";

import * as React from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { ProjectForm } from "@/components/forms/project-form";
import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { PageTransition } from "@/components/page-transition";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Project } from "@/lib/types";
import { useCRMStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ProjectsPage() {
  const projects = useCRMStore((state) => state.projects);
  const clients = useCRMStore((state) => state.clients);
  const addProject = useCRMStore((state) => state.addProject);
  const updateProject = useCRMStore((state) => state.updateProject);
  const deleteProject = useCRMStore((state) => state.deleteProject);

  const [search, setSearch] = React.useState("");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<Project | null>(null);

  const filteredProjects = React.useMemo(() => {
    if (!search.trim()) return projects;
    const value = search.toLowerCase();
    return projects.filter((project) => `${project.name} ${project.status} ${project.tags.join(" ")}`.toLowerCase().includes(value));
  }, [projects, search]);

  const columns = React.useMemo<ColumnDef<Project>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Project Name",
        cell: ({ row }) => {
          const client = clients.find((item) => item.id === row.original.clientId);
          return (
            <div>
              <p className="font-medium">{row.original.name}</p>
              {client ? (
                <Link href={`/clients/${client.id}`} className="text-xs text-muted-foreground hover:text-foreground">
                  {client.name}
                </Link>
              ) : null}
            </div>
          );
        }
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />
      },
      {
        accessorKey: "startDate",
        header: "Start Date",
        cell: ({ row }) => formatDate(row.original.startDate)
      },
      {
        accessorKey: "deadline",
        header: "Deadline",
        cell: ({ row }) => formatDate(row.original.deadline)
      },
      {
        accessorKey: "websiteUrl",
        header: "Website URL",
        cell: ({ row }) => (
          <a href={row.original.websiteUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
            Open site
          </a>
        )
      },
      {
        accessorKey: "notes",
        header: "Notes"
      },
      {
        accessorKey: "value",
        header: "Value",
        cell: ({ row }) => formatCurrency(row.original.value)
      },
      {
        accessorKey: "tags",
        header: "Tags",
        cell: ({ row }) => row.original.tags.join(", ")
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" aria-label="Edit project" onClick={() => setEditingProject(row.original)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Delete project" onClick={() => deleteProject(row.original.id)}>
              <Trash2 className="h-4 w-4 text-danger" />
            </Button>
          </div>
        )
      }
    ],
    [clients, deleteProject]
  );

  return (
    <PageTransition>
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
            <p className="text-sm text-muted-foreground">Track delivery timelines, budgets, and status across active client work.</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Project</DialogTitle>
                <DialogDescription>Assign a project to a client and define timeline/value.</DialogDescription>
              </DialogHeader>
              <ProjectForm
                clients={clients}
                onSubmit={(values) => {
                  addProject(values);
                  setCreateOpen(false);
                }}
                onCancel={() => setCreateOpen(false)}
                submitLabel="Create project"
              />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Portfolio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search projects by name, status, tags" />
            {projects.length ? (
              <DataTable columns={columns} data={filteredProjects} emptyTitle="No projects match this query" emptyDescription="Try a broader search." />
            ) : (
              <EmptyState
                title="No projects yet"
                description="Create your first project to start tracking deadlines and value."
                actionLabel="Add project"
                onAction={() => setCreateOpen(true)}
              />
            )}
          </CardContent>
        </Card>

        <Dialog open={Boolean(editingProject)} onOpenChange={(open) => !open && setEditingProject(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
              <DialogDescription>Update timeline, status, and delivery details.</DialogDescription>
            </DialogHeader>
            {editingProject ? (
              <ProjectForm
                clients={clients}
                defaultValues={editingProject}
                onSubmit={(values) => {
                  updateProject(editingProject.id, values);
                  setEditingProject(null);
                }}
                onCancel={() => setEditingProject(null)}
                submitLabel="Save changes"
              />
            ) : null}
          </DialogContent>
        </Dialog>
      </section>
    </PageTransition>
  );
}
