import { redirect } from "next/navigation";
import { isSuperAdmin, superAdminLogout } from "@/lib/super-admin-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Link2, LogOut, Plug, Shield } from "lucide-react";
import { AdminNav } from "@/components/admin-nav";
import { IntegrationCards } from "./integration-cards";

const INTEGRATIONS = [
  {
    id: "GOOGLE_ADS",
    name: "Google Ads API",
    description: "Fetch keyword search volume, competition, and CPC metrics.",
    status: "disconnected",
    icon: "🔍",
  },
  {
    id: "DATAFORSEO_TRENDS",
    name: "DataForSEO Trends",
    description: "Connect to fetch live trend histories from Google Trends.",
    status: "disconnected",
    icon: "📈",
  },
  {
    id: "ENVATO",
    name: "Envato API",
    description: "Search digital products and themes across Envato marketplaces.",
    status: "disconnected",
    icon: "🍃",
  },
  {
    id: "SHOPIFY",
    name: "Shopify",
    description: "Connect to fetch product data from Shopify stores.",
    status: "disconnected",
    icon: "🛍️",
  },
];

export default async function SuperAdminIntegrationsPage() {
  const authed = await isSuperAdmin();
  if (!authed) redirect("/dzakiganteng");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
                Super Admin Dashboard
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Manage users and platform integrations.
              </p>
            </div>
          </div>
          <form action={async () => { "use server"; await superAdminLogout(); redirect("/dzakiganteng"); }}>
            <Button variant="ghost" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>

        <div className="mt-8">
          <AdminNav />

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">API Integrations</h2>
            <Button>
              <Plug className="mr-2 h-4 w-4" />
              Add Custom Webhook
            </Button>
          </div>

          <IntegrationCards initialIntegrations={INTEGRATIONS} />
        </div>
      </div>
    </div>
  );
}

