import { AppFrame } from "@/components/app-frame";
import { PricingPlans } from "@/components/pricing-plans";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PricingPage() {
  return (
    <AppFrame title="Pricing">
      <div className="space-y-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-slate-50">Pricing</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">Placeholder packages for validating the TrendScope prototype. No billing integration is implemented.</p>
        </div>
        <PricingPlans />
        <Card>
          <CardHeader>
            <CardTitle>Feature comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="text-slate-500">
                  <tr>
                    <th className="py-3">Capability</th>
                    <th>Free</th>
                    <th>Pro</th>
                    <th>Business</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[
                    ["Local demo data", "Included", "Included", "Included"],
                    ["Advanced filtering", "Limited", "Included", "Included"],
                    ["Authorized API replacement path", "Docs", "Docs", "Planning support"],
                    ["Billing", "Not implemented", "Not implemented", "Not implemented"],
                  ].map((row) => (
                    <tr key={row[0]}>
                      {row.map((cell) => <td key={cell} className="py-4 pr-4">{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppFrame>
  );
}
