import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset password | TrendScope",
  description: "Set a new password for your TrendScope account.",
};

export default async function ResetPasswordPage({ searchParams }: PageProps<"/reset-password">) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : null;

  // No token in URL — show an error
  if (!token) {
    return (
      <AuthLayout
        heading="Invalid reset link"
        description="This password reset link is missing or malformed."
        footer={
          <Link href="/login" className="font-medium text-teal-600 hover:underline dark:text-teal-400">
            Back to sign in
          </Link>
        }
      >
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-rose-100 dark:bg-rose-950">
            <AlertCircle className="h-6 w-6 text-rose-600 dark:text-rose-400" aria-hidden="true" />
          </span>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Please request a new password reset link.
          </p>
          <Button href="/forgot-password" variant="secondary">
            Request reset link
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      heading="Reset your password"
      description="Enter and confirm your new password below."
      footer={
        <Link href="/login" className="font-medium text-teal-600 hover:underline dark:text-teal-400">
          Back to sign in
        </Link>
      }
    >
      <ResetPasswordForm token={token} />
    </AuthLayout>
  );
}

