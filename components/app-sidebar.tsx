"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Globe,
  ShoppingBag,
  Sparkles,
  ShoppingCart,
  Tag,
  Share2,
  PlaySquare,
  TrendingUp,
  Code2,
  Layers,
  Box,
  Compass,
  Settings,
  ChevronDown,
  ChevronRight,
  LucideIcon,
} from "lucide-react";
import { UserAvatar } from "@/components/auth/user-avatar";
import { cn } from "@/lib/utils";

interface SubMenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  badgeVariant?: "live" | "soon";
  disabled?: boolean;
}

interface MenuCategory {
  id: string;
  title: string;
  icon: LucideIcon;
  items: SubMenuItem[];
}

const menuCategories: MenuCategory[] = [
  {
    id: "ecommerce-pod",
    title: "Global E-commerce & POD",
    icon: Globe,
    items: [
      {
        href: "/research/amazon",
        label: "Amazon Analytics",
        icon: ShoppingBag,
        badge: "Live",
        badgeVariant: "live",
      },
      {
        href: "/research/etsy",
        label: "Etsy Analytics",
        icon: Sparkles,
        badge: "Live",
        badgeVariant: "live",
      },
      {
        href: "/research/shopee",
        label: "Shopee Analytics",
        icon: ShoppingCart,
        badge: "Soon",
        badgeVariant: "soon",
      },
      {
        href: "/research/ebay",
        label: "eBay Analytics",
        icon: Tag,
        badge: "Soon",
        badgeVariant: "soon",
        disabled: true,
      },
    ],
  },
  {
    id: "social-creator",
    title: "Social Commerce & Creator",
    icon: Share2,
    items: [
      {
        href: "/youtube",
        label: "YouTube Insights",
        icon: PlaySquare,
        badge: "Live",
        badgeVariant: "live",
      },
      {
        href: "/research/tiktok",
        label: "TikTok Shop",
        icon: TrendingUp,
        badge: "Soon",
        badgeVariant: "soon",
        disabled: true,
      },
    ],
  },
  {
    id: "digital-developers",
    title: "Digital Assets & Software",
    icon: Code2,
    items: [
      {
        href: "/research/envato",
        label: "Envato Analytics",
        icon: Layers,
        badge: "Live",
        badgeVariant: "live",
      },
      {
        href: "/research/gumroad",
        label: "Gumroad Analytics",
        icon: Box,
        badge: "Soon",
        badgeVariant: "soon",
        disabled: true,
      },
    ],
  },
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

  // State untuk collapsible accordion: semua kategori terbuka secara default
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "ecommerce-pod": true,
    "social-creator": true,
    "digital-developers": true,
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isDashboardActive = pathname === "/dashboard" || pathname === "/";

  return (
    <aside
      className={cn(
        "hidden border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:block",
        className
      )}
    >
      <div className="sticky top-0 flex h-screen w-72 flex-col p-4">
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-3 rounded-xl px-2 py-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-sm font-bold text-white dark:bg-white dark:text-slate-950 shadow-sm">
            TS
          </span>
          <div>
            <p className="font-semibold text-slate-950 dark:text-slate-50 leading-tight">TrendScope</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Market Intelligence</p>
          </div>
        </Link>

        {/* Scrollable Navigation */}
        <div className="mt-5 flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-thin">
          {/* Main Overview Item */}
          <div>
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition",
                isDashboardActive
                  ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-50"
              )}
            >
              <BarChart3 className="h-4 w-4" aria-hidden="true" />
              <span>Dashboard Overview</span>
            </Link>
          </div>

          {/* 3 Main Categorized Sections with Submenus */}
          {menuCategories.map((category) => {
            const isOpen = openSections[category.id] ?? true;
            const CategoryIcon = category.icon;

            // Check if any sub-item is active
            const hasActiveChild = category.items.some(
              (item) =>
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href))
            );

            return (
              <div key={category.id} className="space-y-1">
                {/* Category Header / Accordion Trigger */}
                <button
                  type="button"
                  onClick={() => toggleSection(category.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider transition select-none",
                    hasActiveChild
                      ? "text-slate-950 dark:text-slate-100"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                    <span>{category.title}</span>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  )}
                </button>

                {/* Submenu Items */}
                {isOpen && (
                  <div className="ml-3.5 space-y-1 border-l border-slate-200 pl-2.5 dark:border-slate-800">
                    {category.items.map((subItem) => {
                      const active =
                        pathname === subItem.href ||
                        (subItem.href !== "/" && pathname.startsWith(subItem.href));
                      const SubIcon = subItem.icon;

                      if (subItem.disabled) {
                        return (
                          <div
                            key={subItem.label}
                            className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 dark:text-slate-600 cursor-not-allowed select-none"
                            title="Segera hadir di update berikutnya"
                          >
                            <div className="flex items-center gap-2.5">
                              <SubIcon className="h-3.5 w-3.5 opacity-60" />
                              <span>{subItem.label}</span>
                            </div>
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                              Soon
                            </span>
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition",
                            active
                              ? "bg-slate-950 font-semibold text-white dark:bg-white dark:text-slate-950 shadow-xs"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-50"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <SubIcon className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{subItem.label}</span>
                          </div>

                          {subItem.badge && (
                            <span
                              className={cn(
                                "rounded px-1.5 py-0.2 text-[10px] font-semibold",
                                subItem.badgeVariant === "live"
                                  ? active
                                    ? "bg-teal-500/20 text-teal-200 dark:bg-teal-500/30 dark:text-teal-800"
                                    : "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/60"
                                  : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                              )}
                            >
                              {subItem.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* General Utility Links */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
            <Link
              href="/pricing"
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs font-medium transition",
                pathname === "/pricing"
                  ? "bg-slate-950 font-semibold text-white dark:bg-white dark:text-slate-950"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-50"
              )}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Pricing Plans</span>
            </Link>
            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs font-medium transition",
                pathname === "/settings"
                  ? "bg-slate-950 font-semibold text-white dark:bg-white dark:text-slate-950"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-50"
              )}
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Settings</span>
            </Link>
          </div>
        </div>

        {/* User footer */}
        <div className="mt-3 shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-900">
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
              <p className="text-xs font-semibold text-slate-950 dark:text-slate-50">Demo Mode</p>
              <p className="mt-0.5 text-[11px] leading-4 text-slate-500 dark:text-slate-400">
                Multi-platform market intelligence & trend analytics.
              </p>
              <Link
                href="/login"
                className="mt-2.5 flex w-full items-center justify-center rounded-lg bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
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
