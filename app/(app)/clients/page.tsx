"use client";

import * as React from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Plus, Trash2 } from "lucide-react";
import { ClientForm } from "@/components/forms/client-form";
import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Client } from "@/lib/types";
import { useCRMStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export default function ClientsPage() {
  const clients = useCRMStore((state) => state.clients);
  const projects = useCRMStore((state) => state.projects);
  const addClient = useCRMStore((state) => state.addClient);
  const updateClient = useCRMStore((state) => state.updateClient);
  const deleteClient = useCRMStore((state) => state.deleteClient);

  const [search, setSearch] = React.useState("");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editingClient, setEditingClient] = React.useState<Client | null>(null);

  const filteredClients = React.useMemo(() => {
    if (!search.trim()) return clients;
    const value = search.toLowerCase();
    return clients.filter((client) => `${client.name} ${client.contactName} ${client.email}`.toLowerCase().includes(value));
  }, [clients, search]);

  const columns = React.useMemo<ColumnDef<Client>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <button className="inline-flex items-center gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}> 
            Client <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
        ),
        cell: ({ row }) => (
          <Link href={`/clients/${row.original.id}`} className="font-medium text-primary hover:underline">
            {row.original.name}
          </Link>
        )
      },
      {
        accessorKey: "contactName",
        header: "Contact"
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
        id: "projects",
        header: "Projects",
        cell: ({ row }) => projects.filter((project) => project.clientId === row.original.id).length
      },
      {
        id: "websites",
        header: "Website",
        cell: ({ row }) =>
          row.original.websites[0] ? (
            <a href={row.original.websites[0]} target="_blank" rel="noreferrer" className="text-primary hover:underline">
              Open site
            </a>
          ) : (
            "-"
          )
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => formatDate(row.original.createdAt)
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" aria-label="Edit client" onClick={() => setEditingClient(row.original)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Delete client" onClick={() => deleteClient(row.original.id)}>
              <Trash2 className="h-4 w-4 text-danger" />
            </Button>
          </div>
        )
      }
    ],
    [projects, deleteClient]
  );

  return (
    <PageTransition>
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
            <p className="text-sm text-muted-foreground">Manage client relationships and project portfolios.</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Client</DialogTitle>
                <DialogDescription>Add the account profile and website links.</DialogDescription>
              </DialogHeader>
              <ClientForm
                onSubmit={(values) => {
                  addClient(values);
                  setCreateOpen(false);
                }}
                onCancel={() => setCreateOpen(false)}
                submitLabel="Create client"
              />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Client Directory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search clients by name, contact, or email" />
            {clients.length ? (
              <DataTable
                columns={columns}
                data={filteredClients}
                emptyTitle="No clients match this query"
                emptyDescription="Adjust search and try again."
              />
            ) : (
              <EmptyState
                title="No clients yet"
                description="Add your first client to start organizing active work."
                actionLabel="Add client"
                onAction={() => setCreateOpen(true)}
              />
            )}
          </CardContent>
        </Card>

        <Dialog open={Boolean(editingClient)} onOpenChange={(open) => !open && setEditingClient(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Client</DialogTitle>
              <DialogDescription>Update client profile details.</DialogDescription>
            </DialogHeader>
            {editingClient ? (
              <ClientForm
                defaultValues={editingClient}
                onSubmit={(values) => {
                  updateClient(editingClient.id, values);
                  setEditingClient(null);
                }}
                onCancel={() => setEditingClient(null)}
                submitLabel="Save changes"
              />
            ) : null}
          </DialogContent>
        </Dialog>
      </section>
    </PageTransition>
  );
}
