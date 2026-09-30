"use client";

import { useMemo } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_TREND_DATA = [
  { date: "2024-03-01", shopee_sepatu_lari: 1200, shopee_sepatu_futsal: 800 },
  { date: "2024-03-05", shopee_sepatu_lari: 1400, shopee_sepatu_futsal: 820 },
  { date: "2024-03-10", shopee_sepatu_lari: 1350, shopee_sepatu_futsal: 900 },
  { date: "2024-03-15", shopee_sepatu_lari: 1800, shopee_sepatu_futsal: 1100 },
  { date: "2024-03-20", shopee_sepatu_lari: 2500, shopee_sepatu_futsal: 1150 }, // Spike!
  { date: "2024-03-25", shopee_sepatu_lari: 2100, shopee_sepatu_futsal: 1000 },
  { date: "2024-03-30", shopee_sepatu_lari: 2300, shopee_sepatu_futsal: 1050 },
];

export function MultiKeywordTrendChart() {
  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Date,Sepatu Lari (Shopee),Sepatu Futsal (Shopee)\n" +
      MOCK_TREND_DATA.map(
        (row) =>
          `${row.date},${row.shopee_sepatu_lari},${row.shopee_sepatu_futsal}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "trend_sepatu_maret_2024.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Showing daily search volume & sales velocity estimates.
        </div>
        <Button variant="secondary" size="sm" onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={MOCK_TREND_DATA} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
              dy={10}
              tickFormatter={(val) => {
                const date = new Date(val);
                return `${date.getDate()} ${date.toLocaleString("id-ID", { month: "short" })}`;
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
            />
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              labelStyle={{ fontWeight: "bold", color: "#0f172a", marginBottom: "8px" }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Line
              name="Sepatu Lari (Demand)"
              type="monotone"
              dataKey="shopee_sepatu_lari"
              stroke="#0f766e"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
            <Line
              name="Sepatu Futsal (Demand)"
              type="monotone"
              dataKey="shopee_sepatu_futsal"
              stroke="#64748b"
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TopCompetitorsTable({ products }: { products?: any[] }) {
  const mockProducts = [
    { id: 1, name: "Sepatu Lari Ortuseight X1", price: "Rp 350.000", sold: 12400, monthlySold: 1200, rating: 4.8 },
    { id: 2, name: "Sepatu Running Mills Trex", price: "Rp 280.000", sold: 8500, monthlySold: 950, rating: 4.7 },
    { id: 3, name: "Aerostreet Running 2.0", price: "Rp 150.000", sold: 45000, monthlySold: 3200, rating: 4.9 },
  ];

  const data = products && products.length > 0 ? products : mockProducts;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          <tr>
            <th className="px-4 py-3 font-medium">Top Products (Market)</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Est. Sales / Ratings</th>
            <th className="px-4 py-3 font-medium">External ID</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {data.map((p: any) => (
            <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <td className="px-4 py-4">
                <div className="font-medium text-slate-900 dark:text-slate-100 line-clamp-2">{p.name || p.title}</div>
                {p.url && <a href={p.url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline mt-1 block">View Product</a>}
                {!p.url && <div className="text-xs text-amber-500 mt-1">⭐ {p.rating || "N/A"}</div>}
              </td>
              <td className="px-4 py-4 text-slate-600 dark:text-slate-400">
                {p.price.toString().startsWith("Rp") || p.price.toString().startsWith("$") ? p.price : `$${p.price}`}
              </td>
              <td className="px-4 py-4 text-teal-600 dark:text-teal-400 font-semibold">
                {p.monthlySold > 0 ? `+${p.monthlySold} items/mo` : `${p.sold || p.historicalSold} ratings`}
              </td>
              <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{p.externalId || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
