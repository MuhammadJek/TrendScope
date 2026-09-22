import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot password | TrendScope",
  description: "Reset your TrendScope account password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      heading="Forgot your password?"
      description="Enter your email and follow the instructions to reset your password."
      footer={
        <span>
          Remembered it?{" "}
          <Link
            href="/login"
            className="font-medium text-teal-600 hover:underline dark:text-teal-400"
          >
            Back to sign in
          </Link>
        </span>
      }
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}

