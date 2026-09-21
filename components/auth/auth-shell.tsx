import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, BarChart3, LineChart, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function AuthShell({
  children,
  eyebrow,
}: {
  children: ReactNode;
  eyebrow: string;
}) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <div className="grid min-h-screen lg:grid-cols-[1.02fr_0.98fr]">
        <section className="relative hidden overflow-hidden bg-slate-950 text-white lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(79,70,229,0.28),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(14,165,233,0.22),transparent_34%)]" />
          <div className="relative flex h-full flex-col justify-between p-10">
            <Link href="/" className="flex w-fit items-center gap-3">
              <BrandMark />
              <span className="font-semibold">TrendScope</span>
            </Link>
            <div className="max-w-xl">
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-semibold text-indigo-100">
                {eyebrow}
              </span>
              <h1 className="mt-6 text-5xl font-semibold leading-tight">
                Secure access to market intelligence that your team can trust.
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                Explore cross-platform product signals with transparent source labels, demo-safe metrics, and a calm analytics workspace.
              </p>
            </div>
            <div className="grid gap-3 rounded-xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur">
              <InsightRow icon={BarChart3} label="Demo trend coverage" value="12 tracked records" />
              <InsightRow icon={LineChart} label="Source freshness" value="3 monitored feeds" />
              <InsightRow icon={ShieldCheck} label="Data policy" value="Observed, estimated, unavailable" />
            </div>
          </div>
        </section>
        <section className="flex min-h-screen flex-col">
          <header className="flex items-center justify-between px-4 py-5 sm:px-6 lg:px-10">
            <Link href="/" className="flex items-center gap-3 lg:hidden">
              <BrandMark dark />
              <span className="font-semibold">TrendScope</span>
            </Link>
            <Link href="/" className="ml-auto inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to site
            </Link>
          </header>
          <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}

export function AuthCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AuthHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-7">
      <div className="mb-6 hidden items-center gap-3 lg:flex">
        <BrandMark dark />
        <div>
          <p className="font-semibold text-slate-950 dark:text-slate-50">TrendScope</p>
          <p className="text-xs text-slate-500">Market intelligence SaaS</p>
        </div>
      </div>
      <h1 className="text-2xl font-semibold text-slate-950 dark:text-slate-50">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{subtitle}</p>
    </div>
  );
}

function BrandMark({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={cn(
        "grid h-10 w-10 place-items-center rounded-xl text-sm font-bold",
        dark ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "bg-white text-slate-950",
      )}
    >
      TS
    </span>
  );
}

function InsightRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BarChart3;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-white/10 p-3">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-indigo-100">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="text-sm text-slate-300">{label}</span>
      </div>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}
