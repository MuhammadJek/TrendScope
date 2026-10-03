"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Compass, Home, LineChart, PackageSearch, Settings, Trophy, User, Search, PlaySquare } from "lucide-react";
import { UserAvatar } from "@/components/auth/user-avatar";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/research/shopee", label: "Shopee (Coming Soon)", icon: Search },
  { href: "/research/amazon", label: "Amazon Analytics", icon: Search },
  { href: "/research/envato", label: "Envato Analytics", icon: Search },
  { href: "/youtube", label: "YouTube Insights", icon: PlaySquare },
  { href: "/pricing", label: "Pricing", icon: Compass },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

type SidebarUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
} | null;

export function AppSidebar({
  className,
  user,
}: {
  className?: string;
  user?: SidebarUser;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:block",
        className
      )}
    >
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
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                  active
                    ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-50"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}

        </nav>

        {/* User footer */}
        <div className="mt-auto rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
          {user ? (
            <Link href="/profile" className="flex items-center gap-3">
              <UserAvatar name={user.name} image={user.image} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950 dark:text-slate-50">
                  {user.name ?? "Account"}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
              </div>
            </Link>
          ) : (
            <div>
              <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">Prototype mode</p>
              <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
                Every metric is labeled by data status and source availability.
              </p>
              <Link
                href="/login"
                className="mt-3 flex w-full items-center justify-center rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
