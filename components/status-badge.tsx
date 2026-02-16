import { Badge } from "@/components/ui/badge";

const map: Record<string, "default" | "muted" | "success" | "warning" | "danger"> = {
  New: "default",
  Contacted: "muted",
  "Discovery Scheduled": "warning",
  "Proposal Sent": "warning",
  Negotiation: "warning",
  Won: "success",
  Lost: "danger",
  Planning: "muted",
  "In Progress": "default",
  Review: "warning",
  "On Hold": "danger",
  Complete: "success",
  Todo: "muted",
  Done: "success",
  High: "danger",
  Medium: "warning",
  Low: "default"
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge variant={map[status] ?? "muted"}>{status}</Badge>;
}
