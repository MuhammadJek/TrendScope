import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { TopNavbar } from "@/components/top-navbar";

export function AppFrame({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="lg:grid lg:grid-cols-[18rem_1fr]">
        <AppSidebar />
        <div className="min-w-0">
          <TopNavbar title={title} />
          <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
