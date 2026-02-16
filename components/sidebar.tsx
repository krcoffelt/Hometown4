"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, FolderKanban, Home, PanelsTopLeft, Settings, SquareKanban, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/leads", label: "Leads", icon: PanelsTopLeft },
  { href: "/clients", label: "Clients", icon: UsersRound },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/tasks", label: "Tasks", icon: SquareKanban },
  { href: "/settings", label: "Settings", icon: Settings }
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  compact?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({ collapsed, onToggle, compact = false, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("flex h-full flex-col border-r border-border/70 bg-card/70 backdrop-blur", compact && "border-r-0")}> 
      <div className={cn("flex items-center justify-between border-b border-border/60 p-4", collapsed && !compact && "justify-center")}> 
        {!collapsed || compact ? <p className="text-base font-semibold tracking-tight">Agency CRM</p> : null}
        {!compact ? (
          <Button variant="ghost" size="sm" onClick={onToggle} aria-label="Toggle sidebar">
            {collapsed ? "Expand" : "Collapse"}
          </Button>
        ) : null}
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && !compact && "justify-center"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed || compact ? <span>{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
