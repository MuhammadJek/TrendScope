"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { superAdminLogin } from "@/lib/super-admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield } from "lucide-react";

export function SuperAdminLoginForm() {
  const router = useRouter();
  const hasSubmitted = useRef(false);
  const [state, action, isPending] = useActionState(superAdminLogin, { error: "" });

  useEffect(() => {
    if (hasSubmitted.current && !isPending && !state?.error) {
      // Login succeeded (no error returned)
      router.push("/dzakiganteng/users");
      router.refresh();
    }
  }, [state, isPending, router]);

  return (
    <form
      action={(formData) => {
        hasSubmitted.current = true;
        action(formData);
      }}
      className="space-y-4"
    >
      {state?.error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Username
        </label>
        <Input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          placeholder="Enter username"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="Enter password"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        <Shield className="mr-2 h-4 w-4" />
        {isPending ? "Authenticating..." : "Access Panel"}
      </Button>
    </form>
  );
}

