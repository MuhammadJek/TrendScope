import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  tone?: "slate" | "teal" | "amber" | "rose" | "indigo";
};

const tones = {
  slate: "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300",
  teal: "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-300",
  amber: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  rose: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300",
  indigo: "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300",
};

export function Badge({ className, tone = "slate", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
