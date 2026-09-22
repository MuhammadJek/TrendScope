import { Loader2 } from "lucide-react";

type AuthLoadingStateProps = {
  text?: string;
};

export function AuthLoadingState({ text = "Please wait…" }: AuthLoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16" aria-live="polite" aria-busy="true">
      <Loader2 className="h-8 w-8 animate-spin text-teal-500" aria-hidden="true" />
      <p className="text-sm text-slate-500 dark:text-slate-400">{text}</p>
    </div>
  );
}

export function ButtonSpinner() {
  return <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />;
}

