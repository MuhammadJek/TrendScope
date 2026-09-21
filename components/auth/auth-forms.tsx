"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, LogOut, Mail, ShieldCheck } from "lucide-react";
import { AuthSubmitButton, SocialPlaceholder } from "@/components/auth/auth-actions";
import { FormField } from "@/components/auth/form-field";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FieldErrors = Record<string, string>;

const wait = () => new Promise((resolve) => setTimeout(resolve, 650));

export function LoginForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(formData: FormData) {
    const nextErrors: FieldErrors = {};
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    if (!email.includes("@")) nextErrors.email = "Enter a valid work email.";
    if (password.length < 8) nextErrors.password = "Password must be at least 8 characters.";

    setErrors(nextErrors);
    setMessage("");
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    await wait();
    setLoading(false);
    setMessage("Demo sign in validated. No authentication request was sent.");
  }

  return (
    <form action={onSubmit} className="space-y-4" noValidate>
      <FormField id="email" label="Email" error={errors.email}>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="focus:border-indigo-500 focus:ring-indigo-100 dark:focus:ring-indigo-950"
        />
      </FormField>
      <FormField id="password" label="Password" error={errors.password}>
        <PasswordInput id="password" name="password" autoComplete="current-password" error={errors.password} />
      </FormField>
      <div className="flex items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
          <input type="checkbox" name="remember" className="h-4 w-4 rounded border-slate-300 accent-indigo-600" />
          Remember me
        </label>
        <Link href="/forgot-password" className="text-sm font-semibold text-indigo-700 hover:text-indigo-800 dark:text-indigo-300">
          Forgot password?
        </Link>
      </div>
      <AuthSubmitButton loading={loading}>Sign in</AuthSubmitButton>
      {message ? <SuccessMessage>{message}</SuccessMessage> : null}
      <SocialPlaceholder />
      <p className="pt-2 text-center text-sm text-slate-600 dark:text-slate-400">
        New to TrendScope?{" "}
        <Link href="/register" className="font-semibold text-indigo-700 hover:text-indigo-800 dark:text-indigo-300">
          Create account
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(formData: FormData) {
    const nextErrors: FieldErrors = {};
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const terms = formData.get("terms");

    if (name.length < 2) nextErrors.name = "Enter your full name.";
    if (!email.includes("@")) nextErrors.email = "Enter a valid work email.";
    if (password.length < 8) nextErrors.password = "Use at least 8 characters.";
    if (password !== confirmPassword) nextErrors.confirmPassword = "Passwords do not match.";
    if (!terms) nextErrors.terms = "Accept the terms to continue.";

    setErrors(nextErrors);
    setMessage("");
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    await wait();
    setLoading(false);
    setMessage("Account details look good. Verification email would be sent in a live build.");
  }

  return (
    <form action={onSubmit} className="space-y-4" noValidate>
      <FormField id="name" label="Full name" error={errors.name}>
        <Input id="name" name="name" placeholder="Alex Morgan" autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} className="focus:border-indigo-500 focus:ring-indigo-100 dark:focus:ring-indigo-950" />
      </FormField>
      <FormField id="email" label="Email" error={errors.email}>
        <Input id="email" name="email" type="email" placeholder="you@company.com" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} className="focus:border-indigo-500 focus:ring-indigo-100 dark:focus:ring-indigo-950" />
      </FormField>
      <FormField id="password" label="Password" error={errors.password}>
        <PasswordInput id="password" name="password" autoComplete="new-password" error={errors.password} />
      </FormField>
      <FormField id="confirmPassword" label="Confirm password" error={errors.confirmPassword}>
        <PasswordInput id="confirmPassword" name="confirmPassword" placeholder="Confirm password" autoComplete="new-password" error={errors.confirmPassword} />
      </FormField>
      <div>
        <label className="flex items-start gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
          <input type="checkbox" name="terms" className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-indigo-600" aria-describedby={errors.terms ? "terms-error" : undefined} />
          <span>I agree to the prototype terms and understand no live billing or source integrations are active.</span>
        </label>
        {errors.terms ? <p id="terms-error" className="mt-1.5 text-sm font-medium text-rose-600 dark:text-rose-400">{errors.terms}</p> : null}
      </div>
      <AuthSubmitButton loading={loading}>Create account</AuthSubmitButton>
      {message ? <SuccessMessage>{message}</SuccessMessage> : null}
      <p className="pt-2 text-center text-sm text-slate-600 dark:text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-indigo-700 hover:text-indigo-800 dark:text-indigo-300">
          Login
        </Link>
      </p>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(formData: FormData) {
    const email = String(formData.get("email") ?? "");
    if (!email.includes("@")) {
      setError("Enter the email associated with your workspace.");
      setSent(false);
      return;
    }

    setError("");
    setLoading(true);
    await wait();
    setLoading(false);
    setSent(true);
  }

  return (
    <form action={onSubmit} className="space-y-4" noValidate>
      <FormField id="email" label="Email" error={error}>
        <Input id="email" name="email" type="email" placeholder="you@company.com" autoComplete="email" aria-invalid={Boolean(error)} aria-describedby={error ? "email-error" : undefined} className="focus:border-indigo-500 focus:ring-indigo-100 dark:focus:ring-indigo-950" />
      </FormField>
      <AuthSubmitButton loading={loading}>Send reset link</AuthSubmitButton>
      {sent ? (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm leading-6 text-indigo-900 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-100">
          If this email belongs to a workspace, a reset link would be sent. This prototype does not send email.
        </div>
      ) : (
        <EmptyHint />
      )}
      <p className="pt-2 text-center text-sm text-slate-600 dark:text-slate-400">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-indigo-700 hover:text-indigo-800 dark:text-indigo-300">
          Back to login
        </Link>
      </p>
    </form>
  );
}

export function ResetPasswordForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(formData: FormData) {
    const nextErrors: FieldErrors = {};
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password.length < 8) nextErrors.password = "Use at least 8 characters.";
    if (password !== confirmPassword) nextErrors.confirmPassword = "Passwords do not match.";

    setErrors(nextErrors);
    setMessage("");
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    await wait();
    setLoading(false);
    setMessage("Password reset validated. No account was changed in this prototype.");
  }

  return (
    <form action={onSubmit} className="space-y-4" noValidate>
      <FormField id="password" label="New password" error={errors.password}>
        <PasswordInput id="password" name="password" autoComplete="new-password" error={errors.password} />
      </FormField>
      <FormField id="confirmPassword" label="Confirm new password" error={errors.confirmPassword}>
        <PasswordInput id="confirmPassword" name="confirmPassword" placeholder="Confirm new password" autoComplete="new-password" error={errors.confirmPassword} />
      </FormField>
      <AuthSubmitButton loading={loading}>Reset password</AuthSubmitButton>
      {message ? <SuccessMessage>{message}</SuccessMessage> : null}
      <p className="pt-2 text-center text-sm text-slate-600 dark:text-slate-400">
        Return to{" "}
        <Link href="/login" className="font-semibold text-indigo-700 hover:text-indigo-800 dark:text-indigo-300">
          login
        </Link>
      </p>
    </form>
  );
}

export function EmailVerificationPanel() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function resend() {
    setLoading(true);
    setMessage("");
    await wait();
    setLoading(false);
    setMessage("Verification email would be resent in a live authentication flow.");
  }

  return (
    <div className="space-y-5 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
        <Mail className="h-7 w-7" aria-hidden="true" />
      </span>
      <div>
        <h1 className="text-2xl font-semibold text-slate-950 dark:text-slate-50">Verify your email.</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
          We sent a verification link to your inbox. Open it to unlock your TrendScope workspace.
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-sm leading-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        No email selected yet. In a live build this screen would receive the pending email from the registration flow.
      </div>
      <Button type="button" className="w-full bg-indigo-600 text-white hover:bg-indigo-700" onClick={resend} disabled={loading}>
        {loading ? "Sending" : "Resend verification email"}
      </Button>
      {message ? <SuccessMessage>{message}</SuccessMessage> : null}
      <Link href="/login" className="inline-flex text-sm font-semibold text-indigo-700 hover:text-indigo-800 dark:text-indigo-300">
        Back to login
      </Link>
    </div>
  );
}

export function LogoutConfirmationDialog() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function confirm() {
    setLoading(true);
    setMessage("");
    await wait();
    setLoading(false);
    setMessage("You would be signed out in a live authentication flow.");
  }

  return (
    <div className="space-y-5 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
        <LogOut className="h-7 w-7" aria-hidden="true" />
      </span>
      <div>
        <h1 className="text-2xl font-semibold text-slate-950 dark:text-slate-50">Sign out of TrendScope?</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
          You can return at any time to keep exploring demo market intelligence.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Button href="/dashboard" variant="secondary">Cancel</Button>
        <Button type="button" className="bg-indigo-600 text-white hover:bg-indigo-700" onClick={confirm} disabled={loading}>
          {loading ? "Signing out" : "Sign out"}
        </Button>
      </div>
      {message ? <SuccessMessage>{message}</SuccessMessage> : null}
    </div>
  );
}

function SuccessMessage({ children }: { children: string }) {
  return (
    <p className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-left text-sm font-medium leading-6 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}

function EmptyHint() {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" aria-hidden="true" />
        <p>Enter your email to preview the reset flow. Empty or invalid emails show accessible validation feedback.</p>
      </div>
    </div>
  );
}
