import { clsx, type ClassValue } from "clsx";
import { format, formatDistanceToNow, isAfter, isBefore, isToday, isTomorrow, parseISO, startOfDay } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(date: string | Date, dateFormat = "MMM d, yyyy") {
  return format(typeof date === "string" ? parseISO(date) : date, dateFormat);
}

export function formatDateTime(date: string | Date) {
  return format(typeof date === "string" ? parseISO(date) : date, "MMM d, yyyy h:mm a");
}

export function getRelativeTime(date: string | Date) {
  return formatDistanceToNow(typeof date === "string" ? parseISO(date) : date, {
    addSuffix: true
  });
}

export function generateId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

export function parseNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function dueLabel(date: string) {
  const due = parseISO(date);
  if (isToday(due)) return "Due today";
  if (isTomorrow(due)) return "Due tomorrow";
  if (isBefore(due, startOfDay(new Date()))) return "Overdue";
  if (isAfter(due, startOfDay(new Date()))) return `Due ${format(due, "MMM d")}`;
  return "Upcoming";
}
