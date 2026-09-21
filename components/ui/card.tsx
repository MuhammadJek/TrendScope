import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("space-y-1.5 p-5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentPropsWithoutRef<"h3">) {
  return <h3 className={cn("text-base font-semibold text-slate-950 dark:text-slate-50", className)} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentPropsWithoutRef<"p">) {
  return <p className={cn("text-sm leading-6 text-slate-600 dark:text-slate-400", className)} {...props} />;
}

export function CardContent({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("p-5 pt-0", className)} {...props} />;
}
