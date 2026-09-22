"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, LayoutDashboard, LogOut, Settings, User, CreditCard } from "lucide-react";
import { logoutAction } from "@/lib/auth-actions";
import { UserAvatar } from "@/components/auth/user-avatar";
import { ConfirmLogoutDialog } from "@/components/auth/confirm-logout-dialog";
import { cn } from "@/lib/utils";

type UserDropdownProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

const menuItems = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/subscription", label: "Subscription", icon: CreditCard },
];

export function UserDropdown({ user }: UserDropdownProps) {
  const [open, setOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logoutAction();
    } catch {
      setLoggingOut(false);
      setShowLogoutDialog(false);
    }
  }

  return (
    <>
      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={open}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
        >
          <UserAvatar name={user.name} image={user.image} size="sm" />
          <span className="hidden max-w-[10rem] truncate text-sm font-medium text-slate-700 dark:text-slate-300 sm:block">
            {user.name ?? user.email}
          </span>
          <ChevronDown
            className={cn("h-4 w-4 text-slate-400 transition-transform", open && "rotate-180")}
            aria-hidden="true"
          />
        </button>

        {open && (
          <div
            role="menu"
            className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950"
          >
            {/* User info */}
            <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
              <p className="truncate text-sm font-semibold text-slate-950 dark:text-slate-50">
                {user.name ?? "Account"}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>

            {/* Menu items */}
            <div className="p-1">
              {menuItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                >
                  <Icon className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  {label}
                </Link>
              ))}
            </div>

            {/* Logout */}
            <div className="border-t border-slate-100 p-1 dark:border-slate-800">
              <button
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  setShowLogoutDialog(true);
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmLogoutDialog
        open={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogout}
        loading={loggingOut}
      />
    </>
  );
}

