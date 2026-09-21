import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AuthSubmitButton({
  loading,
  children,
}: {
  loading: boolean;
  children: string;
}) {
  return (
    <Button
      type="submit"
      className="w-full bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:outline-indigo-500"
      disabled={loading}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      {loading ? "Please wait" : children}
    </Button>
  );
}

export function SocialPlaceholder() {
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-950">
            Optional provider sign-in
          </span>
        </div>
      </div>
      <button
        type="button"
        disabled
        className="mt-4 flex h-11 w-full cursor-not-allowed items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500"
      >
        SSO placeholder, not connected
      </button>
    </div>
  );
}
