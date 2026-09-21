"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CategoryShare, Product, TrendPoint } from "@/lib/types";

const axisColor = "#64748b";
const palette = ["#0f766e", "#4f46e5", "#d97706", "#e11d48", "#334155", "#0891b2"];

function ClientChartFrame({ children, height = "h-72" }: { children: ReactNode; height?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));

    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) {
    return (
      <div className={`${height} w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900`}>
        <div className="flex h-full items-end gap-3 p-6" aria-hidden="true">
          {[44, 72, 56, 88, 64, 96].map((bar, index) => (
            <span key={index} className="flex-1 rounded-t bg-slate-200 dark:bg-slate-800" style={{ height: `${bar}%` }} />
          ))}
        </div>
        <span className="sr-only">Loading chart</span>
      </div>
    );
  }

  return <div className={`${height} w-full`}>{children}</div>;
}

export function TrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <ClientChartFrame>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fill: axisColor, fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: axisColor, fontSize: 12 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
          <Line type="monotone" dataKey="marketplace" name="Digital Marketplace" stroke="#4f46e5" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="ecommerce" name="E-Commerce" stroke="#0f766e" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="tiktok" name="TikTok" stroke="#e11d48" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ClientChartFrame>
  );
}

export function ProductRankingChart({ products }: { products: Product[] }) {
  const data = products
    .filter((product) => product.metricValue !== null)
    .slice(0, 6)
    .map((product) => ({ name: product.title, value: product.metricValue ?? 0 }));

  return (
    <ClientChartFrame>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 32, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" horizontal={false} />
          <XAxis type="number" tick={{ fill: axisColor, fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="name" width={96} tick={{ fill: axisColor, fontSize: 12 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
          <Bar dataKey="value" radius={[0, 8, 8, 0]} fill="#0f766e" />
        </BarChart>
      </ResponsiveContainer>
    </ClientChartFrame>
  );
}

export function CategoryDistributionChart({ data }: { data: CategoryShare[] }) {
  return (
    <ClientChartFrame>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={3}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={palette[index % palette.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
        </PieChart>
      </ResponsiveContainer>
    </ClientChartFrame>
  );
}

export function ProductHistoryChart({ data }: { data: { date: string; value: number }[] }) {
  return (
    <ClientChartFrame height="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fill: axisColor, fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: axisColor, fontSize: 12 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
          <Line type="monotone" dataKey="value" name="Demo metric" stroke="#0f766e" strokeWidth={3} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </ClientChartFrame>
  );
}
