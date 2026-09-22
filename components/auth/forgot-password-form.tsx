"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { forgotPasswordAction } from "@/lib/auth-actions";
import { AuthErrorMessage, FieldError } from "@/components/auth/auth-error-message";
import { ButtonSpinner } from "@/components/auth/auth-loading-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(forgotPasswordAction, undefined);

  // Success state — show generic confirmation
  if (state?.success) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-teal-100 dark:bg-teal-950">
          <CheckCircle2 className="h-6 w-6 text-teal-600 dark:text-teal-400" aria-hidden="true" />
        </span>
        <div>
          <p className="font-semibold text-slate-950 dark:text-slate-50">Check your inbox</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {state.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="space-y-5">
      {state?.message && !state.success && (
        <AuthErrorMessage message={state.message} />
      )}

      <div className="space-y-1.5">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          defaultValue={state?.values?.email as string | undefined}
          required
          aria-invalid={!!state?.errors?.email}
          className={state?.errors?.email ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100 dark:focus:ring-rose-950" : ""}
        />
        <FieldError message={state?.errors?.email} />
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? (
          <>
            <ButtonSpinner />
            Sending…
          </>
        ) : (
          "Send reset link"
        )}
      </Button>
    </form>
  );
}

