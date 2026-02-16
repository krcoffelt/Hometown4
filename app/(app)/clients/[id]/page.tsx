"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Plus } from "lucide-react";
import { ProjectForm } from "@/components/forms/project-form";
import { EmptyState } from "@/components/empty-state";
import { PageTransition } from "@/components/page-transition";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCRMStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ClientDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const client = useCRMStore((state) => state.clients.find((item) => item.id === params.id));
  const clients = useCRMStore((state) => state.clients);
  const projects = useCRMStore((state) => state.projects.filter((project) => project.clientId === params.id));
  const addProject = useCRMStore((state) => state.addProject);
  const updateClient = useCRMStore((state) => state.updateClient);
  const deleteProject = useCRMStore((state) => state.deleteProject);

  const [createProjectOpen, setCreateProjectOpen] = React.useState(false);

  if (!client) {
    return (
      <PageTransition>
        <EmptyState
          title="Client not found"
          description="This client does not exist or was deleted."
          actionLabel="Back to clients"
          onAction={() => router.push("/clients")}
        />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Button variant="ghost" size="sm" onClick={() => router.push("/clients")} className="mb-2 -ml-3">
              <ArrowLeft className="h-4 w-4" />
              Back to clients
            </Button>
            <h1 className="text-2xl font-semibold tracking-tight">{client.name}</h1>
            <p className="text-sm text-muted-foreground">Contact: {client.contactName}</p>
          </div>
          <Dialog open={createProjectOpen} onOpenChange={setCreateProjectOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Project</DialogTitle>
                <DialogDescription>Log a project under this client account.</DialogDescription>
              </DialogHeader>
              <ProjectForm
                clients={clients}
                defaultValues={{ clientId: client.id }}
                onSubmit={(values) => {
                  addProject(values);
                  setCreateProjectOpen(false);
                }}
                onCancel={() => setCreateProjectOpen(false)}
                submitLabel="Create project"
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Client Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="client-email">Email</Label>
                  <Input id="client-email" defaultValue={client.email} onBlur={(event) => updateClient(client.id, { email: event.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-phone">Phone</Label>
                  <Input id="client-phone" defaultValue={client.phone} onBlur={(event) => updateClient(client.id, { phone: event.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client-notes">Notes</Label>
                <Textarea id="client-notes" rows={4} defaultValue={client.notes} onBlur={(event) => updateClient(client.id, { notes: event.target.value })} />
              </div>

              <p className="text-xs text-muted-foreground">Client since {formatDate(client.createdAt)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Websites</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {client.websites.map((website) => (
                <a
                  key={website}
                  href={website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-lg border border-border/70 bg-background/60 px-3 py-2 text-sm hover:bg-muted"
                >
                  <span className="truncate">{website}</span>
                  <span className="inline-flex items-center gap-1 text-primary">
                    Open site
                    <ExternalLink className="h-3.5 w-3.5" />
                  </span>
                </a>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {projects.length ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {projects.map((project) => (
                  <article key={project.id} className="rounded-xl border border-border/70 bg-background/60 p-4 text-sm">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <h3 className="font-semibold">{project.name}</h3>
                      <StatusBadge status={project.status} />
                    </div>
                    <p className="text-muted-foreground">{project.notes}</p>
                    <dl className="mt-3 space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <dt>Start</dt>
                        <dd>{formatDate(project.startDate)}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt>Deadline</dt>
                        <dd>{formatDate(project.deadline)}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt>Value</dt>
                        <dd>{formatCurrency(project.value)}</dd>
                      </div>
                    </dl>
                    <a href={project.websiteUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs font-medium text-primary hover:underline">
                      Open site
                    </a>
                    <div className="mt-3 flex justify-end">
                      <Button size="sm" variant="ghost" onClick={() => deleteProject(project.id)}>
                        Remove
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No projects yet"
                description="Create the first project for this client."
                actionLabel="Add project"
                onAction={() => setCreateProjectOpen(true)}
              />
            )}
          </CardContent>
        </Card>
      </section>
    </PageTransition>
  );
}
