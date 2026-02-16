"use client";

import * as React from "react";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { MobileNav } from "@/components/mobile-nav";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[auto_1fr]">
      <aside className={`hidden h-screen lg:sticky lg:top-0 lg:block ${collapsed ? "lg:w-[84px]" : "lg:w-[260px]"}`}>
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
      </aside>

      <div className="flex min-h-screen flex-col">
        <Topbar onMobileMenuOpen={() => setMobileMenuOpen(true)} />
        <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 pb-24 pt-4 lg:px-6 lg:pb-8 lg:pt-6">{children}</main>
      </div>

      <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <DialogContent className="left-0 top-0 h-screen w-[82vw] max-w-[320px] translate-x-0 translate-y-0 rounded-none border-0 p-0">
          <Sidebar collapsed={false} onToggle={() => setMobileMenuOpen(false)} compact onNavigate={() => setMobileMenuOpen(false)} />
        </DialogContent>
      </Dialog>

      <MobileNav />
    </div>
  );
}
