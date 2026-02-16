"use client";

import { useMemo } from "react";
import { CalendarView } from "@/components/calendar/calendar-view";
import { EmptyState } from "@/components/empty-state";
import { PageTransition } from "@/components/page-transition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCRMStore } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";

export default function CalendarPage() {
  const tasks = useCRMStore((state) => state.tasks);
  const projects = useCRMStore((state) => state.projects);

  const events = useMemo(() => {
    const taskEvents = tasks.map((task) => ({
      id: `task-${task.id}`,
      title: task.title,
      date: task.dueDate,
      type: "task" as const,
      meta: `Task • ${task.priority} • ${task.status}`
    }));

    const deadlineEvents = projects.map((project) => ({
      id: `project-${project.id}`,
      title: `${project.name} deadline`,
      date: project.deadline,
      type: "deadline" as const,
      meta: `Project deadline • ${project.status}`
    }));

    return [...taskEvents, ...deadlineEvents].sort((a, b) => a.date.localeCompare(b.date));
  }, [tasks, projects]);

  return (
    <PageTransition>
      <section className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
          <p className="text-sm text-muted-foreground">View tasks and project deadlines across month, week, and day views.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
          </CardHeader>
          <CardContent>{events.length ? <CalendarView events={events} /> : <EmptyState title="Calendar is empty" description="Add tasks or projects to populate your schedule." />}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {events.slice(0, 6).map((event) => (
              <div key={event.id} className="rounded-md border border-border/70 bg-background/60 px-3 py-2 text-sm">
                <p className="font-medium">{event.title}</p>
                <p className="text-xs text-muted-foreground">
                  {event.meta} • {formatDateTime(event.date)}
                </p>
              </div>
            ))}
            {!events.length ? <p className="text-sm text-muted-foreground">No upcoming items.</p> : null}
          </CardContent>
        </Card>
      </section>
    </PageTransition>
  );
}
