import type { Metadata } from "next";
import { LogoutConfirmationDialog } from "@/components/auth/auth-forms";
import { AuthCard, AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Logout | TrendScope",
  description: "Confirm signing out of TrendScope.",
};

export default function LogoutPage() {
  return (
    <AuthShell eyebrow="Session management">
      <AuthCard className="max-w-lg">
        <LogoutConfirmationDialog />
      </AuthCard>
    </AuthShell>
  );
}
