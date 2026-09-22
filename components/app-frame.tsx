import type { ReactNode } from "react";
import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { TopNavbar } from "@/components/top-navbar";

export async function AppFrame({ children, title }: { children: ReactNode; title: string }) {
  const session = await auth();
  const user = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }
    : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="lg:grid lg:grid-cols-[18rem_1fr]">
        <AppSidebar user={user} />
        <div className="min-w-0">
          <TopNavbar title={title} user={user} />
          <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
