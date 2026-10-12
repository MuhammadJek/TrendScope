"use client";

import { useState, useMemo } from "react";
import { 
  Calculator, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface UnitEconomicsCalculatorProps {
  platform: string;
  defaultPrice?: number;
}

export function UnitEconomicsCalculator({
  platform,
  defaultPrice = 35,
}: UnitEconomicsCalculatorProps) {
  const isIDR = platform === "SHOPEE";

  const [price, setPrice] = useState<number>(defaultPrice > 0 ? defaultPrice : (isIDR ? 250000 : 35));
  const [cogs, setCogs] = useState<number>(Math.round((defaultPrice > 0 ? defaultPrice : (isIDR ? 250000 : 35)) * 0.32));
  const [shippingCost, setShippingCost] = useState<number>(isIDR ? 15000 : 4.5);
  const [marketplaceFeePct, setMarketplaceFeePct] = useState<number>(isIDR ? 6.5 : 15);
  const [targetAcosPct, setTargetAcosPct] = useState<number>(18);
  const [returnRatePct, setReturnRatePct] = useState<number>(3);

  const formatPrice = (val: number) => {
    if (isIDR) return `Rp ${Math.round(val).toLocaleString("id-ID")}`;
    return `$${val.toFixed(2)}`;
  };

  const {
    marketplaceFeeAmount,
    adSpendAmount,
    returnAllowanceAmount,
    totalCosts,
    netProfit,
    netMarginPct,
    grossProfit,
    grossMarginPct,
    breakevenPrice,
    roiPct,
  } = useMemo(() => {
    const fee = (price * marketplaceFeePct) / 100;
    const ad = (price * targetAcosPct) / 100;
    const ret = (price * returnRatePct) / 100;

    const costs = cogs + shippingCost + fee + ad + ret;
    const net = price - costs;
    const netMargin = price > 0 ? (net / price) * 100 : 0;

    const gross = price - cogs;
    const grossMargin = price > 0 ? (gross / price) * 100 : 0;

    const variableRatio = (marketplaceFeePct + targetAcosPct + returnRatePct) / 100;
    const bePrice = variableRatio < 1 ? (cogs + shippingCost) / (1 - variableRatio) : costs;

    const roi = cogs > 0 ? (net / cogs) * 100 : 0;

    return {
      marketplaceFeeAmount: fee,
      adSpendAmount: ad,
      returnAllowanceAmount: ret,
      totalCosts: costs,
      netProfit: net,
      netMarginPct: netMargin,
      grossProfit: gross,
      grossMarginPct: grossMargin,
      breakevenPrice: bePrice,
      roiPct: roi,
    };
  }, [price, cogs, shippingCost, marketplaceFeePct, targetAcosPct, returnRatePct]);

  const costBreakdown = useMemo(() => {
    if (price <= 0) return [];
    return [
      { label: "Modal Produk (COGS)", amount: cogs, pct: Math.round((cogs / price) * 100), color: "bg-slate-500", dotColor: "bg-slate-500" },
      { label: "Fee Platform", amount: marketplaceFeeAmount, pct: Math.round((marketplaceFeeAmount / price) * 100), color: "bg-amber-500", dotColor: "bg-amber-500" },
      { label: "Biaya Kirim / Fulfillment", amount: shippingCost, pct: Math.round((shippingCost / price) * 100), color: "bg-blue-500", dotColor: "bg-blue-500" },
      { label: "Budget Iklan (ACoS)", amount: adSpendAmount, pct: Math.round((adSpendAmount / price) * 100), color: "bg-purple-500", dotColor: "bg-purple-500" },
      { label: "Laba Bersih (Net)", amount: Math.max(0, netProfit), pct: Math.max(0, Math.round((netProfit / price) * 100)), color: "bg-emerald-500", dotColor: "bg-emerald-500" },
    ];
  }, [price, cogs, marketplaceFeeAmount, shippingCost, adSpendAmount, netProfit]);

  const inputs = [
    { label: "Harga Jual Produk", value: price, setter: setPrice, displayColor: "text-teal-600 dark:text-teal-400" },
    { label: "HPP / Biaya Modal (COGS)", value: cogs, setter: setCogs, displayColor: "text-slate-500" },
    { label: "Biaya Kemasan & Kirim", value: shippingCost, setter: setShippingCost, displayColor: "text-slate-500" },
    { label: "Potongan Marketplace (%)", value: marketplaceFeePct, setter: setMarketplaceFeePct, displayColor: "text-amber-600", suffix: `% (${formatPrice(marketplaceFeeAmount)})` },
    { label: "Target Biaya Iklan / ACoS (%)", value: targetAcosPct, setter: setTargetAcosPct, displayColor: "text-purple-600", suffix: `% (${formatPrice(adSpendAmount)})` },
    { label: "Alokasi Retur & Rusak (%)", value: returnRatePct, setter: setReturnRatePct, displayColor: "text-slate-500", suffix: `% (${formatPrice(returnAllowanceAmount)})` },
  ];

  return (
    <Card className="border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Gradient accent bar */}
      <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

      <CardHeader className="pb-4 pt-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 p-2.5 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-lg font-bold">Profit Margin &amp; Unit Economics Simulator</CardTitle>
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 text-[10px] font-bold tracking-wide">
                  Kalkulator Laba
                </span>
              </div>
              <CardDescription className="text-xs mt-1">
                Hitung kelayakan finansial, laba bersih riil, dan titik impas (breakeven) setelah potongan fee &amp; iklan.
              </CardDescription>
            </div>
          </div>

          <div className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 self-start sm:self-auto ${
            netMarginPct >= 20 
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800" 
              : netMarginPct > 5 
              ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800"
              : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800"
          }`}>
            {netMarginPct >= 20 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
            <span>{netMarginPct >= 20 ? "Margin Sehat (20%+)" : netMarginPct > 5 ? "Moderat (Tipis)" : "Bahaya (Rugi)"}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* KPI Outcome Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Laba Bersih per Unit", value: formatPrice(netProfit), detail: "Net Profit in pocket", color: netProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600" },
            { label: "Net Profit Margin", value: `${netMarginPct.toFixed(1)}%`, detail: "Dari harga jual akhir", color: netMarginPct >= 15 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400" },
            { label: "Titik Impas (Breakeven)", value: formatPrice(breakevenPrice), detail: "Harga batas bawah aman", color: "text-slate-900 dark:text-white" },
            { label: "Return on Capital (ROI)", value: `${roiPct.toFixed(0)}%`, detail: "Pengembalian dari modal HPP", color: "text-indigo-600 dark:text-indigo-400" },
          ].map((kpi, i) => (
            <div key={i} className="rounded-xl bg-slate-50/80 dark:bg-slate-900/60 p-4 border border-slate-100 dark:border-slate-800/80 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">{kpi.label}</span>
              <span className={`text-2xl font-bold block ${kpi.color}`}>{kpi.value}</span>
              <p className="text-[11px] text-slate-400">{kpi.detail}</p>
            </div>
          ))}
        </div>

        {/* Input Controls Grid */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
            <ArrowUpRight className="w-3.5 h-3.5 text-teal-500" />
            Parameter Input Keuangan
          </h4>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {inputs.map((inp, i) => (
              <div key={i} className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>{inp.label}</span>
                  <span className={`font-bold ${inp.displayColor}`}>
                    {inp.suffix || formatPrice(inp.value)}
                  </span>
                </label>
                <Input
                  type="number"
                  value={inp.value}
                  onChange={(e) => inp.setter(Math.max(0, Number(e.target.value)))}
                  className="h-10 text-xs bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Visual Stacked Bar: Anatomi Harga Jual */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
            <span className="font-semibold">Anatomi Alokasi Harga Jual (100%)</span>
            <span className={`font-bold ${netMarginPct >= 15 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"}`}>
              Margin: {netMarginPct.toFixed(1)}% ({formatPrice(netProfit)})
            </span>
          </div>

          <div className="h-7 w-full rounded-xl overflow-hidden flex bg-slate-100 dark:bg-slate-800 shadow-inner">
            {costBreakdown.map((item, idx) => (
              <div
                key={idx}
                className={`${item.color} h-full transition-all duration-500 relative group flex items-center justify-center`}
                style={{ width: `${Math.min(100, Math.max(0, item.pct))}%` }}
                title={`${item.label}: ${formatPrice(item.amount)} (${item.pct}%)`}
              >
                {item.pct > 7 && (
                  <span className="text-[10px] font-bold text-white px-1 truncate">
                    {item.pct}%
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-slate-500 pt-1">
            {costBreakdown.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${item.dotColor}`} />
                <span>{item.label}: <strong className="text-slate-800 dark:text-slate-200">{formatPrice(item.amount)}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
