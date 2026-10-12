"use client";

import { useState } from "react";
import { 
  BellRing, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  PackageX, 
  Check, 
  Settings2, 
  Sliders, 
  Zap,
  Mail,
  ShieldAlert,
  BellOff,
  Radio,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SmartMarketAlertsProps {
  keyword: string;
  platform: string;
}

export function SmartMarketAlerts({
  keyword,
  platform,
}: SmartMarketAlertsProps) {
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [priceDropThreshold, setPriceDropThreshold] = useState(15);
  const [demandSpikeThreshold, setDemandSpikeThreshold] = useState(50);
  const [alertOOS, setAlertOOS] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const activeAlerts = [
    {
      id: "a1",
      type: "PRICE_WAR",
      severity: "urgent" as const,
      title: "Peringatan Perang Harga Terdeteksi",
      description: "3 kompetitor di Top 10 memotong harga sebesar 18% dalam 48 jam terakhir untuk mengejar kuota akhir bulan.",
      timestamp: "2 jam yang lalu",
      action: "Tinjau Sweet Spot Radar untuk menjaga margin aman tanpa ikut banting harga.",
      impact: "-18% Price Drop",
    },
    {
      id: "a2",
      type: "DEMAND_SPIKE",
      severity: "high" as const,
      title: `Lonjakan Volume Pencarian (+120%)`,
      description: `Minat pasar terhadap "${keyword}" mengalami percepatan pertumbuhan akibat gelombang tren video baru di media sosial.`,
      timestamp: "Kemarin, 14:20",
      action: "Pastikan stok ketersediaan produk mencukupi 3 minggu ke depan untuk menghindari OOS.",
      impact: "+120% Search Growth",
    },
    {
      id: "a3",
      type: "COMPETITOR_OOS",
      severity: "high" as const,
      title: "Peluang Emas: Kompetitor #2 Kehabisan Stok",
      description: "Listing kompetitor teratas dengan estimasi 45 unit/hari berstatus Out of Stock.",
      timestamp: "3 hari yang lalu",
      action: "Segera naikkan bid iklan target ASIN/produk untuk menyerap limpahan pembeli.",
      impact: "45 Unit/Hari Bocor",
    },
  ];

  return (
    <Card className="border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Gradient accent bar */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500" />

      <CardHeader className="pb-4 pt-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 p-2.5 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/50">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-lg font-bold">Automated Smart Alerts &amp; Anomaly Detection</CardTitle>
                <span className="rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 text-[10px] font-bold tracking-wide">
                  Autonomous Radar
                </span>
              </div>
              <CardDescription className="text-xs mt-1">
                Sistem peringatan dini otonom saat terjadi perang harga mendadak, lonjakan tren, atau gangguan stok kompetitor.
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="gap-1.5 text-xs h-9 border-slate-200 dark:border-slate-700"
            >
              <Settings2 className="w-3.5 h-3.5" />
              {showSettings ? "Tutup Aturan" : "Kustomisasi Threshold"}
            </Button>
            <Button
              size="sm"
              onClick={() => setIsSubscribed(!isSubscribed)}
              className={`gap-1.5 text-xs h-9 transition-all ${
                isSubscribed 
                  ? "bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-sm" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isSubscribed ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                  Alerts Aktif
                </>
              ) : (
                <>
                  <BellOff className="w-3.5 h-3.5" />
                  Aktifkan Notifikasi
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* KPI Alert Summary Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Status Engine Radar", value: isSubscribed ? "Aktif 24/7" : "Non-aktif", sub: "Polling berkala", detail: "Memantau perubahan listing", color: isSubscribed ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400" },
            { label: "Anomali Aktif", value: `${activeAlerts.length} Sinyal`, sub: "Baru", detail: "Perlu perhatian segera", color: "text-rose-600 dark:text-rose-400" },
            { label: "Tingkat Urgensi", value: "Kritis", sub: "Perang Harga", detail: "Dampak langsung ke ranking", color: "text-amber-600 dark:text-amber-400" },
            { label: "Kanal Notifikasi", value: "Web & Email", sub: "Push", detail: "Terkirim ke akun terdaftar", color: "text-indigo-600 dark:text-indigo-400" },
          ].map((kpi, i) => (
            <div key={i} className="rounded-xl bg-slate-50/80 dark:bg-slate-900/60 p-4 border border-slate-100 dark:border-slate-800/80 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">{kpi.label}</span>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</span>
                <span className="text-xs text-slate-500">{kpi.sub}</span>
              </div>
              <p className="text-[11px] text-slate-400">{kpi.detail}</p>
            </div>
          ))}
        </div>

        {/* Settings Box (Collapsible) */}
        {showSettings && (
          <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/20 dark:to-slate-900/80 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                Kustomisasi Batas Toleransi Anomali (Trigger Thresholds)
              </h4>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded-md">
                Tersimpan Otomatis
              </span>
            </div>

            <div className="grid gap-5 sm:grid-cols-3 text-xs">
              <div className="space-y-2 bg-white dark:bg-slate-900/80 p-3.5 rounded-xl border border-blue-100 dark:border-blue-900/40">
                <label className="text-slate-800 dark:text-slate-200 font-semibold block">
                  Alert Diskon Perang Harga:
                </label>
                <div className="flex items-center gap-2.5">
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={priceDropThreshold}
                    onChange={(e) => setPriceDropThreshold(Number(e.target.value))}
                    className="w-full accent-blue-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <span className="font-bold text-sm text-blue-600 dark:text-blue-400 min-w-[36px] text-right">
                    {priceDropThreshold}%
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block">Kirim notifikasi jika kompetitor pangkas harga &ge; {priceDropThreshold}%</span>
              </div>

              <div className="space-y-2 bg-white dark:bg-slate-900/80 p-3.5 rounded-xl border border-blue-100 dark:border-blue-900/40">
                <label className="text-slate-800 dark:text-slate-200 font-semibold block">
                  Alert Ledakan Permintaan (Spike):
                </label>
                <div className="flex items-center gap-2.5">
                  <input
                    type="range"
                    min="20"
                    max="200"
                    step="10"
                    value={demandSpikeThreshold}
                    onChange={(e) => setDemandSpikeThreshold(Number(e.target.value))}
                    className="w-full accent-blue-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <span className="font-bold text-sm text-blue-600 dark:text-blue-400 min-w-[46px] text-right">
                    +{demandSpikeThreshold}%
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block">Kirim notifikasi jika search volume naik &ge; {demandSpikeThreshold}%</span>
              </div>

              <div className="space-y-2 bg-white dark:bg-slate-900/80 p-3.5 rounded-xl border border-blue-100 dark:border-blue-900/40">
                <label className="text-slate-800 dark:text-slate-200 font-semibold block">
                  Alert Kehabisan Stok Kompetitor:
                </label>
                <div className="flex items-center gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    checked={alertOOS}
                    onChange={(e) => setAlertOOS(e.target.checked)}
                    id="chk-oos"
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                  <label htmlFor="chk-oos" className="cursor-pointer font-semibold text-slate-800 dark:text-slate-200 text-xs">
                    Kirim sinyal saat Top 10 OOS
                  </label>
                </div>
                <span className="text-[11px] text-slate-500 block">Peluang merebut traffic dan ranking penjualan</span>
              </div>
            </div>
          </div>
        )}

        {/* Live Detected Alerts Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Radio className="w-4 h-4 text-blue-500" />
              Sinyal Anomali Terdeteksi Terkini ({activeAlerts.length})
            </h4>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Realtime Active
            </span>
          </div>

          <div className="grid gap-3.5">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 shadow-sm hover:shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl shrink-0 ${
                      alert.type === "PRICE_WAR"
                        ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
                        : alert.type === "DEMAND_SPIKE"
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
                        : "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
                    }`}>
                      {alert.type === "PRICE_WAR" ? (
                        <TrendingDown className="w-4 h-4" />
                      ) : alert.type === "DEMAND_SPIKE" ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <PackageX className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                        {alert.title}
                      </h5>
                      <span className="text-[10px] text-slate-400">{alert.timestamp}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                      {alert.impact}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg tracking-wide ${
                      alert.severity === "urgent"
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                        : alert.severity === "high"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400"
                    }`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-11">
                  {alert.description}
                </p>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs pl-11">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Tindakan Strategis: <strong className="text-slate-900 dark:text-white">{alert.action}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
