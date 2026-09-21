"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MethodologyDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
        <Info className="h-4 w-4" aria-hidden="true" />
        Methodology
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="methodology-title">
          <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl dark:bg-slate-950">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="methodology-title" className="text-lg font-semibold text-slate-950 dark:text-slate-50">Ranking methodology</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Demo rankings sort available permitted metrics within the selected platform and category. Cross-platform values are not directly comparable unless a documented normalization model is selected.
                </p>
              </div>
              <button className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-900" onClick={() => setOpen(false)} aria-label="Close methodology">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              Observed means directly obtained from a permitted source. Estimated means calculated from a documented demo method. Unavailable means the field is not accessible or not provided. Demo marks placeholder data for prototype validation.
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
