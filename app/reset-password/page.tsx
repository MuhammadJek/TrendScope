import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/auth-forms";
import { AuthCard, AuthHeader, AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Reset Password | TrendScope",
  description: "Set a new TrendScope password.",
};

export default function ResetPasswordPage() {
  return (
    <AuthShell eyebrow="Secure password reset">
      <AuthCard>
        <AuthHeader
          title="Choose a new password."
          subtitle="Use a strong password to protect your market intelligence workspace."
        />
        <ResetPasswordForm />
      </AuthCard>
    </AuthShell>
  );
}
