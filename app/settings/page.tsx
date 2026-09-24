import { auth } from "@/auth";
import { AppFrame } from "@/components/app-frame";
import { EmailVerificationNotice } from "@/components/auth/email-verification-notice";
import type { SessionUser } from "@/lib/auth-definitions";
import type { Metadata } from "next";
import { SettingsTabs } from "./settings-tabs";

export const metadata: Metadata = {
  title: "Settings | TrendScope",
  description: "Manage your TrendScope settings and preferences.",
};

export default async function SettingsPage() {
  const session = await auth();
  const user = session?.user as SessionUser | undefined;

  return (
    <AppFrame title="Settings">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-slate-50">Settings</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Manage your profile, security, notifications, and subscription preferences.
          </p>
        </div>

        {user && !user.emailVerified && (
          <EmailVerificationNotice email={user.email} />
        )}

        <SettingsTabs user={user} />
      </div>
    </AppFrame>
  );
}
