"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  Download,
  Activity,
  Layers,
  Sparkles,
  Info,
  Clock,
  TrendingUp,
  FileQuestion,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type TrendMetric =
  | "POPULARITY_SIGNALS"
  | "SOCIAL_PERFORMANCE"
  | "KEYWORD_INTEREST"
  | "CATEGORY_COMPARISON";

export interface CategoryTrendPoint {
  date: string;
  [categoryKey: string]: any;
}

interface MarketTrendVisualizationProps {
  categories: string[];
  timeRange: string;
  country: string;
  chartData?: CategoryTrendPoint[];
  dataSource?: string;
  dataCoverage?: "OBSERVED" | "ESTIMATED" | "UNAVAILABLE" | "FIXTURE";
  isHistoricalSufficient?: boolean;
}

export function MarketTrendVisualization({
  categories,
  timeRange,
  country,
  chartData = [],
  dataSource = "Amazon + YouTube Data API",
  dataCoverage = "OBSERVED",
  isHistoricalSufficient = true,
}: MarketTrendVisualizationProps) {
  const [activeMetric, setActiveMetric] = useState<TrendMetric>("CATEGORY_COMPARISON");
  const [chartType, setChartType] = useState<"line" | "area">("area");

  // Colors for multi-category comparison
  const CATEGORY_COLORS = [
    "#0d9488", // teal-600
    "#6366f1", // indigo-500
    "#f59e0b", // amber-500
    "#ec4899", // pink-500
    "#10b981", // emerald-500
    "#8b5cf6", // purple-500
    "#3b82f6", // blue-500
  ];

  const handleExportCSV = () => {
    if (!chartData || chartData.length === 0) return;
    const headers = Object.keys(chartData[0]).join(",");
    const rows = chartData.map((row) => Object.values(row).join(",")).join("\n");
    const blob = new Blob([`${headers}\n${rows}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `trendscope_${activeMetric.toLowerCase()}_${country}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const metricTitles: Record<TrendMetric, { title: string; desc: string }> = {
    CATEGORY_COMPARISON: {
      title: "Category-Level Trend Momentum",
      desc: `Cross-category comparison across ${categories.join(", ")} in ${country} (${timeRange}).`,
    },
    POPULARITY_SIGNALS: {
      title: "Product Popularity & Demand Signals",
      desc: "Normalized marketplace demand indicators and listing activity.",
    },
    SOCIAL_PERFORMANCE: {
      title: "Social Content Performance (Views Velocity)",
      desc: "Aggregate view count and engagement trajectories from YouTube & TikTok observations.",
    },
    KEYWORD_INTEREST: {
      title: "Keyword Search Interest Trajectory",
      desc: "Search query volume movement and trend velocity across target marketplaces.",
    },
  };

  return (
    <Card className="border-slate-200/90 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <CardHeader className="flex flex-col gap-4 border-b border-slate-100 p-5 dark:border-slate-900 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold text-slate-950 dark:text-slate-50">
              {metricTitles[activeMetric].title}
            </CardTitle>
            <Badge tone={dataCoverage === "OBSERVED" ? "teal" : "indigo"}>
              {dataCoverage}
            </Badge>
          </div>
          <CardDescription className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {metricTitles[activeMetric].desc} &bull; Source: <span className="font-medium text-slate-700 dark:text-slate-300">{dataSource}</span>
          </CardDescription>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector Tabs */}
          <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-medium dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => setActiveMetric("CATEGORY_COMPARISON")}
              className={`rounded-md px-2.5 py-1 transition-all ${
                activeMetric === "CATEGORY_COMPARISON"
                  ? "bg-white text-slate-950 shadow-xs dark:bg-slate-800 dark:text-slate-50"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveMetric("POPULARITY_SIGNALS")}
              className={`rounded-md px-2.5 py-1 transition-all ${
                activeMetric === "POPULARITY_SIGNALS"
                  ? "bg-white text-slate-950 shadow-xs dark:bg-slate-800 dark:text-slate-50"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Popularity
            </button>
            <button
              onClick={() => setActiveMetric("SOCIAL_PERFORMANCE")}
              className={`rounded-md px-2.5 py-1 transition-all ${
                activeMetric === "SOCIAL_PERFORMANCE"
                  ? "bg-white text-slate-950 shadow-xs dark:bg-slate-800 dark:text-slate-50"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Social Views
            </button>
            <button
              onClick={() => setActiveMetric("KEYWORD_INTEREST")}
              className={`rounded-md px-2.5 py-1 transition-all ${
                activeMetric === "KEYWORD_INTEREST"
                  ? "bg-white text-slate-950 shadow-xs dark:bg-slate-800 dark:text-slate-50"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Keyword Interest
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={!isHistoricalSufficient || chartData.length === 0}
            className="h-8 gap-1.5 text-xs border-slate-200 dark:border-slate-800"
          >
            <Download className="h-3.5 w-3.5" />
            <span>CSV</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        {!isHistoricalSufficient || chartData.length === 0 ? (
          /* Informative Empty State requirement */
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 py-16 text-center dark:border-slate-800 dark:bg-slate-900/30">
            <div className="rounded-full bg-slate-100 p-3 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <FileQuestion className="h-6 w-6" />
            </div>
            <h4 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
              Collecting Historical Observations
            </h4>
            <p className="mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400">
              Historical trend analysis will become available after additional daily observations are collected for {categories.join(", ")} in {country}.
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <Clock className="h-3.5 w-3.5 text-teal-600" />
              <span>Next synchronization scheduled via Background Worker</span>
            </div>
          </div>
        ) : (
          <div className="h-[320px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "area" ? (
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    {categories.map((cat, idx) => (
                      <linearGradient
                        key={cat}
                        id={`gradient-${idx}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]}
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]}
                          stopOpacity={0.0}
                        />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                  <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      borderRadius: "0.75rem",
                      border: "1px solid rgba(51, 65, 85, 0.5)",
                      color: "#f8fafc",
                      fontSize: "12px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: "12px", fontSize: "11px" }}
                  />
                  {categories.map((cat, idx) => {
                    const cleanKey = cat.toLowerCase().replace(/[^a-z0-9]/g, "_");
                    return (
                      <Area
                        key={cat}
                        type="monotone"
                        dataKey={cleanKey}
                        name={cat}
                        stroke={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill={`url(#gradient-${idx})`}
                      />
                    );
                  })}
                </AreaChart>
              ) : (
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: "12px", fontSize: "11px" }} />
                  {categories.map((cat, idx) => {
                    const cleanKey = cat.toLowerCase().replace(/[^a-z0-9]/g, "_");
                    return (
                      <Line
                        key={cat}
                        type="monotone"
                        dataKey={cleanKey}
                        name={cat}
                        stroke={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]}
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 5 }}
                      />
                    );
                  })}
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-900 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-teal-600" />
            <span>
              Metrics represent relative trajectory index normalized to 100 on initial observation.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px]">Chart display:</span>
            <button
              onClick={() => setChartType("area")}
              className={`rounded px-1.5 py-0.5 text-[11px] font-medium transition-colors ${
                chartType === "area"
                  ? "bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType("line")}
              className={`rounded px-1.5 py-0.5 text-[11px] font-medium transition-colors ${
                chartType === "line"
                  ? "bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Line
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
