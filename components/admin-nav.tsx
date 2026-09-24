"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const adminNavItems = [
  { href: "/dzakiganteng/users", label: "User Management" },
  { href: "/dzakiganteng/integrations", label: "API Integrations" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-8 flex gap-4 border-b border-slate-200 pb-px dark:border-slate-800">
      {adminNavItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "border-b-2 pb-3 text-sm font-medium transition-colors",
              isActive
                ? "border-teal-500 text-teal-600 dark:border-teal-400 dark:text-teal-400"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-300"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
