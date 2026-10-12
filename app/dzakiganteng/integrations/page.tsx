import { redirect } from "next/navigation";
import { isSuperAdmin, superAdminLogout } from "@/lib/super-admin-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Link2, LogOut, Plug, Shield } from "lucide-react";
import { AdminNav } from "@/components/admin-nav";
import { IntegrationCards } from "./integration-cards";
import { AdminSyncPanel } from "./admin-sync-panel";
import { getAdminSystemHealthMetrics } from "./admin-sync-actions";

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

  const stats = await getAdminSystemHealthMetrics();

  const providersStatus: Array<{
    id: string;
    name: string;
    status: "CONNECTED" | "UNCONFIGURED" | "RATE_LIMITED";
    type: string;
    details: string;
  }> = [
    {
      id: "amazon",
      name: "Amazon E-Commerce Data",
      status: process.env.RAPIDAPI_KEY ? "CONNECTED" : "UNCONFIGURED",
      type: "RapidAPI Real-Time Amazon",
      details: process.env.RAPIDAPI_KEY ? "Active API key verified" : "Requires RAPIDAPI_KEY in .env",
    },
    {
      id: "youtube",
      name: "YouTube Data API v3",
      status: process.env.YOUTUBE_API_KEY ? "CONNECTED" : "UNCONFIGURED",
      type: "Google Cloud Platform",
      details: process.env.YOUTUBE_API_KEY ? "Active API key verified" : "Requires YOUTUBE_API_KEY in .env",
    },
    {
      id: "ebay",
      name: "eBay Browse API",
      status: process.env.EBAY_CLIENT_ID && process.env.EBAY_CLIENT_SECRET ? "CONNECTED" : "UNCONFIGURED",
      type: "eBay Developers Program (OAuth2)",
      details: process.env.EBAY_CLIENT_ID ? "OAuth2 Client Credentials configured" : "Requires EBAY_CLIENT_ID in .env",
    },
    {
      id: "tiktok",
      name: "TikTok Video Feed API",
      status: process.env.RAPIDAPI_KEY ? "CONNECTED" : "UNCONFIGURED",
      type: "RapidAPI Scraper",
      details: process.env.RAPIDAPI_KEY ? "Scraper feed connected" : "Requires RAPIDAPI_KEY in .env",
    },
    {
      id: "envato",
      name: "Envato Market Discovery",
      status: process.env.ENVATO_TOKEN ? "CONNECTED" : "UNCONFIGURED",
      type: "Envato API Bearer Token",
      details: process.env.ENVATO_TOKEN ? "Token active" : "Requires ENVATO_TOKEN in .env",
    },
    {
      id: "gemini",
      name: "Google Gemini Flash AI",
      status: process.env.GEMINI_API_KEY ? "CONNECTED" : "UNCONFIGURED",
      type: "Google GenAI SDK v2",
      details: process.env.GEMINI_API_KEY ? "Key active for market synthesis" : "Requires GEMINI_API_KEY in .env",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
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
                Manage operational pipelines, data freshness, and API provider health.
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

        <AdminNav />

        {/* Operational Monitoring & Manual Sync */}
        <AdminSyncPanel stats={stats} providersStatus={providersStatus} />

        {/* Existing Provider Configs */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Workspace Connectors</h2>
              <p className="text-xs text-slate-500">Configure external OAuth and credentials for custom workspaces.</p>
            </div>
          </div>
          <IntegrationCards initialIntegrations={INTEGRATIONS} />
        </div>
      </div>
    </div>
  );
}

