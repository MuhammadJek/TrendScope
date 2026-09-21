import { Clock3 } from "lucide-react";
import { getRelativeFreshness } from "@/lib/utils";

export function DataFreshnessIndicator({ capturedAt }: { capturedAt: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
      <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
      {getRelativeFreshness(capturedAt)}
    </span>
  );
}
