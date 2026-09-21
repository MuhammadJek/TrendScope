"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

export function PasswordInput({
  id,
  name,
  placeholder = "Enter password",
  autoComplete,
  error,
}: {
  id: string;
  name: string;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="pr-11 focus:border-indigo-500 focus:ring-indigo-100 dark:focus:ring-indigo-950"
      />
      <button
        type="button"
        className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:hover:bg-slate-900 dark:hover:text-slate-100"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  );
}
