export function LoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[0, 1, 2].map((item) => (
        <div key={item} className="h-36 animate-pulse rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900" />
      ))}
    </div>
  );
}
