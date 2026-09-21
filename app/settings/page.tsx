import { AppFrame } from "@/components/app-frame";
import { ThemePreference, ToggleRow } from "@/components/settings-controls";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export default function SettingsPage() {
  return (
    <AppFrame title="Settings">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-slate-50">Settings</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Mock profile, notifications, data source, and subscription preferences.</p>
        </div>
        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle>Profile settings</CardTitle>
              <CardDescription>Local form controls for the prototype; values are not persisted to a backend.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                Name
                <Input defaultValue="Demo Analyst" />
              </label>
              <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
                <Input defaultValue="analyst@example.com" type="email" />
              </label>
              <Button type="button" className="w-fit">Save mock profile</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent><ThemePreference /></CardContent>
          </Card>
        </div>
        <div className="grid gap-6 xl:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ToggleRow title="Weekly trend digest" description="Mock email summary of category movement." defaultChecked />
              <ToggleRow title="Source freshness alerts" description="Prototype alert for delayed demo feeds." />
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
              <ToggleRow title="Show unavailable fields" description="Keep hidden or inaccessible metrics visible as unavailable." defaultChecked />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>No real billing provider is connected.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <p className="font-semibold text-slate-950 dark:text-slate-50">Prototype plan</p>
                <p className="mt-2 text-sm text-slate-500">Business placeholder / monthly</p>
              </div>
              <Button type="button" className="mt-4 w-full" variant="secondary">Manage mock plan</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppFrame>
  );
}
