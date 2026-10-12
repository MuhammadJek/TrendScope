"use client";

import { useState } from "react";
import {
  Sparkles,
  ExternalLink,
  Bookmark,
  Share2,
  TrendingUp,
  AlertCircle,
  Video,
  ShoppingBag,
  Layers,
  ChevronRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface EvidenceBasedInsight {
  id: string;
  topic: string;
  category: string;
  headline: string;
  synthesis: string;
  opportunityScore: number;
  confidence: number;
  observedSignals: {
    socialGrowthText: string;
    marketplaceSupplyText: string;
    priceObservationText: string;
  };
  relatedProduct: {
    title: string;
    source: string;
    price: number;
    currency: string;
    url: string | null;
  };
  relatedContent: {
    title: string;
    platform: string;
    channelTitle: string;
    viewsCount?: number;
    url: string;
  };
  verificationDisclaimer: string;
}

interface MarketInsightsFeedProps {
  insights: EvidenceBasedInsight[];
  activeCategories: string[];
  country: string;
}

export function MarketInsightsFeed({
  insights,
  activeCategories,
  country,
}: MarketInsightsFeedProps) {
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});

  const toggleSave = (id: string) => {
    setSavedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!insights || insights.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/30">
        <Sparkles className="mx-auto h-8 w-8 text-teal-600 dark:text-teal-400" />
        <h4 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
          Generating Category Market Insights
        </h4>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Collecting cross-source signals across {activeCategories.join(", ")} in {country}. Insights will populate as marketplace and social content observations synchronize.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-950 dark:text-slate-50 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            Evidence-Based Market Insights
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Synthesized correlations combining social content momentum with live marketplace availability.
          </p>
        </div>
        <Badge tone="teal" className="text-xs">
          {insights.length} Verified Insights
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {insights.map((insight) => {
          const isSaved = !!savedIds[insight.id];

          return (
            <Card
              key={insight.id}
              className="flex flex-col justify-between overflow-hidden border-slate-200/90 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge tone="slate" className="text-[11px] font-medium">
                      {insight.category}
                    </Badge>
                    <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                      Score: {insight.opportunityScore}/100
                    </span>
                  </div>
                  <button
                    onClick={() => toggleSave(insight.id)}
                    className={`rounded-lg p-1.5 transition-colors ${
                      isSaved
                        ? "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300"
                        : "text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-900"
                    }`}
                    title={isSaved ? "Saved to watchlist" : "Save insight"}
                  >
                    <Bookmark className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
                  </button>
                </div>

                <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 mt-2">
                  {insight.headline}
                </CardTitle>
                <CardDescription className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 mt-1">
                  {insight.synthesis}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 p-5 pt-0">
                {/* Cross-Platform Correlation Links */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs space-y-2 dark:border-slate-900 dark:bg-slate-900/40">
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <ShoppingBag className="h-3.5 w-3.5 text-amber-500" />
                      {insight.relatedProduct.source} Listing
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      ${insight.relatedProduct.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs font-medium text-slate-800 dark:text-slate-200">
                      {insight.relatedProduct.title}
                    </p>
                    {insight.relatedProduct.url && (
                      <a
                        href={insight.relatedProduct.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-600 hover:text-teal-700 dark:text-teal-400 flex items-center gap-1 flex-shrink-0"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>

                  <div className="border-t border-slate-200/60 pt-2 dark:border-slate-800 flex items-center justify-between text-[11px] font-medium text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Video className="h-3.5 w-3.5 text-rose-500" />
                      Social Viral Signal ({insight.relatedContent.platform})
                    </span>
                    {insight.relatedContent.viewsCount && (
                      <span>{(insight.relatedContent.viewsCount).toLocaleString()} views</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs text-slate-700 dark:text-slate-300">
                      {insight.relatedContent.title} &bull; <span className="opacity-80">{insight.relatedContent.channelTitle}</span>
                    </p>
                    {insight.relatedContent.url && (
                      <a
                        href={insight.relatedContent.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1 flex-shrink-0"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Caveat & Disclaimer Banner (Phase 7 rule) */}
                <div className="flex items-start gap-2 rounded-lg border border-amber-200/80 bg-amber-50/70 p-2 text-[11px] text-amber-900 dark:border-amber-950/60 dark:bg-amber-950/20 dark:text-amber-300">
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-amber-600" />
                  <p>{insight.verificationDisclaimer}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
