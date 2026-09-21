import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

export function FormField({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-sm font-medium text-rose-600 dark:text-rose-400">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
