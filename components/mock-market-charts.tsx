"use client";

import { useMemo, useState } from "react";
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

export function MultiKeywordTrendChart({
  chartData,
  keyword,
}: {
  chartData?: any[];
  keyword?: string;
}) {
  const data = chartData && chartData.length > 0 ? chartData : MOCK_TREND_DATA;
  const labelA = keyword ? `${keyword} (Search Vol)` : "Sepatu Lari (Shopee)";
  const labelB = keyword ? "Avg Price Trend" : "Sepatu Futsal (Shopee)";

  const dataKeyA = keyword ? "volume" : "shopee_sepatu_lari";
  const dataKeyB = keyword ? "avgPrice" : "shopee_sepatu_futsal";

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      `Date,${labelA},${labelB}\n` +
      data
        .map((row) => `${row.date},${row[dataKeyA]},${row[dataKeyB]}`)
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `trend_${keyword || "market"}.csv`);
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
          <LineChart
            data={data}
            margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
              dy={10}
              tickFormatter={(val) => {
                const date = new Date(val);
                return `${date.getDate()} ${date.toLocaleString("en-US", { month: "short" })}`;
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              labelStyle={{
                fontWeight: "bold",
                color: "#0f172a",
                marginBottom: "8px",
              }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Line
              name={labelA}
              type="monotone"
              dataKey={dataKeyA}
              stroke="#0f766e"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
            <Line
              name={labelB}
              type="monotone"
              dataKey={dataKeyB}
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

export function TopCompetitorsTable({ products, platform }: { products?: any[]; platform?: string }) {
  const mockProducts = [
    { id: 1, name: "Sepatu Lari Ortuseight X1", price: 350000, sold: 12400, monthlySold: 1200, rating: 4.8 },
    { id: 2, name: "Sepatu Running Mills Trex", price: 280000, sold: 8500, monthlySold: 950, rating: 4.7 },
  ];

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minSales, setMinSales] = useState("");
  const [sortBy, setSortBy] = useState("sales_desc");

  // Format harga berdasarkan platform
  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === "string" ? parseFloat(price.replace(/[^0-9.-]+/g, "")) : price;
    if (isNaN(numPrice)) return String(price);
    
    if (platform === "SHOPEE") {
      return `Rp ${numPrice.toLocaleString("id-ID")}`;
    }
    // Default: USD (Amazon, Envato)
    return `$${numPrice.toFixed(2)}`;
  };

  const data = products && products.length > 0 ? products : mockProducts;

  const parsePrice = (val: any) => {
    if (typeof val === "number") return val;
    const parsed = parseFloat(String(val).replace(/[^0-9.]/g, ""));
    return isNaN(parsed) ? 0 : parsed;
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];
    
    if (minPrice) result = result.filter(p => parsePrice(p.price) >= Number(minPrice));
    if (maxPrice) result = result.filter(p => parsePrice(p.price) <= Number(maxPrice));
    if (minSales) result = result.filter(p => (p.monthlySold || p.historicalSold || p.sold) >= Number(minSales));
    
    result.sort((a, b) => {
       if (sortBy === "sales_desc") {
          const salesA = a.monthlySold || a.historicalSold || a.sold || 0;
          const salesB = b.monthlySold || b.historicalSold || b.sold || 0;
          return salesB - salesA;
       }
       if (sortBy === "price_asc") return parsePrice(a.price) - parsePrice(b.price);
       if (sortBy === "price_desc") return parsePrice(b.price) - parsePrice(a.price);
       if (sortBy === "rating_desc") return (b.rating || 0) - (a.rating || 0);
       return 0;
    });
    
    return result;
  }, [data, minPrice, maxPrice, minSales, sortBy]);

  const handleExportCSV = () => {
    const escapeCSV = (str: string) => `"${String(str).replace(/"/g, '""')}"`;
    const headers = ["Rank", "Product ID", "Product Name", "Price", "URL", "Sales/Ratings", "Fetched At"];
    const rows = filteredAndSortedData.map((p: any, index: number) => {
      const priceStr = formatPrice(p.price);
      const salesStr = p.monthlySold > 0 ? `+${p.monthlySold} items/mo` : `${p.sold || p.historicalSold} ratings`;
      const dateStr = p.fetchedAt ? new Date(p.fetchedAt).toLocaleString('id-ID') : "Today";
      return [index + 1, escapeCSV(p.externalId || p.id), escapeCSV(p.name || p.title || ""), escapeCSV(priceStr), escapeCSV(p.url || ""), escapeCSV(salesStr), escapeCSV(dateStr)].join(",");
    });
    
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Top_Winning_Products_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-end justify-between">
        <div className="flex flex-wrap gap-3 flex-1">
          <div className="flex flex-col gap-1.5 w-full sm:w-32">
            <label className="text-xs font-semibold text-slate-500">Min Harga</label>
            <input type="number" placeholder="0" className="h-9 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5 w-full sm:w-32">
            <label className="text-xs font-semibold text-slate-500">Max Harga</label>
            <input type="number" placeholder="Tak hingga" className="h-9 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5 w-full sm:w-32">
            <label className="text-xs font-semibold text-slate-500">Min Terjual/Rating</label>
            <input type="number" placeholder="0" className="h-9 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm" value={minSales} onChange={e => setMinSales(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5 w-full sm:w-40">
            <label className="text-xs font-semibold text-slate-500">Urutkan Berdasarkan</label>
            <select className="h-9 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="sales_desc">Terlaris (Sales/Rating)</option>
              <option value="price_asc">Harga Terendah</option>
              <option value="price_desc">Harga Tertinggi</option>
              <option value="rating_desc">Rating Tertinggi</option>
            </select>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="border-b border-slate-200 bg-slate-50/50 text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
            <tr>
              <th className="px-4 py-4 font-medium w-12 text-center">#</th>
              <th className="px-4 py-4 font-medium">Informasi Produk</th>
              <th className="px-4 py-4 font-medium">Harga</th>
              <th className="px-4 py-4 font-medium">Est. Penjualan / Rating</th>
              <th className="px-4 py-4 font-medium">Data Diambil Pada</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredAndSortedData.map((p: any, index: number) => (
              <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-4 py-4 text-center font-medium text-slate-400">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                </td>
                <td className="px-4 py-4 min-w-[300px] whitespace-normal">
                  <div className="font-medium text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">{p.name || p.title}</div>
                  <div className="flex items-center gap-3 mt-1.5">
                    {p.url ? (
                      <a href={p.url} target="_blank" rel="noreferrer" className="inline-flex items-center text-xs text-blue-600 hover:text-blue-700 font-medium">Lihat di Toko &rarr;</a>
                    ) : (
                      <span className="inline-flex items-center text-xs text-amber-500 font-medium">⭐ {p.rating || "N/A"}</span>
                    )}
                    {p.externalId && <span className="text-[10px] text-slate-400 border border-slate-200 rounded px-1.5 py-0.5">ID: {p.externalId}</span>}
                  </div>
                </td>
                <td className="px-4 py-4 font-medium text-slate-700 dark:text-slate-300">
                  {formatPrice(p.price)}
                </td>
                <td className="px-4 py-4">
                  <div className="inline-flex items-center rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 border border-teal-100">
                    {p.monthlySold > 0 ? `+${p.monthlySold.toLocaleString()} terjual/bln` : `${(p.sold || p.historicalSold || 0).toLocaleString()} rating`}
                  </div>
                </td>
                <td className="px-4 py-4 text-xs text-slate-500" suppressHydrationWarning>
                  {p.fetchedAt ? new Date(p.fetchedAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : "Hari Ini"}
                </td>
              </tr>
            ))}
            {filteredAndSortedData.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                  Tidak ada produk yang sesuai dengan filter Anda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}