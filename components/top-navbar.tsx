"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { UserDropdown } from "@/components/auth/user-dropdown";

type NavUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
} | null;

export function TopNavbar({
  title = "TrendScope",
  user,
}: {
  title?: string;
  user?: NavUser;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <Link href="/" className="font-semibold text-slate-950 dark:text-slate-50 lg:hidden">
            TrendScope
          </Link>
          <p className="hidden text-sm font-semibold text-slate-700 dark:text-slate-300 lg:block">
            {title}
          </p>
        </div>
        <div className="hidden min-w-0 flex-1 justify-center md:flex">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const query = formData.get("query") as string;
              if (query.trim()) {
                window.location.href = `/research/tiktok/result/${encodeURIComponent(query.trim())}`;
              }
            }}
            className="flex h-10 w-full max-w-lg items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 transition-all"
          >
            <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <input
              name="query"
              type="search"
              placeholder="Search trends, keywords, or creators..."
              className="w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500"
              autoComplete="off"
            />
          </form>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <UserDropdown user={user} />
          ) : (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 transition"
            >
              <span>Dashboard</span>
            </Link>
          )}
        </div>
      </div>
      {open ? (
        <div className="fixed inset-0 z-50 bg-slate-950/40 lg:hidden" role="dialog" aria-modal="true">
          <div className="h-full w-80 max-w-[86vw] bg-white shadow-xl dark:bg-slate-950">
            <div className="flex justify-end p-3">
              <button
                className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-900"
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <AppSidebar className="block border-0" />
          </div>
        </div>
      ) : null}
    </header>
  );
}
