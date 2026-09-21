"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemePreference() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <div>
        <p className="font-semibold text-slate-950 dark:text-slate-50">Theme preference</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Stored locally for this prototype session.</p>
      </div>
      <Button type="button" variant="secondary" onClick={() => setDark((value) => !value)}>
        {dark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
        {dark ? "Light" : "Dark"}
      </Button>
    </div>
  );
}

export function ToggleRow({ title, description, defaultChecked = false }: { title: string; description: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <span>
        <span className="block font-semibold text-slate-950 dark:text-slate-50">{title}</span>
        <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">{description}</span>
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => setChecked(event.target.checked)} className="h-5 w-5 accent-teal-600" />
    </label>
  );
}
