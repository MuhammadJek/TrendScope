import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/auth-forms";
import { AuthCard, AuthHeader, AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Login | TrendScope",
  description: "Sign in to TrendScope market intelligence.",
};

export default function LoginPage() {
  return (
    <AuthShell eyebrow="Secure analytics access">
      <AuthCard>
        <AuthHeader
          title="Welcome back."
          subtitle="Sign in to continue exploring market intelligence."
        />
        <LoginForm />
      </AuthCard>
    </AuthShell>
  );
}
