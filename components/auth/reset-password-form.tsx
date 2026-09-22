"use client";

import { useActionState, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { resetPasswordAction } from "@/lib/auth-actions";
import { AuthErrorMessage, FieldError } from "@/components/auth/auth-error-message";
import { PasswordInput } from "@/components/auth/password-input";
import { PasswordStrength } from "@/components/auth/password-strength";
import { ButtonSpinner } from "@/components/auth/auth-loading-state";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [state, action, pending] = useActionState(resetPasswordAction, undefined);
  const [password, setPassword] = useState("");

  if (state?.success) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-teal-100 dark:bg-teal-950">
          <CheckCircle2 className="h-6 w-6 text-teal-600 dark:text-teal-400" aria-hidden="true" />
        </span>
        <div>
          <p className="font-semibold text-slate-950 dark:text-slate-50">Password reset</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Your password has been updated. You can now sign in with your new password.
          </p>
        </div>
        <Button href="/login" variant="secondary" className="mt-2">
          Go to sign in
        </Button>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="space-y-5">
      {/* Hidden token */}
      <input type="hidden" name="token" value={token} />

      {/* Form-level error */}
      {state?.message && !state.success && (
        <div className="space-y-3">
          <AuthErrorMessage message={state.message} />
          <Button href="/forgot-password" variant="secondary" size="sm" className="w-full">
            Request a new reset link
          </Button>
        </div>
      )}

      {!state?.message && (
        <>
          {/* New password */}
          <div className="space-y-1.5">
            <Label htmlFor="password">New password</Label>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              placeholder="••••••••"
              required
              onChange={(e) => setPassword(e.target.value)}
              error={state?.errors?.password?.[0]}
            />
            <PasswordStrength password={password} />
            <FieldError message={state?.errors?.password} />
          </div>

          {/* Confirm password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="••••••••"
              required
              error={state?.errors?.confirmPassword?.[0]}
            />
            <FieldError message={state?.errors?.confirmPassword} />
          </div>

          {/* Submit */}
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? (
              <>
                <ButtonSpinner />
                Updating password…
              </>
            ) : (
              "Reset password"
            )}
          </Button>
        </>
      )}

      {/* Back link */}
      <div className="text-center">
        <Link
          href="/login"
          className="text-sm text-slate-500 hover:text-slate-700 hover:underline dark:text-slate-400 dark:hover:text-slate-200"
        >
          Back to sign in
        </Link>
      </div>
    </form>
  );
}

