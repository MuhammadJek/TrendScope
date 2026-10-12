"use client";

import { useState, useTransition } from "react";
import { ArrowLeft, TrendingUp, Eye, Activity, Target, Heart, BookmarkPlus, BookmarkCheck } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VideoList from "@/components/VideoList";
import { toggleSavedSearch } from "@/lib/search-actions";

// Helper to format large numbers
function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}

interface TiktokResultClientProps {
  data: any; // shape from searchTiktokAction
  keyword: string;
  initialIsSaved: boolean;
}

export default function TiktokResultClient({ data, keyword, initialIsSaved }: TiktokResultClientProps) {
  const [filter, setFilter] = useState<'most' | 'recent'>('most');
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isPending, startTransition] = useTransition();

  const handleToggleSave = () => {
    startTransition(async () => {
      try {
        const res = await toggleSavedSearch(keyword);
        setIsSaved(res.saved);
      } catch (error) {
        console.error("Failed to toggle save", error);
        alert("Gagal menyimpan pencarian. Pastikan Anda sudah login.");
      }
    });
  };

  const filteredVideos = [...data.videos].sort((a, b) => {
    if (filter === 'most') return b.viewsCount - a.viewsCount;
    return (b.createdAt ?? 0) - (a.createdAt ?? 0);
  });

  const totalVideos = filteredVideos.length;
  const totalViews = filteredVideos.reduce((sum: number, v: any) => sum + v.viewsCount, 0);
  const totalLikes = filteredVideos.reduce((sum: number, v: any) => sum + v.likesCount, 0);
  const avgLikes = totalVideos > 0 ? Math.floor(totalLikes / totalVideos) : 0;
  const totalEngagements = filteredVideos.reduce(
    (sum: number, v: any) => sum + v.likesCount + v.commentsCount + v.sharesCount,
    0,
  );
  const engagementRate = totalViews > 0 ? ((totalEngagements / totalViews) * 100).toFixed(2) : "0.00";

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-col gap-4">
          <Link
            href="/research/tiktok"
            className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Kembali
          </Link>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white mb-1">
              #{keyword}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Analisis performa konten berdasarkan hashtag
            </p>
          </div>
        </div>
        
        {/* Track Keyword Button */}
        <div>
          <Button 
            onClick={handleToggleSave}
            disabled={isPending}
            variant="outline"
            className={`gap-2 h-10 px-5 text-sm font-medium transition-colors ${
              isSaved 
                ? "border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" 
                : "border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4" /> Disimpan
              </>
            ) : (
              <>
                <BookmarkPlus className="w-4 h-4" /> Simpan Pencarian
              </>
            )}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Views"
          value={formatNumber(totalViews)}
          icon={Eye}
        />
        <KpiCard
          title="Rata-rata Likes"
          value={formatNumber(avgLikes)}
          icon={Heart}
        />
        <KpiCard
          title="Engagement Rate"
          value={`${engagementRate}%`}
          icon={Activity}
        />
        <KpiCard
          title="Total Video"
          value={totalVideos.toString()}
          icon={Target}
        />
      </div>

      {/* Video Section */}
      <div className="pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-slate-500" />
            Top Videos
          </h2>
          
          {/* Filter Options */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 p-1 rounded-lg border border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setFilter('most')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === 'most' 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              Terpopuler
            </button>
            <button
              onClick={() => setFilter('recent')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === 'recent' 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              Terbaru
            </button>
          </div>
        </div>
        
        <VideoList videos={filteredVideos} />
        
        {filteredVideos.length === 0 && (
          <div className="text-center py-16 bg-transparent rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 text-sm">Belum ada video yang dianalisis.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon: Icon }: any) {
  return (
    <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09090b] shadow-sm">
      <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 mb-3">
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <p className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}


