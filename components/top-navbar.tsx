"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";

export function TopNavbar({ title = "TrendScope" }: { title?: string }) {
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
          <Link href="/" className="font-semibold text-slate-950 dark:text-slate-50 lg:hidden">TrendScope</Link>
          <p className="hidden text-sm font-semibold text-slate-700 dark:text-slate-300 lg:block">{title}</p>
        </div>
        <div className="hidden min-w-0 flex-1 justify-center md:flex">
          <Link
            href="/products"
            className="flex h-10 w-full max-w-lg items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            Search products, categories, or creators
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button href="/products" variant="secondary" size="sm">Explore</Button>
          <Button href="/dashboard" size="sm">Dashboard</Button>
        </div>
      </div>
      {open ? (
        <div className="fixed inset-0 z-50 bg-slate-950/40 lg:hidden" role="dialog" aria-modal="true">
          <div className="h-full w-80 max-w-[86vw] bg-white shadow-xl dark:bg-slate-950">
            <div className="flex justify-end p-3">
              <button className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-900" onClick={() => setOpen(false)} aria-label="Close navigation">
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
