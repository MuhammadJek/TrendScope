import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function KpiCard({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: LucideIcon }) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-slate-50">{value}</p>
          <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">{detail}</p>
        </div>
        <span className="rounded-xl bg-teal-50 p-3 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </CardContent>
    </Card>
  );
}
