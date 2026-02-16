"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CalendarClock, CircleDollarSign, Mail, Phone, Plus } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { PageTransition } from "@/components/page-transition";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCRMStore } from "@/lib/store";
import { dueLabel, formatCurrency, formatDate, formatDateTime } from "@/lib/utils";

export default function LeadDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const leadStatuses = useCRMStore((state) => state.leadStatuses);
  const lead = useCRMStore((state) => state.leads.find((item) => item.id === params.id));
  const tasks = useCRMStore((state) => state.tasks.filter((task) => task.relatedType === "lead" && task.relatedId === params.id));
  const updateLead = useCRMStore((state) => state.updateLead);
  const addLeadTimelineEntry = useCRMStore((state) => state.addLeadTimelineEntry);
  const updateTask = useCRMStore((state) => state.updateTask);
  const [note, setNote] = React.useState("");

  if (!lead) {
    return (
      <PageTransition>
        <EmptyState
          title="Lead not found"
          description="This lead does not exist or was removed."
          actionLabel="Back to leads"
          onAction={() => router.push("/leads")}
        />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Button variant="ghost" size="sm" onClick={() => router.push("/leads")} className="mb-2 -ml-3">
              <ArrowLeft className="h-4 w-4" />
              Back to leads
            </Button>
            <h1 className="text-2xl font-semibold tracking-tight">{lead.business}</h1>
            <p className="text-sm text-muted-foreground">Primary contact: {lead.name}</p>
          </div>
          <StatusBadge status={lead.status} />
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border/70 bg-background/60 p-3 text-sm">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="mt-1 flex items-center gap-2 font-medium">
                  <Mail className="h-4 w-4 text-primary" />
                  {lead.email}
                </p>
              </div>
              <div className="rounded-lg border border-border/70 bg-background/60 p-3 text-sm">
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="mt-1 flex items-center gap-2 font-medium">
                  <Phone className="h-4 w-4 text-primary" />
                  {lead.phone}
                </p>
              </div>
              <div className="rounded-lg border border-border/70 bg-background/60 p-3 text-sm">
                <p className="text-xs text-muted-foreground">Estimated Possible Revenue</p>
                <p className="mt-1 flex items-center gap-2 font-semibold">
                  <CircleDollarSign className="h-4 w-4 text-primary" />
                  {formatCurrency(lead.estimatedValue)}
                </p>
              </div>
              <div className="rounded-lg border border-border/70 bg-background/60 p-3 text-sm">
                <p className="text-xs text-muted-foreground">Last Contacted</p>
                <p className="mt-1 flex items-center gap-2 font-medium">
                  <CalendarClock className="h-4 w-4 text-primary" />
                  {lead.lastContacted ? formatDate(lead.lastContacted) : "Not yet"}
                </p>
              </div>
              <div className="sm:col-span-2 rounded-lg border border-border/70 bg-background/60 p-3 text-sm">
                <p className="text-xs text-muted-foreground">Next Step</p>
                <p className="mt-1 font-medium">{lead.nextStep}</p>
              </div>

              <div className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="status-change">Change Status</Label>
                  <Select
                    id="status-change"
                    value={lead.status}
                    onChange={(event) => updateLead(lead.id, { status: event.target.value })}
                  >
                    {leadStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="next-step">Update Next Step</Label>
                  <Input id="next-step" defaultValue={lead.nextStep} onBlur={(event) => updateLead(lead.id, { nextStep: event.target.value })} />
                </div>
              </div>

              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="lead-notes">Lead Notes</Label>
                <Textarea
                  id="lead-notes"
                  rows={4}
                  defaultValue={lead.notes}
                  onBlur={(event) => updateLead(lead.id, { notes: event.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Files & Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {lead.files.length ? (
                lead.files.map((file) => (
                  <a key={file.id} href={file.url} target="_blank" rel="noreferrer" className="block rounded-md border border-border/70 px-3 py-2 hover:bg-muted">
                    {file.label}
                  </a>
                ))
              ) : (
                <p className="rounded-md border border-dashed border-border p-4 text-muted-foreground">No files or links attached yet.</p>
              )}
              <p className="text-xs text-muted-foreground">Attach proposal files or reference docs in future integrations.</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Tasks</CardTitle>
              <Button size="sm" variant="outline" asChild>
                <Link href="/tasks">
                  <Plus className="h-4 w-4" />
                  Add task
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.length ? (
                tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between rounded-lg border border-border/70 bg-background/60 p-3 text-sm">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {dueLabel(task.dueDate)} • {task.priority}
                      </p>
                    </div>
                    <Select
                      value={task.status}
                      onChange={(event) =>
                        updateTask(task.id, {
                          status: event.target.value as "Todo" | "In Progress" | "Done"
                        })
                      }
                      className="max-w-[150px]"
                    >
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </Select>
                  </div>
                ))
              ) : (
                <p className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">No lead tasks yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes & Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="add-note">Add Timeline Note</Label>
                <Textarea id="add-note" rows={3} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Log context after calls or follow-ups..." />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => {
                      if (!note.trim()) return;
                      addLeadTimelineEntry(lead.id, { message: note.trim(), type: "note" });
                      setNote("");
                    }}
                  >
                    Add note
                  </Button>
                </div>
              </div>

              <ul className="space-y-2">
                {lead.timeline.map((entry) => (
                  <li key={entry.id} className="rounded-lg border border-border/70 bg-background/60 p-3 text-sm">
                    <p>{entry.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(entry.createdAt)}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageTransition>
  );
}
