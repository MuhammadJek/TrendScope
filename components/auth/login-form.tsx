"use client";

import { useActionState, useRef } from "react";
import Link from "next/link";
import { loginAction } from "@/lib/auth-actions";
import { AuthErrorMessage, FieldError } from "@/components/auth/auth-error-message";
import { PasswordInput } from "@/components/auth/password-input";
import { ButtonSpinner } from "@/components/auth/auth-loading-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

type LoginFormProps = {
  callbackUrl?: string;
};

export function LoginForm({ callbackUrl }: LoginFormProps) {
  const [state, action, pending] = useActionState(loginAction, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={action} noValidate className="space-y-5">
      {/* Hidden callback URL */}
      {callbackUrl && (
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
      )}

      {/* Form-level error */}
      {state?.message && !state.success && (
        <AuthErrorMessage message={state.message} />
      )}

      {/* Email */}
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
          aria-describedby={state?.errors?.email ? "email-error" : undefined}
          aria-invalid={!!state?.errors?.email}
          className={state?.errors?.email ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100 dark:focus:ring-rose-950" : ""}
        />
        <FieldError message={state?.errors?.email} id="email-error" />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-xs text-teal-600 hover:text-teal-700 hover:underline dark:text-teal-400 dark:hover:text-teal-300"
          >
            Forgot password?
          </Link>
        </div>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          error={state?.errors?.password?.[0]}
        />
        <FieldError message={state?.errors?.password} id="password-error" />
      </div>

      {/* Remember me */}
      <div className="flex items-center gap-2.5">
        <Checkbox 
          id="remember" 
          name="remember" 
          defaultChecked={state?.values ? (state.values.remember as boolean) : true} 
        />
        <Label htmlFor="remember" className="cursor-pointer font-normal text-slate-600 dark:text-slate-400">
          Remember me for 30 days
        </Label>
      </div>

      {/* Submit */}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? (
          <>
            <ButtonSpinner />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}

