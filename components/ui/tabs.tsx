"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type TabsProps = {
  tabs: { id: string; label: string }[];
  defaultTab?: string;
  className?: string;
  children: (activeTab: string) => React.ReactNode;
};

export function Tabs({ tabs, defaultTab, className, children }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id ?? "");

  return (
    <div className={className}>
      <div
        role="tablist"
        className="flex gap-1 border-b border-slate-200 dark:border-slate-800"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition",
              active === tab.id
                ? "border-b-2 border-slate-950 text-slate-950 dark:border-white dark:text-white"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="mt-6">
        {children(active)}
      </div>
    </div>
  );
}

