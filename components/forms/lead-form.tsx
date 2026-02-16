"use client";

import { useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { leadSources, owners } from "@/lib/constants";
import { LeadInput } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface LeadFormProps {
  statuses: string[];
  defaultValues?: Partial<LeadInput>;
  onSubmit: (value: LeadInput) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export function LeadForm({ statuses, defaultValues, onSubmit, onCancel, submitLabel = "Save lead" }: LeadFormProps) {
  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, "Name is required"),
        business: z.string().min(2, "Business is required"),
        email: z.string().email("Enter a valid email"),
        phone: z.string().min(7, "Phone is required"),
        status: z.string().refine((value) => statuses.includes(value), "Select a valid status"),
        source: z.enum(["Referral", "Website", "Cold Outreach", "Social", "Partner", "Other"]),
        owner: z.string().min(2, "Owner is required"),
        estimatedValue: z.coerce.number().min(0, "Must be zero or greater"),
        lastContacted: z.string().nullable(),
        nextStep: z.string().min(3, "Next step is required"),
        notes: z.string().optional().default("")
      }),
    [statuses]
  );

  const form = useForm<LeadInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      business: "",
      email: "",
      phone: "",
      status: statuses[0] ?? "New",
      source: "Website",
      owner: owners[0],
      estimatedValue: 5000,
      lastContacted: null,
      nextStep: "Schedule intro call",
      notes: "",
      ...defaultValues
    }
  });

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="lead-name">Name</Label>
          <Input id="lead-name" {...form.register("name")} />
          <p className="text-xs text-danger">{form.formState.errors.name?.message}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lead-business">Business</Label>
          <Input id="lead-business" {...form.register("business")} />
          <p className="text-xs text-danger">{form.formState.errors.business?.message}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="lead-email">Email</Label>
          <Input id="lead-email" type="email" {...form.register("email")} />
          <p className="text-xs text-danger">{form.formState.errors.email?.message}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lead-phone">Phone</Label>
          <Input id="lead-phone" {...form.register("phone")} />
          <p className="text-xs text-danger">{form.formState.errors.phone?.message}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="lead-status">Status</Label>
          <Select id="lead-status" {...form.register("status")}>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
          <p className="text-xs text-danger">{form.formState.errors.status?.message}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lead-source">Source</Label>
          <Select id="lead-source" {...form.register("source")}>
            {leadSources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </Select>
          <p className="text-xs text-danger">{form.formState.errors.source?.message}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="lead-owner">Owner</Label>
          <Select id="lead-owner" {...form.register("owner")}>
            {owners.map((owner) => (
              <option key={owner} value={owner}>
                {owner}
              </option>
            ))}
          </Select>
          <p className="text-xs text-danger">{form.formState.errors.owner?.message}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lead-value">Estimated Possible Revenue</Label>
          <Input id="lead-value" type="number" min={0} {...form.register("estimatedValue", { valueAsNumber: true })} />
          <p className="text-xs text-danger">{form.formState.errors.estimatedValue?.message}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lead-last">Last Contacted</Label>
          <Input
            id="lead-last"
            type="datetime-local"
            value={form.watch("lastContacted") ? form.watch("lastContacted")!.slice(0, 16) : ""}
            onChange={(event) => form.setValue("lastContacted", event.target.value ? new Date(event.target.value).toISOString() : null)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="lead-next-step">Next Step</Label>
        <Input id="lead-next-step" {...form.register("nextStep")} />
        <p className="text-xs text-danger">{form.formState.errors.nextStep?.message}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="lead-notes">Notes</Label>
        <Textarea id="lead-notes" rows={4} {...form.register("notes")} />
      </div>

      <div className="flex items-center justify-end gap-2">
        {onCancel ? (
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
