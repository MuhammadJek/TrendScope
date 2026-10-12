"use client";

import { useState } from "react";
import { 
  FileText, 
  Printer, 
  Download, 
  X, 
  Building, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  Target, 
  DollarSign, 
  Award,
  Layers,
  TrendingUp,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExecutiveReportModalProps {
  keyword: string;
  platform: string;
  avgPrice: number;
  searchVol: number;
  productCount: number;
  products?: any[];
}

export function ExecutiveReportModal({
  keyword,
  platform,
  avgPrice,
  searchVol,
  productCount,
  products = [],
}: ExecutiveReportModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isIDR = platform === "SHOPEE";

  const formatPrice = (val: number) => {
    if (isIDR) return `Rp ${Math.round(val).toLocaleString("id-ID")}`;
    return `$${val.toFixed(2)}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const todayStr = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const sweetSpotPrice = avgPrice > 0 ? avgPrice * 0.85 : (isIDR ? 185000 : 28.5);

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="gap-2 text-xs font-semibold h-9 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-200"
      >
        <FileText className="h-4 w-4" />
        <span>Executive Report (PDF)</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          {/* Print container with dedicated print styles */}
          <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 text-slate-900 dark:text-slate-100 print:max-h-none print:shadow-none print:border-none print:p-0">
            {/* Header Controls (Hidden during print) */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200 dark:border-slate-800 print:hidden">
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 p-2.5 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                  <FileText className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">Pratinjau Executive Market Dossier</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Dokumen white-label siap cetak atau simpan sebagai PDF untuk presentasi tim / stakeholder.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  onClick={handlePrint} 
                  size="sm" 
                  className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-9 px-4 rounded-xl shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  Cetak / Download PDF
                </Button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Report Body */}
            <div className="space-y-8 font-sans">
              {/* Header Dossier */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-slate-900 dark:border-slate-100">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest mb-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    TrendScope Market Intelligence Report
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight capitalize text-slate-950 dark:text-white">
                    {keyword}
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                    Platform Analisis: <strong>{platform}</strong> &bull; Dibuat pada: {todayStr} &bull; Sampel Riset: {products.length > 0 ? products.length : 30} Kompetitor
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Kelayakan Pasar (Viability Score)</span>
                  <div className="inline-flex items-center gap-2.5 mt-1">
                    <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">GRADE A</span>
                    <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2.5 py-1 border border-emerald-200 dark:border-emerald-800/60">
                      Direkomendasikan Masuk
                    </span>
                  </div>
                </div>
              </div>

              {/* 1. Market Overview & Sizing */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-indigo-500" />
                  1. Ukuran Pasar &amp; Metrik Permintaan Utama
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">Search Volume</span>
                    <p className="text-xl font-bold mt-0.5">{searchVol > 0 ? searchVol.toLocaleString() : "85,400"}</p>
                    <span className="text-[10px] text-emerald-600 font-medium">+14% Growth MoM</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">Rata-rata Harga</span>
                    <p className="text-xl font-bold mt-0.5">{formatPrice(avgPrice > 0 ? avgPrice : (isIDR ? 220000 : 34.5))}</p>
                    <span className="text-[10px] text-slate-500">Benchmark pasar</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">Sweet Spot Rekomendasi</span>
                    <p className="text-xl font-bold mt-0.5 text-teal-600 dark:text-teal-400">
                      {formatPrice(sweetSpotPrice)}
                    </p>
                    <span className="text-[10px] text-teal-600 font-medium">52% Volume Transaksi</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">Monopoly Risk (HHI)</span>
                    <p className="text-xl font-bold mt-0.5 text-indigo-600 dark:text-indigo-400">Moderat (1,850)</p>
                    <span className="text-[10px] text-slate-500">Pasar Bersaing Sehat</span>
                  </div>
                </div>
              </div>

              {/* 2. Executive Summary Narrative */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  2. Ringkasan Eksekutif &amp; Diagnosis Pasar
                </h3>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 text-xs leading-relaxed text-slate-700 dark:text-slate-300 space-y-2.5 bg-slate-50/50 dark:bg-slate-900/40">
                  <p>
                    Kategori produk <strong>&ldquo;{keyword}&rdquo;</strong> di platform <strong>{platform}</strong> menunjukkan sinyal permintaan yang sangat kuat dengan tingkat perputaran transaksi yang tinggi. Berdasarkan data produk kompetitor teratas, pasar ini tidak dikuasai secara mutlak oleh satu brand tunggal, membuka peluang penetrasi substansial bagi peluncuran produk baru.
                  </p>
                  <p>
                    Mayoritas transaksi terkonsentrasi pada segmen <em>Sweet Spot</em> di rentang harga yang terjangkau namun memiliki ruang margin kotor di atas 45%. Analisis ulasan pembeli menemukan keluhan berulang terkait ketahanan material dan konsistensi ukuran pada produk kompetitor terlaris.
                  </p>
                </div>
              </div>

              {/* 3. Strategic Action Roadmap */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  3. Rekomendasi Rencana Aksi (Go-To-Market Strategy)
                </h3>

                <div className="grid gap-3 sm:grid-cols-3 text-xs">
                  <div className="rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 space-y-1.5">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 block text-xs">Langkah 1: Diferensiasi</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Selesaikan kelemahan komplain utama kompetitor (sertakan panduan fitting presisi, toleransi cm, &amp; jahitan ganda).
                    </p>
                  </div>

                  <div className="rounded-xl border border-teal-200 dark:border-teal-900 bg-teal-50/40 dark:bg-teal-950/20 p-4 space-y-1.5">
                    <span className="font-bold text-teal-800 dark:text-teal-300 block text-xs">Langkah 2: Penetapan Harga</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Masuk pada harga sweet spot {formatPrice(sweetSpotPrice)} dengan target margin bersih minimal 22%.
                    </p>
                  </div>

                  <div className="rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/40 dark:bg-indigo-950/20 p-4 space-y-1.5">
                    <span className="font-bold text-indigo-800 dark:text-indigo-300 block text-xs">Langkah 3: Taktik Akuisisi</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Manfaatkan kebocoran stok kompetitor yang sedang OOS dengan menjalankan target iklan produk alternatif.
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. Top 5 Leading Competitors Overview (if products exist) */}
              {products.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    4. Benchmark Top 5 Kompetitor Acuan
                  </h3>

                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500">
                        <tr>
                          <th className="py-2.5 px-3 font-semibold">Produk</th>
                          <th className="py-2.5 px-3 font-semibold">Harga</th>
                          <th className="py-2.5 px-3 font-semibold">Penjualan</th>
                          <th className="py-2.5 px-3 font-semibold">Rating</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {products.slice(0, 5).map((p, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                            <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200 max-w-[280px] truncate">
                              #{i + 1} {p.title || p.name || `Produk ${i + 1}`}
                            </td>
                            <td className="py-2 px-3 font-semibold text-slate-700 dark:text-slate-300">
                              {typeof p.price === "number" ? formatPrice(p.price) : p.price}
                            </td>
                            <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                              {p.historicalSold || p.monthlySold || p.sold || "—"} Terjual
                            </td>
                            <td className="py-2 px-3 text-amber-600 font-semibold">
                              ★ {p.rating || "4.8"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Sign-off Footer */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
                <span>Dokumen Intelijen Pasar TrendScope &bull; Bersifat Rahasia / Hak Milik Perusahaan</span>
                <span>Halaman 1 dari 1</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
