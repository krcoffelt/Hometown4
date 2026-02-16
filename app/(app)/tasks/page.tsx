"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { isBefore, isThisWeek, isToday, parseISO, startOfDay } from "date-fns";
import { CheckCircle2, Plus, Trash2 } from "lucide-react";
import { TaskForm } from "@/components/forms/task-form";
import { EmptyState } from "@/components/empty-state";
import { PageTransition } from "@/components/page-transition";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useCRMStore } from "@/lib/store";
import { Task } from "@/lib/types";
import { dueLabel, formatDateTime } from "@/lib/utils";

type DueFilter = "all" | "today" | "week" | "overdue";

export default function TasksPage() {
  const prefersReducedMotion = useReducedMotion();
  const tasks = useCRMStore((state) => state.tasks);
  const leads = useCRMStore((state) => state.leads);
  const clients = useCRMStore((state) => state.clients);
  const projects = useCRMStore((state) => state.projects);
  const addTask = useCRMStore((state) => state.addTask);
  const updateTask = useCRMStore((state) => state.updateTask);
  const deleteTask = useCRMStore((state) => state.deleteTask);

  const [search, setSearch] = React.useState("");
  const [dueFilter, setDueFilter] = React.useState<DueFilter>("all");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);

  const filteredTasks = React.useMemo(() => {
    return tasks.filter((task) => {
      const due = parseISO(task.dueDate);
      const matchesSearch = search
        ? `${task.title} ${task.description} ${task.relatedType}`.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesDue =
        dueFilter === "all"
          ? true
          : dueFilter === "today"
            ? isToday(due)
            : dueFilter === "week"
              ? isThisWeek(due, { weekStartsOn: 1 })
              : isBefore(due, startOfDay(new Date()));
      const matchesPriority = priorityFilter === "all" ? true : task.priority === priorityFilter;
      const matchesStatus = statusFilter === "all" ? true : task.status === statusFilter;
      return matchesSearch && matchesDue && matchesPriority && matchesStatus;
    });
  }, [tasks, search, dueFilter, priorityFilter, statusFilter]);

  const relationLabel = React.useCallback(
    (task: Task) => {
      if (task.relatedType === "lead") {
        const lead = leads.find((item) => item.id === task.relatedId);
        return lead ? `${lead.business} lead` : "Lead";
      }
      if (task.relatedType === "client") {
        const client = clients.find((item) => item.id === task.relatedId);
        return client ? `${client.name} client` : "Client";
      }
      const project = projects.find((item) => item.id === task.relatedId);
      return project ? `${project.name} project` : "Project";
    },
    [leads, clients, projects]
  );

  return (
    <PageTransition>
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
            <p className="text-sm text-muted-foreground">Prioritize work across leads, clients, and active delivery.</p>
          </div>

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Task</DialogTitle>
                <DialogDescription>Add a task with due date, priority, and relation.</DialogDescription>
              </DialogHeader>
              <TaskForm
                leads={leads}
                clients={clients}
                projects={projects}
                onSubmit={(values) => {
                  addTask(values);
                  setCreateOpen(false);
                }}
                onCancel={() => setCreateOpen(false)}
                submitLabel="Create task"
              />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Task List</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <div className="xl:col-span-2">
                <Label htmlFor="task-search">Search</Label>
                <Input id="task-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search task title or description" />
              </div>

              <div>
                <Label htmlFor="task-due-filter">Due</Label>
                <Select id="task-due-filter" value={dueFilter} onChange={(event) => setDueFilter(event.target.value as DueFilter)}>
                  <option value="all">All</option>
                  <option value="today">Due today</option>
                  <option value="week">This week</option>
                  <option value="overdue">Overdue</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="task-priority-filter">Priority</Label>
                <Select id="task-priority-filter" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
                  <option value="all">All</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="task-status-filter">Status</Label>
                <Select id="task-status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option value="all">All</option>
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </Select>
              </div>
            </div>

            {tasks.length ? (
              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {filteredTasks.map((task) => (
                    <motion.article
                      key={task.id}
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                      exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
                      className="rounded-xl border border-border/70 bg-background/70 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{task.title}</p>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {relationLabel(task)} • {formatDateTime(task.dueDate)} • {dueLabel(task.dueDate)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <StatusBadge status={task.priority} />
                          <StatusBadge status={task.status} />
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Select
                          className="max-w-[180px]"
                          value={task.status}
                          onChange={(event) =>
                            updateTask(task.id, {
                              status: event.target.value as "Todo" | "In Progress" | "Done"
                            })
                          }
                        >
                          <option value="Todo">Todo</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                        </Select>
                        <Button variant="outline" size="sm" onClick={() => setEditingTask(task)}>
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
                          <Trash2 className="h-4 w-4 text-danger" />
                          Delete
                        </Button>
                        {task.status !== "Done" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              updateTask(task.id, {
                                status: "Done"
                              })
                            }
                          >
                            <CheckCircle2 className="h-4 w-4 text-success" />
                            Mark done
                          </Button>
                        ) : null}
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>

                {!filteredTasks.length ? (
                  <EmptyState title="No tasks match these filters" description="Adjust your filters or create a new task." />
                ) : null}
              </div>
            ) : (
              <EmptyState
                title="No tasks yet"
                description="Create your first task to keep deadlines and follow-ups visible."
                actionLabel="Add task"
                onAction={() => setCreateOpen(true)}
              />
            )}
          </CardContent>
        </Card>

        <Dialog open={Boolean(editingTask)} onOpenChange={(open) => !open && setEditingTask(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>Update assignment and due details.</DialogDescription>
            </DialogHeader>
            {editingTask ? (
              <TaskForm
                leads={leads}
                clients={clients}
                projects={projects}
                defaultValues={editingTask}
                onSubmit={(values) => {
                  updateTask(editingTask.id, values);
                  setEditingTask(null);
                }}
                onCancel={() => setEditingTask(null)}
                submitLabel="Save changes"
              />
            ) : null}
          </DialogContent>
        </Dialog>
      </section>
    </PageTransition>
  );
}
