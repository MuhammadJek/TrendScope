"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Compass, Home, LineChart, PackageSearch, Settings, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/products", label: "Products", icon: PackageSearch },
  { href: "/rankings", label: "Rankings", icon: Trophy },
  { href: "/trends", label: "Trends", icon: LineChart },
  { href: "/pricing", label: "Pricing", icon: Compass },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside className={cn("hidden border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:block", className)}>
      <div className="sticky top-0 flex h-screen w-72 flex-col p-5">
        <Link href="/" className="flex items-center gap-3 rounded-xl px-2 py-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
            TS
          </span>
          <div>
            <p className="font-semibold text-slate-950 dark:text-slate-50">TrendScope</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Market intelligence</p>
          </div>
        </Link>
        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                  active
                    ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-50",
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="font-semibold text-slate-950 dark:text-slate-50">Prototype mode</p>
          <p className="mt-2 leading-6 text-slate-600 dark:text-slate-400">Every metric is labeled by data status and source availability.</p>
        </div>
      </div>
    </aside>
  );
}
