"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signupAction } from "@/lib/auth-actions";
import { AuthErrorMessage, FieldError } from "@/components/auth/auth-error-message";
import { PasswordInput } from "@/components/auth/password-input";
import { PasswordStrength } from "@/components/auth/password-strength";
import { ButtonSpinner } from "@/components/auth/auth-loading-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function RegisterForm() {
  const [state, action, pending] = useActionState(signupAction, undefined);
  const [password, setPassword] = useState("");

  return (
    <form action={action} noValidate className="space-y-5">
      {/* Form-level error */}
      {state?.message && !state.success && (
        <AuthErrorMessage message={state.message} />
      )}

      {/* Full name */}
      <div className="space-y-1.5">
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Alex Johnson"
          defaultValue={state?.values?.name as string | undefined}
          required
          aria-invalid={!!state?.errors?.name}
          className={state?.errors?.name ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100 dark:focus:ring-rose-950" : ""}
        />
        <FieldError message={state?.errors?.name} />
      </div>

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
          aria-invalid={!!state?.errors?.email}
          className={state?.errors?.email ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100 dark:focus:ring-rose-950" : ""}
        />
        <FieldError message={state?.errors?.email} />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
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
        <Label htmlFor="confirmPassword">Confirm password</Label>
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

      {/* Terms */}
      <div className="space-y-1.5">
        <div className="flex items-start gap-2.5">
          <Checkbox
            id="terms"
            name="terms"
            defaultChecked={state?.values?.terms as boolean | undefined}
            aria-invalid={!!state?.errors?.terms}
            className="mt-0.5"
          />
          <Label htmlFor="terms" className="cursor-pointer font-normal leading-relaxed text-slate-600 dark:text-slate-400">
            I agree to the{" "}
            <Link href="/terms" className="text-teal-600 hover:underline dark:text-teal-400">
              terms of service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-teal-600 hover:underline dark:text-teal-400">
              privacy policy
            </Link>
          </Label>
        </div>
        <FieldError message={state?.errors?.terms} />
      </div>

      {/* Submit */}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? (
          <>
            <ButtonSpinner />
            Creating account…
          </>
        ) : (
          "Create account"
        )}
      </Button>
    </form>
  );
}

