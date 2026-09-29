"use client";

import { useState, useTransition } from "react";
import { Search, Info, AlertCircle, Loader2, PlaySquare, Calendar, Eye, ThumbsUp, MessageSquare, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface YouTubeVideo {
  videoId: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  duration: string | null;
  metrics: {
    viewCount: number | null;
    likeCount: number | null;
    commentCount: number | null;
  };
}

interface YouTubeResult {
  query: string;
  fromCache: boolean;
  fetchedAt: string;
  totalResults: number;
  videos: YouTubeVideo[];
  provider: "YOUTUBE";
  dataStatus: "OBSERVED";
  isPro?: boolean;
}

function formatNumber(n: number | null | undefined) {
  if (n == null) return "-";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return new Intl.NumberFormat("id-ID").format(n);
}

function parseDuration(duration: string | null) {
  if (!duration) return "";
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return duration;
  const h = match[1] ? match[1].replace("H", "") : "";
  const m = match[2] ? match[2].replace("M", "") : "0";
  const s = match[3] ? match[3].replace("S", "") : "0";
  
  if (h) return `${h}:${m.padStart(2, "0")}:${s.padStart(2, "0")}`;
  return `${m}:${s.padStart(2, "0")}`;
}

export function YouTubeSearchClient() {
  const [query, setQuery] = useState("");
  const [regionCode, setRegionCode] = useState("ID");
  const [result, setResult] = useState<YouTubeResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSearch = () => {
    if (!query.trim()) return;
    setError(null);
    setResult(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/search/youtube", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: query.trim(), regionCode, maxResults: 12 }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (data.code === "UNAUTHENTICATED") {
            setError("Anda harus login untuk melakukan pencarian.");
            return;
          }
          if (data.code === "NO_WORKSPACE") {
            setError("Workspace belum ditemukan. Coba logout dan login kembali.");
            return;
          }
          if (data.code === "NOT_CONFIGURED") {
            setError("Kunci API YouTube belum dikonfigurasi oleh Admin.");
            return;
          }
          if (data.code === "QUOTA_EXCEEDED") {
            setError("Batas kuota harian YouTube API telah habis (Error 429).");
            return;
          }
          setError(data.error ?? "Terjadi kesalahan saat mengambil data.");
          return;
        }

        setResult(data);
      } catch {
        setError("Koneksi gagal. Pastikan Anda terhubung ke internet.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle>Cari Video Terkait</CardTitle>
          <CardDescription>
            Masukkan kata kunci bisnis untuk melihat metrik tayangan dan kompetisi di YouTube.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Contoh: Review sepatu lari lokal..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                disabled={isPending}
                className="w-full"
              />
            </div>
            <select
              value={regionCode}
              onChange={(e) => setRegionCode(e.target.value)}
              disabled={isPending}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              <option value="ID">🇮🇩 Indonesia</option>
              <option value="US">🇺🇸 United States</option>
              <option value="SG">🇸🇬 Singapore</option>
              <option value="MY">🇲🇾 Malaysia</option>
            </select>
            <Button onClick={handleSearch} disabled={isPending || !query.trim()} className="bg-red-600 hover:bg-red-700 text-white">
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              {isPending ? "Mencari..." : "Cari Video"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info / Disclaimer */}
      <div className="flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-300">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          Data diambil langsung dari YouTube Data API v3. Data yang ditarik akan di-cache secara lokal 
          di workspace Anda.
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
              Hasil untuk "{result.query}"
              {result.isPro && (
                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-600 font-bold dark:bg-indigo-900/40 dark:text-indigo-400">
                  PRO
                </span>
              )}
            </h2>
            <span className="text-sm text-slate-500">
              Menampilkan {result.videos.length} video populer
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {result.videos.map((video) => (
              <a
                key={video.videoId}
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <PlaySquare className="h-10 w-10 text-slate-300" />
                    </div>
                  )}
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white">
                      {parseDuration(video.duration)}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-slate-900 dark:text-slate-50">
                    {video.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {video.channelTitle}
                  </p>
                  
                  <div className="mt-auto pt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {formatNumber(video.metrics.viewCount)}
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      {formatNumber(video.metrics.likeCount)}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      {formatNumber(video.metrics.commentCount)}
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center gap-1 text-[10px] text-slate-400">
                    <Calendar className="h-3 w-3" />
                    {new Date(video.publishedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </div>
                </div>
              </a>
            ))}

            {!result.isPro && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-6 text-center dark:border-slate-700 dark:bg-slate-900/50">
                <div className="rounded-full bg-slate-200 p-3 dark:bg-slate-800">
                  <Lock className="h-6 w-6 text-slate-500" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">Video Lainnya Terkunci</h3>
                <p className="mt-1 max-w-[200px] text-xs text-slate-500">
                  Akun gratis hanya dapat melihat 3 video teratas. Upgrade ke Pro untuk melihat 20+ video per pencarian.
                </p>
                <Button variant="secondary" size="sm" className="mt-4" onClick={(e) => { e.preventDefault(); window.location.href = "/pricing"; }}>
                  Upgrade Akun
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
