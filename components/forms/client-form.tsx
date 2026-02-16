"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ClientInput } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  name: z.string().min(2, "Client name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Phone is required"),
  websites: z.array(z.string().url("Use a valid URL")).min(1, "Add at least one website"),
  industry: z.string().min(2, "Industry is required"),
  notes: z.string().optional().default("")
});

interface ClientFormProps {
  defaultValues?: Partial<ClientInput>;
  onSubmit: (value: ClientInput) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export function ClientForm({ defaultValues, onSubmit, onCancel, submitLabel = "Save client" }: ClientFormProps) {
  const form = useForm<ClientInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      contactName: "",
      email: "",
      phone: "",
      websites: ["https://"],
      industry: "",
      notes: "",
      ...defaultValues
    }
  });

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="client-name">Client Name</Label>
          <Input id="client-name" {...form.register("name")} />
          <p className="text-xs text-danger">{form.formState.errors.name?.message}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="client-contact">Primary Contact</Label>
          <Input id="client-contact" {...form.register("contactName")} />
          <p className="text-xs text-danger">{form.formState.errors.contactName?.message}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="client-email">Email</Label>
          <Input id="client-email" type="email" {...form.register("email")} />
          <p className="text-xs text-danger">{form.formState.errors.email?.message}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="client-phone">Phone</Label>
          <Input id="client-phone" {...form.register("phone")} />
          <p className="text-xs text-danger">{form.formState.errors.phone?.message}</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="client-websites">Website URLs (comma separated)</Label>
        <Input
          id="client-websites"
          value={form.watch("websites")?.join(", ") ?? ""}
          onChange={(event) => {
            const values = event.target.value
              .split(",")
              .map((value) => value.trim())
              .filter(Boolean);
            form.setValue("websites", values.length ? values : ["https://"]);
          }}
        />
        <p className="text-xs text-danger">{form.formState.errors.websites?.message?.toString()}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="client-industry">Industry</Label>
        <Input id="client-industry" {...form.register("industry")} />
        <p className="text-xs text-danger">{form.formState.errors.industry?.message}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="client-notes">Notes</Label>
        <Textarea id="client-notes" rows={4} {...form.register("notes")} />
      </div>

      <div className="flex justify-end gap-2">
        {onCancel ? (
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
