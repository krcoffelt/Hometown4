"use client";

import { Menu } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { GlobalSearch } from "@/components/global-search";
import { QuickAddLead } from "@/components/quick-add-lead";
import { ThemeToggle } from "@/components/theme-toggle";

export function Topbar({ onMobileMenuOpen }: { onMobileMenuOpen: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center gap-3 px-4 lg:px-6">
        <Button variant="outline" size="icon" className="lg:hidden" onClick={onMobileMenuOpen} aria-label="Open menu">
          <Menu className="h-4 w-4" />
        </Button>

        <GlobalSearch />

        <div className="ml-auto flex items-center gap-2">
          <QuickAddLead />
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="hidden sm:inline-flex">
                You
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile (placeholder)</DropdownMenuItem>
              <DropdownMenuItem>Billing (placeholder)</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign out (placeholder)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
