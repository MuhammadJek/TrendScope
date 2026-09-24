"use client";

import { useState } from "react";
import { PricingCard } from "@/components/pricing-card";

const plans = [
  {
    name: "Free",
    monthly: "$0",
    yearly: "$0",
    description: "Untuk eksplorasi dasar dan tim kecil.",
    features: [
      "5 Tracked Keywords", 
      "3 Tracked Products", 
      "1 Competitor",
      "Pembaruan data setiap 3 hari"
    ],
  },
  {
    name: "Pro",
    monthly: "$49",
    yearly: "$39",
    description: "Akses riset tanpa batas untuk profesional.",
    features: [
      "100 Tracked Keywords", 
      "50 Tracked Products", 
      "20 Competitors",
      "Pembaruan data setiap hari"
    ],
    featured: true,
  },
  {
    name: "Business",
    monthly: "$149",
    yearly: "$119",
    description: "Skala perusahaan dengan dukungan prioritas.",
    features: [
      "Tracked Keywords Tanpa Batas", 
      "Tracked Products Tanpa Batas", 
      "API Integration & Shopify Connect",
      "Pembaruan Real-Time"
    ],
  },
];

export function PricingPlans() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <button
            type="button"
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${!annual ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "text-slate-600 dark:text-slate-300"}`}
            onClick={() => setAnnual(false)}
          >
            Monthly
          </button>
          <button
            type="button"
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${annual ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "text-slate-600 dark:text-slate-300"}`}
            onClick={() => setAnnual(true)}
          >
            Yearly
          </button>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <PricingCard key={plan.name} {...plan} price={annual ? plan.yearly : plan.monthly} />
        ))}
      </div>
    </div>
  );
}
