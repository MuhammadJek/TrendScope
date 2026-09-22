import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppFrame } from "@/components/app-frame";
import { UserAvatar } from "@/components/auth/user-avatar";
import { EmailVerificationNotice } from "@/components/auth/email-verification-notice";
import { EditProfileForm, ChangePasswordForm, DeleteAccountSection } from "@/components/auth/profile-forms";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays, CheckCircle2, Mail, Shield } from "lucide-react";
import type { Metadata } from "next";
import type { SessionUser } from "@/lib/auth-definitions";

export const metadata: Metadata = {
  title: "Profile | TrendScope",
  description: "Manage your TrendScope profile and account settings.",
};

export default async function ProfilePage() {
  const session = await auth();

  // Middleware should handle this, but double-check server-side
  if (!session?.user) redirect("/login?callbackUrl=/profile");

  const user = session.user as SessionUser;

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <AppFrame title="Profile">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-slate-50">Profile</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Manage your personal information and account security.
          </p>
        </div>

        {/* Email verification notice */}
        {!user.emailVerified && (
          <EmailVerificationNotice email={user.email!} />
        )}

        {/* Profile overview card */}
        <Card>
          <CardContent className="pt-5">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <UserAvatar name={user.name} image={user.image} size="lg" />
              <div className="space-y-1.5">
                <h2 className="text-xl font-semibold text-slate-950 dark:text-slate-50">
                  {user.name ?? "Anonymous"}
                </h2>
                <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{user.email}</span>
                </div>
                {joinedDate && (
                  <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                    <CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>Joined {joinedDate}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-sm">
                  {user.emailVerified ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
                      <span className="text-teal-600 dark:text-teal-400">Email verified</span>
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 text-amber-500" aria-hidden="true" />
                      <span className="text-amber-600 dark:text-amber-400">Email not verified</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit profile */}
        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Edit profile</CardTitle>
              <CardDescription>Update your display name.</CardDescription>
            </CardHeader>
            <CardContent>
              <EditProfileForm user={user} />
            </CardContent>
          </Card>

          {/* Change password */}
          <Card>
            <CardHeader>
              <CardTitle>Change password</CardTitle>
              <CardDescription>Use a strong password to protect your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm email={user.email!} />
            </CardContent>
          </Card>
        </div>

        {/* Danger zone */}
        <DeleteAccountSection email={user.email!} />
      </div>
    </AppFrame>
  );
}

