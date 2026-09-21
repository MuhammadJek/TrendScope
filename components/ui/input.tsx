import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: ComponentPropsWithoutRef<"input">) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:ring-teal-950",
        className,
      )}
      {...props}
    />
  );
}
