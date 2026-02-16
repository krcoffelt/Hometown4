"use client";

import * as React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useCRMStore } from "@/lib/store";
import { Input } from "@/components/ui/input";

export function GlobalSearch() {
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const leads = useCRMStore((state) => state.leads);
  const clients = useCRMStore((state) => state.clients);
  const projects = useCRMStore((state) => state.projects);

  const results = React.useMemo(() => {
    if (!query.trim()) return [];
    const value = query.trim().toLowerCase();

    const leadMatches = leads
      .filter((lead) => [lead.name, lead.business, lead.email].join(" ").toLowerCase().includes(value))
      .slice(0, 4)
      .map((lead) => ({
        id: lead.id,
        label: `${lead.business} • ${lead.name}`,
        href: `/leads/${lead.id}`,
        group: "Lead"
      }));

    const clientMatches = clients
      .filter((client) => [client.name, client.contactName, client.email].join(" ").toLowerCase().includes(value))
      .slice(0, 3)
      .map((client) => ({
        id: client.id,
        label: client.name,
        href: `/clients/${client.id}`,
        group: "Client"
      }));

    const projectMatches = projects
      .filter((project) => project.name.toLowerCase().includes(value))
      .slice(0, 3)
      .map((project) => ({
        id: project.id,
        label: project.name,
        href: "/projects",
        group: "Project"
      }));

    return [...leadMatches, ...clientMatches, ...projectMatches].slice(0, 8);
  }, [query, leads, clients, projects]);

  React.useEffect(() => {
    if (!query) {
      setOpen(false);
      return;
    }
    setOpen(true);
  }, [query]);

  return (
    <div className="relative w-full max-w-xl">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        aria-label="Search leads, clients, and projects"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => query && setOpen(true)}
        placeholder="Search clients, leads, projects..."
        className="pl-9"
      />
      {open ? (
        <div className="absolute top-[calc(100%+0.35rem)] z-40 w-full rounded-lg border border-border bg-card p-2 shadow-soft">
          {results.length ? (
            <ul className="space-y-1">
              {results.map((result) => (
                <li key={`${result.group}-${result.id}`}>
                  <Link
                    href={result.href}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    <p className="font-medium">{result.label}</p>
                    <p className="text-xs text-muted-foreground">{result.group}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-2 py-3 text-sm text-muted-foreground">No matches found.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
