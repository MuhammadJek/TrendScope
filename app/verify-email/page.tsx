import type { Metadata } from "next";
import { EmailVerificationPanel } from "@/components/auth/auth-forms";
import { AuthCard, AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Verify Email | TrendScope",
  description: "Verify your TrendScope email address.",
};

export default function VerifyEmailPage() {
  return (
    <AuthShell eyebrow="Email verification">
      <AuthCard>
        <EmailVerificationPanel />
      </AuthCard>
    </AuthShell>
  );
}
