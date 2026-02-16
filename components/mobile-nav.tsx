"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, PanelsTopLeft, SquareKanban } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/leads", label: "Leads", icon: PanelsTopLeft },
  { href: "/tasks", label: "Tasks", icon: SquareKanban },
  { href: "/calendar", label: "Calendar", icon: CalendarDays }
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-border/80 bg-card/90 p-1 shadow-glow backdrop-blur lg:hidden">
      <ul className="grid grid-cols-4 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium",
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
