"use client";

import { useState, useTransition } from "react";
import {
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Database,
  ShieldCheck,
  Server,
  Activity,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { triggerAuthorizedManualSync, SyncRunReport } from "./admin-sync-actions";

interface AdminSyncPanelProps {
  stats: {
    totalKeywords: number;
    totalProducts: number;
    totalSnapshots: number;
    totalOpportunities: number;
    lastSyncTime: Date | null;
  } | null;
  providersStatus: Array<{
    id: string;
    name: string;
    status: "CONNECTED" | "UNCONFIGURED" | "RATE_LIMITED";
    type: string;
    details: string;
  }>;
}

export function AdminSyncPanel({ stats, providersStatus }: AdminSyncPanelProps) {
  const [isPending, startTransition] = useTransition();
  const [report, setReport] = useState<SyncRunReport | null>(null);

  const handleManualSync = () => {
    startTransition(async () => {
      const res = await triggerAuthorizedManualSync();
      setReport(res);
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Operational Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Tracked Keywords</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                {stats?.totalKeywords ?? 0}
              </p>
            </div>
            <div className="rounded-xl bg-slate-100 p-2.5 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Layers className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Products Indexed</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                {stats?.totalProducts ?? 0}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-2.5 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Database className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Daily Snapshots</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                {stats?.totalSnapshots ?? 0}
              </p>
            </div>
            <div className="rounded-xl bg-teal-50 p-2.5 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
              <Activity className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Pipeline Status</p>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Operational
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {stats?.lastSyncTime
                  ? `Last: ${new Date(stats.lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : "Awaiting initial run"}
              </p>
            </div>
            <div className="rounded-xl bg-indigo-50 p-2.5 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Server className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manual Sync Trigger Banner */}
      <Card className="border-teal-200 bg-gradient-to-r from-teal-50/50 to-indigo-50/30 p-5 dark:border-teal-900/60 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              Authorized Market Intelligence Sync
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
              Execute an on-demand batch synchronization across connected e-commerce and social APIs. Rate-limiting safeguards and error boundary retries are automatically applied.
            </p>
          </div>
          <Button
            onClick={handleManualSync}
            disabled={isPending}
            className="gap-2 bg-slate-950 hover:bg-slate-800 text-white dark:bg-teal-600 dark:hover:bg-teal-700 sm:self-center flex-shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
            <span>{isPending ? "Synchronizing Pipeline..." : "Trigger Manual Sync"}</span>
          </Button>
        </div>

        {report && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3.5 text-xs dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-slate-100">
              <span className="flex items-center gap-1.5">
                {report.success ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
                {report.message}
              </span>
              <span className="text-[11px] font-normal text-slate-400">
                Execution time: {report.executionTimeMs}ms
              </span>
            </div>
            {report.errors.length > 0 && (
              <div className="mt-2 space-y-1 text-rose-600 dark:text-rose-400">
                {report.errors.map((e, idx) => (
                  <p key={idx} className="flex items-center gap-1.5 text-[11px]">
                    <AlertCircle className="h-3 w-3 flex-shrink-0" /> {e}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Provider Status Grid */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Connected Data Provider Health
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {providersStatus.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">{p.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{p.type}</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{p.details}</p>
              </div>
              <Badge tone={p.status === "CONNECTED" ? "teal" : "slate"}>
                {p.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
