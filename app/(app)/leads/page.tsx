"use client";

import * as React from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Plus, Trash2 } from "lucide-react";
import { LeadForm } from "@/components/forms/lead-form";
import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { PageTransition } from "@/components/page-transition";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { leadSources, owners } from "@/lib/constants";
import { Lead } from "@/lib/types";
import { useCRMStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function LeadsPage() {
  const leads = useCRMStore((state) => state.leads);
  const statuses = useCRMStore((state) => state.leadStatuses);
  const addLead = useCRMStore((state) => state.addLead);
  const updateLead = useCRMStore((state) => state.updateLead);
  const deleteLead = useCRMStore((state) => state.deleteLead);

  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [sourceFilter, setSourceFilter] = React.useState("all");
  const [ownerFilter, setOwnerFilter] = React.useState("all");
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editingLead, setEditingLead] = React.useState<Lead | null>(null);

  const filteredLeads = React.useMemo(() => {
    return leads.filter((lead) => {
      const value = `${lead.name} ${lead.business} ${lead.email} ${lead.phone}`.toLowerCase();
      const matchesSearch = search ? value.includes(search.toLowerCase()) : true;
      const matchesStatus = statusFilter === "all" ? true : lead.status === statusFilter;
      const matchesSource = sourceFilter === "all" ? true : lead.source === sourceFilter;
      const matchesOwner = ownerFilter === "all" ? true : lead.owner === ownerFilter;
      const created = new Date(lead.createdAt).getTime();
      const fromMatch = fromDate ? created >= new Date(fromDate).getTime() : true;
      const toMatch = toDate ? created <= new Date(toDate).getTime() + 24 * 60 * 60 * 1000 : true;
      return matchesSearch && matchesStatus && matchesSource && matchesOwner && fromMatch && toMatch;
    });
  }, [leads, search, statusFilter, sourceFilter, ownerFilter, fromDate, toDate]);

  const pipelineTotal = React.useMemo(
    () => leads.filter((lead) => !["Won", "Lost"].includes(lead.status)).reduce((sum, lead) => sum + lead.estimatedValue, 0),
    [leads]
  );

  const columns = React.useMemo<ColumnDef<Lead>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <button className="inline-flex items-center gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}> 
            Name <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
        ),
        cell: ({ row }) => (
          <Link className="font-medium text-primary hover:underline" href={`/leads/${row.original.id}`}>
            {row.original.name}
          </Link>
        )
      },
      {
        accessorKey: "business",
        header: "Business"
      },
      {
        accessorKey: "email",
        header: "Email"
      },
      {
        accessorKey: "phone",
        header: "Phone"
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />
      },
      {
        accessorKey: "source",
        header: "Source"
      },
      {
        accessorKey: "estimatedValue",
        header: "Est. Value",
        cell: ({ row }) => formatCurrency(row.original.estimatedValue)
      },
      {
        accessorKey: "lastContacted",
        header: "Last Contacted",
        cell: ({ row }) => (row.original.lastContacted ? formatDate(row.original.lastContacted) : "-")
      },
      {
        accessorKey: "nextStep",
        header: "Next Step"
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <button className="inline-flex items-center gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}> 
            Created <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
        ),
        cell: ({ row }) => formatDate(row.original.createdAt)
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" aria-label="Edit lead" onClick={() => setEditingLead(row.original)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Delete lead" onClick={() => deleteLead(row.original.id)}>
              <Trash2 className="h-4 w-4 text-danger" />
            </Button>
          </div>
        )
      }
    ],
    [deleteLead]
  );

  return (
    <PageTransition>
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
            <p className="text-sm text-muted-foreground">Track and convert opportunities with fast follow-up workflows.</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                Add Lead
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Lead</DialogTitle>
                <DialogDescription>Capture lead details and estimated pipeline value.</DialogDescription>
              </DialogHeader>
              <LeadForm
                statuses={statuses}
                onSubmit={(values) => {
                  addLead(values);
                  setCreateOpen(false);
                }}
                onCancel={() => setCreateOpen(false)}
                submitLabel="Create lead"
              />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Pipeline Total: {formatCurrency(pipelineTotal)}</CardTitle>
            <p className="text-sm text-muted-foreground">Estimated possible revenue across active opportunities</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <div className="xl:col-span-2">
                <Label htmlFor="lead-search">Search</Label>
                <Input id="lead-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search lead name, business, email..." />
              </div>
              <div>
                <Label htmlFor="lead-status-filter">Status</Label>
                <Select id="lead-status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option value="all">All statuses</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="lead-source-filter">Source</Label>
                <Select id="lead-source-filter" value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)}>
                  <option value="all">All sources</option>
                  {leadSources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="lead-owner-filter">Owner</Label>
                <Select id="lead-owner-filter" value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)}>
                  <option value="all">All owners</option>
                  {owners.map((owner) => (
                    <option key={owner} value={owner}>
                      {owner}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2 xl:col-span-1">
                <div>
                  <Label htmlFor="lead-from">From</Label>
                  <Input id="lead-from" type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
                </div>
                <div>
                  <Label htmlFor="lead-to">To</Label>
                  <Input id="lead-to" type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
                </div>
              </div>
            </div>

            {leads.length ? (
              <DataTable
                columns={columns}
                data={filteredLeads}
                emptyTitle="No leads match these filters"
                emptyDescription="Try clearing one or more filters."
              />
            ) : (
              <EmptyState title="No leads yet" description="No leads yet—add your first lead to start building your pipeline." actionLabel="Add lead" onAction={() => setCreateOpen(true)} />
            )}
          </CardContent>
        </Card>

        <Dialog open={Boolean(editingLead)} onOpenChange={(open) => !open && setEditingLead(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Lead</DialogTitle>
              <DialogDescription>Update lead details and next step.</DialogDescription>
            </DialogHeader>
            {editingLead ? (
              <LeadForm
                statuses={statuses}
                defaultValues={editingLead}
                onSubmit={(values) => {
                  updateLead(editingLead.id, values);
                  setEditingLead(null);
                }}
                onCancel={() => setEditingLead(null)}
                submitLabel="Save changes"
              />
            ) : null}
          </DialogContent>
        </Dialog>
      </section>
    </PageTransition>
  );
}
