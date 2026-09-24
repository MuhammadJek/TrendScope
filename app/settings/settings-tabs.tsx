"use client";

import { ThemePreference, ToggleRow } from "@/components/settings-controls";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs } from "@/components/ui/tabs";
import { ChangePasswordForm } from "@/components/auth/profile-forms";
import type { SessionUser } from "@/lib/auth-definitions";

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "security", label: "Security" },
  { id: "notifications", label: "Notifications" },
  { id: "appearance", label: "Appearance" },
  { id: "subscription", label: "Subscription" },
];

export function SettingsTabs({ user }: { user?: SessionUser }) {
  return (
    <Tabs tabs={TABS} defaultTab="profile">
      {(activeTab) => (
        <>
          {/* Profile tab */}
          {activeTab === "profile" && (
            <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Profile settings</CardTitle>
                  <CardDescription>
                    {user
                      ? "Update your display name and account details."
                      : "Sign in to manage your profile."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Name
                    <Input
                      defaultValue={user?.name ?? "Demo Analyst"}
                      readOnly={!user}
                      disabled={!user}
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email
                    <Input
                      defaultValue={user?.email ?? "analyst@example.com"}
                      type="email"
                      readOnly
                      disabled
                      className="cursor-not-allowed opacity-60"
                    />
                  </label>
                  {user ? (
                    <Button type="button" href="/profile" variant="secondary" className="w-fit">
                      Edit profile
                    </Button>
                  ) : (
                    <Button type="button" href="/login?callbackUrl=/settings" className="w-fit">
                      Sign in to edit
                    </Button>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Data sources</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Preferred default source
                    <Select defaultValue="Digital Marketplace">
                      <option>Digital Marketplace</option>
                      <option>E-Commerce</option>
                      <option>TikTok</option>
                    </Select>
                  </label>
                  <ToggleRow
                    title="Show unavailable fields"
                    description="Keep hidden or inaccessible metrics visible as unavailable."
                    defaultChecked
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Security tab */}
          {activeTab === "security" && (
            <div className="grid gap-6 xl:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Change password</CardTitle>
                  <CardDescription>
                    {user
                      ? "Use a strong, unique password to secure your account."
                      : "Sign in to change your password."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {user ? (
                    <ChangePasswordForm email={user.email} />
                  ) : (
                    <Button href="/login?callbackUrl=/settings" variant="secondary">
                      Sign in to change password
                    </Button>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Sessions</CardTitle>
                  <CardDescription>
                    Active session management requires a real session store in production.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                    <p className="text-sm font-medium text-slate-950 dark:text-slate-50">
                      Current session
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      This device • JWT session • Expires in 30 days
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notifications tab */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ToggleRow title="Weekly trend digest" description="Mock email summary of category movement." defaultChecked />
                <ToggleRow title="Source freshness alerts" description="Prototype alert for delayed demo feeds." />
                <ToggleRow title="Product ranking changes" description="Notify when tracked products change rank." />
                <ToggleRow title="New features" description="Updates about new TrendScope capabilities." defaultChecked />
              </CardContent>
            </Card>
          )}

          {/* Appearance tab */}
          {activeTab === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how TrendScope looks on your device.</CardDescription>
              </CardHeader>
              <CardContent>
                <ThemePreference />
              </CardContent>
            </Card>
          )}

          {/* Subscription tab */}
          {activeTab === "subscription" && (
            <Card>
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>No real billing provider is connected. Using mock data.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-950 dark:text-slate-50">Prototype plan</p>
                      <p className="mt-1 text-sm text-slate-500">Business placeholder • $99/month</p>
                    </div>
                    <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                      Active
                    </span>
                  </div>
                </div>
                <Button type="button" className="w-full" variant="secondary">
                  Manage mock plan
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Tabs>
  );
}

