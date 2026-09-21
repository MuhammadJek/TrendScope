import { AlertTriangle } from "lucide-react";

export function ErrorState({ message = "The requested demo record could not be loaded." }: { message?: string }) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-100">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        <p className="text-sm font-semibold">{message}</p>
      </div>
    </div>
  );
}
