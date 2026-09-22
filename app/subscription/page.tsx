import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppFrame } from "@/components/app-frame";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CreditCard } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscription | TrendScope",
  description: "Manage your TrendScope subscription and billing.",
};

const mockPlans = [
  { name: "Free", price: "$0", description: "For exploration", features: ["5 product searches/day", "Basic dashboard", "Public metrics only"] },
  { name: "Pro", price: "$29", description: "For analysts", features: ["Unlimited searches", "Full dashboard", "All platform data", "Export CSV"], current: false },
  { name: "Business", price: "$99", description: "For teams", features: ["Everything in Pro", "Team accounts", "API access", "Priority support"], current: true },
];

export default async function SubscriptionPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/subscription");

  return (
    <AppFrame title="Subscription">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-slate-50">Subscription</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Manage your plan and billing. No real payment provider is connected — this is a prototype.
          </p>
        </div>

        {/* Current plan */}
        <Card className="border-teal-200 dark:border-teal-900/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <CardTitle>Current plan: Business</CardTitle>
            </div>
            <CardDescription>
              Prototype placeholder · \$99/month · Renews on October 21, 2026
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Plans */}
        <div className="grid gap-4 md:grid-cols-3">
          {mockPlans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.current ? "border-teal-500 dark:border-teal-700" : ""}
            >
              <CardHeader>
                {plan.current && (
                  <span className="mb-1 inline-flex w-fit items-center gap-1 rounded-full bg-teal-100 px-2 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                    Current plan
                  </span>
                )}
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-1">
                  <span className="text-2xl font-bold text-slate-950 dark:text-slate-50">{plan.price}</span>
                  <span className="text-sm text-slate-500">/month</span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.current ? "secondary" : "default"}
                  disabled={plan.current}
                  className="w-full"
                >
                  {plan.current ? "Current plan" : `Upgrade to ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-600">
          * Billing is a prototype placeholder. No charges will be made.
        </p>
      </div>
    </AppFrame>
  );
}

