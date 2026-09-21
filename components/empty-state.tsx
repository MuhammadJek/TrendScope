import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({ title, description, actionHref }: { title: string; description: string; actionHref?: string }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-950">
      <SearchX className="h-10 w-10 text-slate-400" aria-hidden="true" />
      <h2 className="mt-4 text-lg font-semibold text-slate-950 dark:text-slate-50">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
      {actionHref ? (
        <Button className="mt-5" href={actionHref} variant="secondary">
          Reset filters
        </Button>
      ) : null}
    </div>
  );
}
