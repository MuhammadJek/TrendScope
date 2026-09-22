import type { ReactNode } from "react";
import Link from "next/link";
import { BarChart3, LineChart, PackageSearch, TrendingUp } from "lucide-react";

type AuthLayoutProps = {
  children: ReactNode;
  heading: string;
  description: string;
  footer?: ReactNode;
};

const brandFeatures = [
  { icon: TrendingUp, text: "Real-time trend monitoring" },
  { icon: BarChart3, text: "Multi-platform analytics" },
  { icon: PackageSearch, text: "Product discovery engine" },
  { icon: LineChart, text: "Market intelligence insights" },
];

export function AuthLayout({ children, heading, description, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 lg:grid lg:grid-cols-2">
      {/* Left — Brand panel (hidden on mobile) */}
      <div className="hidden relative overflow-hidden bg-slate-950 text-white lg:flex lg:flex-col lg:justify-between lg:p-10">
        {/* Abstract background shapes */}
        <div className="absolute inset-0 opacity-20" aria-hidden="true">
          <div className="absolute left-[-10%] top-[-10%] h-[30rem] w-[30rem] rounded-full bg-teal-500 blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[25rem] w-[25rem] rounded-full bg-indigo-600 blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-sm font-bold text-slate-950">
              TS
            </span>
            <span className="text-lg font-semibold">TrendScope</span>
          </Link>
        </div>

        <div className="relative space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-300">
              Market Intelligence Platform
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight">
              Discover what&apos;s trending across digital marketplaces.
            </h2>
          </div>

          <ul className="space-y-4">
            {brandFeatures.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10">
                  <Icon className="h-4 w-4 text-teal-300" aria-hidden="true" />
                </span>
                <span className="text-sm text-slate-300">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative text-xs text-slate-500">
          TrendScope prototype — data is for demonstration only.
        </div>
      </div>

      {/* Right — Auth form panel */}
      <div className="flex flex-col justify-center px-4 py-12 sm:px-8 lg:px-12">
        {/* Mobile logo */}
        <div className="mb-8 flex justify-center lg:hidden">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
              TS
            </span>
            <span className="font-semibold text-slate-950 dark:text-slate-50">TrendScope</span>
          </Link>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-slate-950 dark:text-slate-50">{heading}</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>
          </div>

          {children}

          {footer && (
            <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

