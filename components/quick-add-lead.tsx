"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { LeadForm } from "@/components/forms/lead-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCRMStore } from "@/lib/store";

export function QuickAddLead() {
  const [open, setOpen] = React.useState(false);
  const statuses = useCRMStore((state) => state.leadStatuses);
  const addLead = useCRMStore((state) => state.addLead);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Lead</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Lead</DialogTitle>
          <DialogDescription>Add a new prospect to your pipeline with smart defaults.</DialogDescription>
        </DialogHeader>
        <LeadForm
          statuses={statuses}
          onSubmit={(values) => {
            addLead(values);
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
          submitLabel="Create lead"
        />
      </DialogContent>
    </Dialog>
  );
}
