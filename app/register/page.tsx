import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/auth-forms";
import { AuthCard, AuthHeader, AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Register | TrendScope",
  description: "Create a TrendScope account.",
};

export default function RegisterPage() {
  return (
    <AuthShell eyebrow="Workspace onboarding">
      <AuthCard>
        <AuthHeader
          title="Create your account."
          subtitle="Start a trusted product analytics workspace for your team."
        />
        <RegisterForm />
      </AuthCard>
    </AuthShell>
  );
}
