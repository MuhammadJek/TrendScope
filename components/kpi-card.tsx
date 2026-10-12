import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface KpiCardProps {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  comparisonPeriod?: string;
  lastSyncTime?: string;
  dataSource?: string;
  dataCoverage?: "OBSERVED" | "ESTIMATED" | "UNAVAILABLE" | "FIXTURE";
  trendDelta?: string;
  trendDirection?: "up" | "down" | "neutral";
}

export function KpiCard({
  label,
  value,
  detail,
  icon: Icon,
  comparisonPeriod,
  lastSyncTime,
  dataSource,
  dataCoverage,
  trendDelta,
  trendDirection,
}: KpiCardProps) {
  const getBadgeStyle = (coverage?: string) => {
    switch (coverage) {
      case "OBSERVED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800";
      case "ESTIMATED":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800";
      case "UNAVAILABLE":
        return "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800";
      case "FIXTURE":
      default:
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800";
    }
  };

  return (
    <Card className="relative overflow-hidden border-slate-200/80 bg-white transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
      <CardContent className="flex flex-col justify-between gap-4 p-5 h-full">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                {label}
              </p>
              {dataCoverage && (
                <span
                  className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${getBadgeStyle(
                    dataCoverage
                  )}`}
                >
                  {dataCoverage}
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50 sm:text-3xl">
                {value}
              </span>
              {trendDelta && (
                <span
                  className={`text-xs font-semibold ${
                    trendDirection === "up"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : trendDirection === "down"
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {trendDelta}
                </span>
              )}
            </div>
          </div>
          <span className="flex-shrink-0 rounded-xl bg-teal-50 p-2.5 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>

        <div className="space-y-1.5 border-t border-slate-100 pt-3 text-xs dark:border-slate-900">
          <p className="font-medium text-slate-600 dark:text-slate-400">
            {detail}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 dark:text-slate-400">
            {dataSource && (
              <span className="truncate">
                Source: <strong className="font-medium text-slate-700 dark:text-slate-300">{dataSource}</strong>
              </span>
            )}
            {lastSyncTime && (
              <span className="text-slate-600 dark:text-slate-400">
                {lastSyncTime}
              </span>
            )}
          </div>
          {comparisonPeriod && (
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Period: {comparisonPeriod}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
