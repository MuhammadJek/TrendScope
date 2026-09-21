import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/auth-forms";
import { AuthCard, AuthHeader, AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Forgot Password | TrendScope",
  description: "Request a TrendScope password reset link.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell eyebrow="Account recovery">
      <AuthCard>
        <AuthHeader
          title="Reset your password."
          subtitle="Enter your workspace email and we will show the reset-link flow."
        />
        <ForgotPasswordForm />
      </AuthCard>
    </AuthShell>
  );
}
