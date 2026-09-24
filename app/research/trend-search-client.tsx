"use client";

import { useState, useTransition } from "react";
import { Search, TrendingUp, Info, ExternalLink, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WikiDataPoint {
  date: string;
  views: number;
  source: "WIKIPEDIA";
}

interface TrendResult {
  keyword: string;
  article: string | null;
  language: string;
  fromCache: boolean;
  fetchedAt: string;
  totalViews: number;
  peakViews: number;
  peakDate: string | null;
  averageDailyViews: number;
  dataPoints: WikiDataPoint[];
  provider: "WIKIPEDIA";
  dataStatus: "OBSERVED" | "NOT_FOUND" | "PARTIAL";
  articleUrl: string;
  dateRange?: { start: string; end: string };
  disclaimer: string;
  isPro?: boolean;
}

function formatDate(yyyymmdd: string) {
  const y = yyyymmdd.slice(0, 4);
  const m = yyyymmdd.slice(4, 6);
  const d = yyyymmdd.slice(6, 8);
  return `${d}/${m}/${y}`;
}

function formatNumber(n: number) {
  return new Intl.NumberFormat("id-ID").format(n);
}

function MiniChart({ dataPoints }: { dataPoints: WikiDataPoint[] }) {
  if (!dataPoints || dataPoints.length === 0) return null;

  const maxVal = Math.max(...dataPoints.map((p) => p.views), 1);
  const width = 600;
  const height = 120;
  const pad = { top: 8, right: 8, bottom: 24, left: 50 };

  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;

  const points = dataPoints.map((p, i) => {
    const x = pad.left + (i / Math.max(dataPoints.length - 1, 1)) * chartW;
    const y = pad.top + chartH - (p.views / maxVal) * chartH;
    return `${x},${y}`;
  });

  const polyline = points.join(" ");
  const areaPoints = [
    `${pad.left},${pad.top + chartH}`,
    ...points,
    `${pad.left + chartW},${pad.top + chartH}`,
  ].join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" aria-label="Trend chart">
      <defs>
        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d9488" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0d9488" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {/* Y-axis labels */}
      {[0, 0.5, 1].map((ratio) => {
        const yPos = pad.top + chartH - ratio * chartH;
        return (
          <g key={ratio}>
            <line
              x1={pad.left}
              y1={yPos}
              x2={pad.left + chartW}
              y2={yPos}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
            <text
              x={pad.left - 6}
              y={yPos + 4}
              textAnchor="end"
              fontSize="10"
              fill="#94a3b8"
            >
              {formatNumber(Math.round(maxVal * ratio))}
            </text>
          </g>
        );
      })}
      {/* Area fill */}
      <polygon points={areaPoints} fill="url(#trendGrad)" />
      {/* Line */}
      <polyline points={polyline} fill="none" stroke="#0d9488" strokeWidth="2" strokeLinejoin="round" />
      {/* X-axis labels: first, middle, last */}
      {[0, Math.floor(dataPoints.length / 2), dataPoints.length - 1].map((i) => {
        const p = dataPoints[i];
        if (!p) return null;
        const x = pad.left + (i / Math.max(dataPoints.length - 1, 1)) * chartW;
        return (
          <text key={i} x={x} y={height - 4} textAnchor="middle" fontSize="9" fill="#94a3b8">
            {`${p.date.slice(4, 6)}/${p.date.slice(0, 4)}`}
          </text>
        );
      })}
    </svg>
  );
}

export function TrendSearchClient() {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("id");
  const [result, setResult] = useState<TrendResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSearch = () => {
    if (!query.trim()) return;
    setError(null);
    setResult(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/search/trend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keyword: query.trim(), language, autoFind: true }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (data.code === "UNAUTHENTICATED") {
            setError("Anda harus login untuk melakukan pencarian trend.");
            return;
          }
          if (data.code === "NO_WORKSPACE") {
            setError("Workspace belum ditemukan. Coba logout dan login kembali.");
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
          <CardTitle>Cari Tren Topik</CardTitle>
          <CardDescription>
            Masukkan kata kunci untuk melihat tingkat minat publik berdasarkan data Wikipedia Pageviews.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Contoh: Sepatu lari, UMKM, Batik, AI..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                disabled={isPending}
                className="w-full"
              />
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isPending}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              <option value="id">🇮🇩 Bahasa Indonesia</option>
              <option value="en">🇬🇧 English</option>
            </select>
            <Button onClick={handleSearch} disabled={isPending || !query.trim()}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              {isPending ? "Mencari..." : "Cari Tren"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <strong>Tentang data ini:</strong> Data tren berasal dari Wikipedia Pageviews — jumlah kunjungan
          ke artikel Wikipedia per hari. Ini mengukur <em>minat informasi publik</em>, bukan permintaan
          pembelian atau volume pencarian Google.
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
          {result.dataStatus === "NOT_FOUND" ? (
            <Card>
              <CardContent className="py-12 text-center">
                <TrendingUp className="mx-auto mb-3 h-8 w-8 text-slate-400" />
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  Artikel tidak ditemukan
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {result.disclaimer ?? `Tidak ada artikel Wikipedia untuk "${result.keyword}".`}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Coba gunakan kata kunci dalam Bahasa Inggris, atau pilih Wikipedia Bahasa Indonesia.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Header Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                          Wikipedia · {result.language.toUpperCase()}
                        </span>
                        {result.fromCache && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            Dari cache
                          </span>
                        )}
                        {result.isPro && (
                          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-600 font-bold dark:bg-indigo-900/40 dark:text-indigo-400">
                            PRO
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-2xl">{result.keyword}</CardTitle>
                      <CardDescription>
                        Artikel:{" "}
                        <a
                          href={result.articleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-teal-600 hover:underline dark:text-teal-400"
                        >
                          {result.article}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                      <p className="text-xs text-slate-500">Total Kunjungan</p>
                      <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50">
                        {formatNumber(result.totalViews)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                      <p className="text-xs text-slate-500">Rata-rata Harian</p>
                      <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50">
                        {formatNumber(result.averageDailyViews)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                      <p className="text-xs text-slate-500">Puncak Kunjungan</p>
                      <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50">
                        {formatNumber(result.peakViews)}
                      </p>
                      {result.peakDate && (
                        <p className="text-xs text-slate-400">{formatDate(result.peakDate)}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {!result.isPro && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 p-6 text-center dark:border-indigo-900 dark:bg-indigo-950/30">
                  <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">Batasan Akun Gratis</h3>
                  <p className="mt-2 max-w-md text-sm text-indigo-700 dark:text-indigo-300">
                    Anda hanya dapat melihat data 7 hari terakhir. Upgrade ke akun Pro untuk melihat riwayat penuh 30 hari.
                  </p>
                  <Button className="mt-4" onClick={() => window.location.href = "/pricing"}>Upgrade ke Pro</Button>
                </div>
              )}

              {/* Chart Card */}
              {result.dataPoints.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tren Harian</CardTitle>
                    <CardDescription>
                      Jumlah kunjungan halaman Wikipedia per hari. Sumber:{" "}
                      <a
                        href="https://wikimedia.org/api/rest_v1/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:underline dark:text-teal-400"
                      >
                        Wikimedia REST API
                      </a>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MiniChart dataPoints={result.dataPoints} />
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
