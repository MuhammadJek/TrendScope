import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PricingCard({
  name,
  price,
  description,
  features,
  featured,
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  featured?: boolean;
}) {
  return (
    <Card className={featured ? "border-teal-300 shadow-md dark:border-teal-800" : undefined}>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-semibold text-slate-950 dark:text-slate-50">{price}</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {name === "Pro Yearly" ? "Billed annually" : name === "Pro Monthly" ? "Billed monthly" : "Free forever"}
        </p>
        <Button className="mt-6 w-full" variant={featured ? "accent" : "secondary"}>
          {name === "Basic" ? "Get Started" : "Subscribe Now"}
        </Button>
        <ul className="mt-6 space-y-3 text-sm text-slate-700 dark:text-slate-300">
          {features.map((feature) => (
            <li key={feature} className="flex gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
