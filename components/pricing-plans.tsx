"use client";

import { PricingCard } from "@/components/pricing-card";

const plans = [
  {
    name: "Basic",
    price: "$0",
    period: "Forever",
    description: "Very limited features for testing.",
    features: [
      "3 Searches/Month", 
      "Track 1 Product", 
      "1 Competitor",
      "Basic Data Only"
    ],
  },
  {
    name: "Pro Monthly",
    price: "$9",
    period: "/ month",
    description: "Full access on a flexible monthly basis.",
    features: [
      "Unlimited Searches", 
      "Track 50 Products", 
      "20 Competitors",
      "Real-time Updates"
    ],
  },
  {
    name: "Pro Yearly",
    price: "$20",
    period: "/ year",
    description: "Best Value! Save over 80% with annual billing.",
    features: [
      "Everything in Pro Monthly", 
      "Track 200 Products", 
      "Priority API Support",
      "Export PDF/CSV Reports"
    ],
    featured: true,
  },
];

export function PricingPlans() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3 mt-10">
        {plans.map((plan) => (
          // PricingCard aslinya menerima 'monthly'/'yearly', tapi kita modifikasi props-nya dengan 'price' langsung jika perlu
          // Karena PricingCard mungkin memiliki tipe tertentu, kita akan override menggunakan price
          <PricingCard 
            key={plan.name} 
            name={plan.name}
            price={plan.price + (plan.period === "Forever" ? "" : " " + plan.period)}
            description={plan.description}
            features={plan.features}
            featured={plan.featured}
          />
        ))}
      </div>
    </div>
  );
}
