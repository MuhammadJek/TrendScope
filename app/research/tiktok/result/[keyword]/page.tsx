import { AppFrame } from "@/components/app-frame";
import { searchTiktokAction } from "@/lib/tiktok-actions";
import { checkIsSaved } from "@/lib/search-actions";
import { ArrowLeft, TrendingUp, Eye, Activity, Target, Play, Heart, MessageCircle, Share2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VideoList from "@/components/VideoList";
import TiktokResultClient from "@/components/TiktokResultClient";

export const metadata = {
  title: "TikTok Result — TrendScope",
};

// Helper untuk format angka besar (misal: 1500000 -> 1.5M)
function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export default async function TiktokResultPage({
  params,
}: {
  params: Promise<{ keyword: string }>;
}) {
  const resolvedParams = await params;
  const keyword = decodeURIComponent(resolvedParams.keyword);

  // Server-side data fetch
  const data = await searchTiktokAction(keyword);
  const isSaved = await checkIsSaved(keyword);

  return (
    <AppFrame title={`Tren TikTok: #${keyword}`}>
      <TiktokResultClient data={data} keyword={keyword} initialIsSaved={isSaved} />
    </AppFrame>
  );
}

// Retain KpiCard for potential reuse inside client component (if needed)
function KpiCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5 flex items-start gap-4">
        <div className={`p-3 rounded-xl ${bg} ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function VideoCard({ video, rank }: { video: any, rank: number }) {
  return (
    <Card className="overflow-hidden border-slate-200 dark:border-slate-800 hover:border-pink-500/50 dark:hover:border-pink-500/50 hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
      <div className="p-5 flex-1 flex flex-col">
        {/* Header: Rank & Creator */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 text-xs">
              {video.authorName.charAt(0).toUpperCase()}
            </div>
            <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[150px]">
              {video.authorName}
            </span>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
            #{rank}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 flex-1">
          {video.description}
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 mb-4">
          <div className="text-center">
            <Play className="w-4 h-4 mx-auto text-cyan-500 mb-1" />
            <p className="text-xs font-bold text-slate-900 dark:text-white">{formatNumber(video.viewsCount)}</p>
          </div>
          <div className="text-center">
            <Heart className="w-4 h-4 mx-auto text-pink-500 mb-1" />
            <p className="text-xs font-bold text-slate-900 dark:text-white">{formatNumber(video.likesCount)}</p>
          </div>
          <div className="text-center">
            <MessageCircle className="w-4 h-4 mx-auto text-slate-400 mb-1" />
            <p className="text-xs font-bold text-slate-900 dark:text-white">{formatNumber(video.commentsCount)}</p>
          </div>
          <div className="text-center">
            <Share2 className="w-4 h-4 mx-auto text-slate-400 mb-1" />
            <p className="text-xs font-bold text-slate-900 dark:text-white">{formatNumber(video.sharesCount)}</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <a 
        href={video.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block text-center py-3 bg-slate-50 dark:bg-slate-900/50 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/30 transition-colors border-t border-slate-100 dark:border-slate-800"
      >
        Tonton di TikTok &rarr;
      </a>
    </Card>
  );
}
