"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCRMStore } from "@/lib/store";

export default function SettingsPage() {
  const statuses = useCRMStore((state) => state.leadStatuses);
  const addLeadStatus = useCRMStore((state) => state.addLeadStatus);
  const removeLeadStatus = useCRMStore((state) => state.removeLeadStatus);
  const [newStatus, setNewStatus] = React.useState("");

  return (
    <PageTransition>
      <section className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">Configure lead pipeline statuses and core workspace behavior.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lead Status Configuration</CardTitle>
            <CardDescription>Edit statuses used throughout filters, badges, and forms.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <div key={status} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-sm">
                  <span>{status}</span>
                  {statuses.length > 2 ? (
                    <button
                      className="rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                      onClick={() => removeLeadStatus(status)}
                      aria-label={`Remove ${status}`}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Input value={newStatus} onChange={(event) => setNewStatus(event.target.value)} placeholder="Add new status" className="max-w-xs" />
              <Button
                onClick={() => {
                  if (!newStatus.trim()) return;
                  addLeadStatus(newStatus.trim());
                  setNewStatus("");
                }}
              >
                <Plus className="h-4 w-4" />
                Add status
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account & Notifications</CardTitle>
            <CardDescription>Auth is env-configured. Notification channels remain placeholders.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Connect email and push delivery services when integrating backend notifications.</p>
          </CardContent>
        </Card>
      </section>
    </PageTransition>
  );
}
