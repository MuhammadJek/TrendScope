import { Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function DemoDataBanner() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <Database className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <p>
          <strong>Demo data only.</strong> Values are fictional or authorized sample records. Live sales, revenue, TikTok views, and competitor statistics are not implemented.
        </p>
      </div>
      <Badge tone="amber">Demo Data</Badge>
    </div>
  );
}
