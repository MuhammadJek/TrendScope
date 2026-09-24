"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Link2, Settings } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { saveApiConnectionAction, disconnectApiAction } from "./actions";

export function IntegrationCards({ initialIntegrations }: { initialIntegrations: any[] }) {
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [activeIntegration, setActiveIntegration] = useState<any | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleConnect = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await saveApiConnectionAction(activeIntegration.id, activeIntegration.name, formData);
      if (res.success) {
        setIntegrations(prev => prev.map(int => 
          int.id === activeIntegration.id 
            ? { ...int, status: "connected" } 
            : int
        ));
        setActiveIntegration(null);
      }
    });
  };

  const handleDisconnect = () => {
    if (confirm("Are you sure you want to disconnect this API?")) {
      startTransition(async () => {
        await disconnectApiAction(activeIntegration.id);
        setIntegrations(prev => prev.map(int => 
          int.id === activeIntegration.id 
            ? { ...int, status: "disconnected" } 
            : int
        ));
        setActiveIntegration(null);
      });
    }
  };

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <Card key={integration.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-xl dark:bg-slate-800">
                  {integration.icon}
                </div>
                {integration.status === "connected" ? (
                  <Badge tone="teal">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Connected
                  </Badge>
                ) : (
                  <Badge tone="slate">Not connected</Badge>
                )}
              </div>
              <CardTitle className="mt-4">{integration.name}</CardTitle>
              <CardDescription className="line-clamp-2">{integration.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end">
              <div className="pt-4 mt-auto border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant={integration.status === "connected" ? "secondary" : "default"}
                  className="w-full"
                  onClick={() => setActiveIntegration(integration)}
                >
                  {integration.status === "connected" ? (
                    <><Settings className="mr-2 h-4 w-4" /> Configure</>
                  ) : (
                    <><Link2 className="mr-2 h-4 w-4" /> Connect</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={!!activeIntegration}
        onClose={() => setActiveIntegration(null)}
        title={`Configure ${activeIntegration?.name}`}
        description="Enter your API credentials to connect this provider."
      >
        {activeIntegration && (
          <form onSubmit={handleConnect} className="space-y-4">
            
            {activeIntegration.id === "GOOGLE_ADS" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="developerToken">Developer Token</Label>
                  <Input id="developerToken" name="developerToken" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientId">Client ID</Label>
                  <Input id="clientId" name="clientId" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientSecret">Client Secret</Label>
                  <Input id="clientSecret" name="clientSecret" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="refreshToken">Refresh Token</Label>
                  <Input id="refreshToken" name="refreshToken" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerId">Customer ID</Label>
                  <Input id="customerId" name="customerId" required placeholder="xxx-xxx-xxxx" />
                </div>
              </>
            )}

            {activeIntegration.id === "DATAFORSEO_TRENDS" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="login">DataForSEO Login</Label>
                  <Input id="login" name="login" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">DataForSEO Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
              </>
            )}

            {activeIntegration.id === "ENVATO" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="personalToken">Personal Token</Label>
                  <Input id="personalToken" name="personalToken" type="password" required />
                </div>
              </>
            )}

            {activeIntegration.id === "SHOPIFY" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="shopDomain">Shop Domain</Label>
                  <Input id="shopDomain" name="shopDomain" placeholder="mystore.myshopify.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminToken">Admin API Access Token</Label>
                  <Input id="adminToken" name="adminToken" type="password" required />
                </div>
              </>
            )}

            <div className="pt-4 flex justify-between">
              {activeIntegration.status === "connected" ? (
                <Button type="button" variant="default" onClick={handleDisconnect} disabled={isPending}>
                  Disconnect
                </Button>
              ) : <div></div>}
              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={() => setActiveIntegration(null)} disabled={isPending}>Cancel</Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Save Connection"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </Dialog>
    </>
  );
}

