import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function Checkbox({ className, ...props }: ComponentPropsWithoutRef<"input">) {
  return (
    <input
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded border border-slate-300 bg-white text-slate-950 shadow-sm",
        "checked:bg-slate-950 checked:border-slate-950",
        "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2",
        "dark:border-slate-700 dark:bg-slate-950 dark:checked:bg-white dark:checked:border-white",
        "cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

