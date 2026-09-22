"use client";

import { useTransition } from "react";
import { MailCheck, RefreshCw } from "lucide-react";
import { resendVerificationAction } from "@/lib/auth-actions";
import { ButtonSpinner } from "@/components/auth/auth-loading-state";

type EmailVerificationNoticeProps = {
  email: string;
};

export function EmailVerificationNotice({ email }: EmailVerificationNoticeProps) {
  const [pending, startTransition] = useTransition();

  function handleResend() {
    startTransition(async () => {
      await resendVerificationAction(email);
    });
  }

  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/50 dark:bg-amber-950/20">
      <MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
          Please verify your email
        </p>
        <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
          We sent a verification link to <strong>{email}</strong>. Check your inbox and click the link to verify your account.
        </p>
        <button
          type="button"
          onClick={handleResend}
          disabled={pending}
          className="mt-2 flex items-center gap-1.5 text-xs font-medium text-amber-700 hover:underline disabled:opacity-50 dark:text-amber-400"
        >
          {pending ? (
            <>
              <ButtonSpinner />
              Sending…
            </>
          ) : (
            <>
              <RefreshCw className="h-3 w-3" aria-hidden="true" />
              Resend verification email
            </>
          )}
        </button>
      </div>
    </div>
  );
}

