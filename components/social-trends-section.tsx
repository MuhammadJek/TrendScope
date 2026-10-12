"use client";

import { useState } from "react";
import {
  Video,
  PlaySquare,
  ExternalLink,
  Flame,
  Eye,
  Heart,
  MessageCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SocialContentItem } from "@/lib/social-trends-actions";

interface SocialTrendsSectionProps {
  contentItems: SocialContentItem[];
  activeCategories: string[];
  country: string;
}

export function SocialTrendsSection({
  contentItems,
  activeCategories,
  country,
}: SocialTrendsSectionProps) {
  const [activePlatform, setActivePlatform] = useState<"ALL" | "YOUTUBE" | "TIKTOK">("ALL");

  const filtered = contentItems.filter((item) => {
    if (activePlatform === "ALL") return true;
    return item.platform === activePlatform;
  });

  return (
    <section id="social-trends" className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <Flame className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
              Social Media Trends
            </h2>
            <Badge tone="rose" className="text-xs">
              {filtered.length} Content Signals
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Surging content topics and videos gaining attention across YouTube & TikTok in {country}.
          </p>
        </div>

        {/* Platform Filter Buttons */}
        <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-medium dark:border-slate-800 dark:bg-slate-900 self-start sm:self-auto">
          <button
            onClick={() => setActivePlatform("ALL")}
            className={`rounded-md px-3 py-1 transition-all ${
              activePlatform === "ALL"
                ? "bg-white font-semibold text-slate-950 shadow-xs dark:bg-slate-800 dark:text-slate-50"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            All Platforms
          </button>
          <button
            onClick={() => setActivePlatform("YOUTUBE")}
            className={`rounded-md px-3 py-1 transition-all ${
              activePlatform === "YOUTUBE"
                ? "bg-white font-semibold text-slate-950 shadow-xs dark:bg-slate-800 dark:text-slate-50"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            YouTube
          </button>
          <button
            onClick={() => setActivePlatform("TIKTOK")}
            className={`rounded-md px-3 py-1 transition-all ${
              activePlatform === "TIKTOK"
                ? "bg-white font-semibold text-slate-950 shadow-xs dark:bg-slate-800 dark:text-slate-50"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            TikTok
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/30">
          <PlaySquare className="mx-auto h-8 w-8 text-slate-400" />
          <h4 className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            No social content observed for this filter
          </h4>
          <p className="mt-1 text-xs text-slate-500">
            Collecting new video signals. Content updates periodically via YouTube & TikTok feeds.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col justify-between overflow-hidden border-slate-200/90 bg-white shadow-xs transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between gap-2">
                  <Badge
                    tone={item.platform === "YOUTUBE" ? "rose" : "indigo"}
                    className="text-[10px]"
                  >
                    {item.platform}
                  </Badge>
                  <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                    {item.channelTitle}
                  </span>
                </div>
                <CardTitle className="mt-2 text-sm font-semibold leading-snug line-clamp-2 text-slate-900 dark:text-slate-100">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Topic: {item.category}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 pt-2 space-y-3">
                {/* Engagement Metrics */}
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5 text-slate-400" />
                    <span className="font-semibold">
                      {item.viewsCount != null ? (item.viewsCount).toLocaleString() : "N/A"}
                    </span>
                  </div>
                  {item.likesCount != null && (
                    <div className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5 text-rose-400" />
                      <span>{(item.likesCount).toLocaleString()}</span>
                    </div>
                  )}
                  {item.commentsCount != null && (
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5 text-teal-400" />
                      <span>{(item.commentsCount).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* View Growth Velocity */}
                <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-2 text-[11px] dark:border-slate-800/80 dark:bg-slate-900/40">
                  <p className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-teal-500" />
                    Growth Signal:
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.growthMetrics.explanation}
                  </p>
                </div>

                {/* Direct Link */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400">
                    {item.dataFreshness}
                  </span>
                  <a
                    href={item.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span>Watch Content</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
