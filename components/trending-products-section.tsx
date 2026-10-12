"use client";

import { useState } from "react";
import {
  ShoppingBag,
  ExternalLink,
  TrendingUp,
  Tag,
  Star,
  Layers,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface TrendingProductItem {
  id: string;
  externalId: string;
  source: "AMAZON" | "EBAY" | "ETSY" | "ENVATO";
  title: string;
  price: number;
  currency: string;
  thumbnailUrl?: string | null;
  url?: string | null;
  category: string;
  rating?: number | null;
  historicalSold?: number | null;
  trendMomentum?: "STRONG_UP" | "MODERATE_UP" | "STABLE" | "DECLINING";
  dataStatus: "OBSERVED" | "ESTIMATED";
}

interface TrendingProductsSectionProps {
  products: TrendingProductItem[];
  activeCategories: string[];
  country: string;
}

export function TrendingProductsSection({
  products,
  activeCategories,
  country,
}: TrendingProductsSectionProps) {
  const [selectedSource, setSelectedSource] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"sold" | "price_asc" | "price_desc">("sold");

  const sources = ["ALL", "AMAZON", "EBAY", "ENVATO", "ETSY"];

  const filtered = products
    .filter((p) => (selectedSource === "ALL" ? true : p.source === selectedSource))
    .sort((a, b) => {
      if (sortBy === "sold") return (b.historicalSold || 0) - (a.historicalSold || 0);
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      return 0;
    });

  const getSourceBadgeTone = (source: string) => {
    switch (source) {
      case "AMAZON":
        return "amber";
      case "EBAY":
        return "indigo";
      case "ENVATO":
        return "teal";
      case "ETSY":
        return "rose";
      default:
        return "slate";
    }
  };

  return (
    <section id="trending-products" className="space-y-4 pt-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <ShoppingBag className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
              Trending Products
            </h2>
            <Badge tone="slate" className="text-xs">
              {filtered.length} Indexed
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Products gaining search visibility and demand momentum across connected marketplaces in {country}.
          </p>
        </div>

        {/* Filters & Sorting */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Marketplace source pills */}
          <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-medium dark:border-slate-800 dark:bg-slate-900">
            {sources.map((src) => (
              <button
                key={src}
                onClick={() => setSelectedSource(src)}
                className={`rounded-md px-2.5 py-1 text-xs transition-all ${
                  selectedSource === src
                    ? "bg-white font-semibold text-slate-950 shadow-xs dark:bg-slate-800 dark:text-slate-50"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {src}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 cursor-pointer focus:outline-none"
          >
            <option value="sold">Top Sales / Ratings</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/30">
          <ShoppingBag className="mx-auto h-8 w-8 text-slate-400" />
          <h4 className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            No products match this source filter
          </h4>
          <p className="mt-1 text-xs text-slate-500">
            Try switching to &quot;ALL&quot; or search a different keyword above.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <Card
              key={item.id}
              className="group flex flex-col justify-between overflow-hidden border-slate-200/90 bg-white shadow-xs transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between gap-2">
                  <Badge tone={getSourceBadgeTone(item.source) as any} className="text-[10px]">
                    {item.source}
                  </Badge>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="h-3 w-3" />
                    {item.trendMomentum === "STRONG_UP" ? "High Momentum" : "Trending"}
                  </span>
                </div>
                <CardTitle className="mt-2 text-sm font-semibold leading-snug line-clamp-2 text-slate-900 dark:text-slate-100 group-hover:text-teal-600 transition-colors">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Category: {item.category}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 pt-2 space-y-3">
                <div className="flex items-baseline justify-between border-t border-slate-100 pt-2 dark:border-slate-800">
                  <div>
                    <span className="text-lg font-bold text-slate-950 dark:text-slate-50">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-slate-400 ml-1">{item.currency}</span>
                  </div>
                  {item.historicalSold ? (
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {item.historicalSold.toLocaleString()} ratings/sold
                    </span>
                  ) : null}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400">
                    Source: {item.source} Marketplace
                  </span>
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span>View Listing</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400">Listing Indexed</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
