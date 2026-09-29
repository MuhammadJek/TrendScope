"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<ComponentPropsWithoutRef<"input">, "type"> & {
  error?: string;
};

export function PasswordInput({ className, error, id, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        autoComplete={props.autoComplete ?? "current-password"}
        aria-invalid={!!error}
        aria-describedby={error && id ? `${id}-error` : undefined}
        className={cn(
          "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 pr-11 text-sm text-slate-950 shadow-sm outline-none transition",
          "placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100",
          "dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:ring-teal-950",
          error && "border-rose-400 focus:border-rose-500 focus:ring-rose-100 dark:focus:ring-rose-950",
          className
        )}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        onMouseDown={(e) => {
          // Prevent losing focus on the input field
          e.preventDefault();
          setVisible((v) => !v);
        }}
        className="absolute inset-y-0 right-0 flex items-center justify-center w-11 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none"
        aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
      >
        {visible ? (
          <EyeOff className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Eye className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
