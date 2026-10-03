"use server";

import { GoogleGenAI } from "@google/genai";

/**
 * AI Market Insights — Google Gemini API
 *
 * Menganalisis data produk kompetitor dan menghasilkan
 * narasi strategi bisnis otomatis menggunakan Gemini Flash.
 *
 * ENV: GEMINI_API_KEY
 */

interface ProductData {
  title: string;
  price: number;
  historicalSold: number;
  monthlySold: number;
}

export async function generateMarketInsight(
  keyword: string,
  platform: string,
  products: ProductData[],
  avgPrice: number,
  totalProducts: number
): Promise<{ success: boolean; insight?: string; error?: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      error:
        "GEMINI_API_KEY belum diatur di .env. Dapatkan API Key gratis di https://aistudio.google.com/apikey",
    };
  }

  if (!products || products.length === 0) {
    return {
      success: false,
      error: "Tidak ada data produk untuk dianalisis.",
    };
  }

  try {
    const ai = new GoogleGenAI({ vertexai: false, apiKey });

    // Siapkan data ringkas untuk konteks AI (top 20 agar hemat token)
    const topProducts = products.slice(0, 20).map((p, i) => ({
      rank: i + 1,
      title: p.title.substring(0, 80),
      price: p.price,
      sold: p.historicalSold,
      monthly: p.monthlySold,
    }));

    const currencyLabel = platform === "SHOPEE" ? "Rupiah (IDR)" : "USD";

    const prompt = `Kamu adalah Market Intelligence Analyst profesional. Analisis data pasar e-commerce berikut dan berikan insight strategi bisnis.

KONTEKS:
- Platform: ${platform}
- Keyword pencarian: "${keyword}"
- Total produk ditemukan: ${totalProducts}
- Rata-rata harga kompetitor: ${avgPrice.toFixed(2)} ${currencyLabel}

DATA TOP 20 PRODUK KOMPETITOR (diurutkan berdasarkan penjualan tertinggi):
${JSON.stringify(topProducts, null, 2)}

TUGAS: Berikan analisis strategi dalam Bahasa Indonesia yang mencakup:

1. **📊 Ringkasan Pasar** — Seberapa kompetitif pasar ini? Berapa range harga yang dominan?
2. **💰 Strategi Harga** — Di range harga berapa sebaiknya masuk? Apakah ada sweet spot?
3. **🏆 Pola Pemenang** — Apa kesamaan dari produk-produk terlaris? (dari judul/nama produk)
4. **⚠️ Risiko & Peluang** — Apa yang harus diwaspadai dan peluang yang bisa diambil?
5. **🎯 Rekomendasi Aksi** — 3 langkah konkret yang bisa dilakukan seller baru.

Format jawaban dalam Markdown yang rapi. Jangan terlalu panjang, maksimal 400 kata. Fokus pada insight yang actionable.`;

    let text = "";
    let lastError = null;
    const modelsToTry = ["gemini-3.8-flash", "gemini-3.8-flash-lite"];

    for (const model of modelsToTry) {
      try {
        console.log(`[AI Insight] Mencoba model ${model}...`);
        const response = await ai.models.generateContent({
          model: model,
          contents: prompt,
        });
        text = response.text || "";
        if (text) break; // Berhasil, keluar dari loop
      } catch (e: any) {
        lastError = e;
        console.warn(`[AI Insight] Model ${model} gagal:`, e.message);
        // Jika model sibuk (503), tunggu 2 detik sebelum coba model berikutnya
        if (e.message?.includes("503") || e.message?.includes("UNAVAILABLE")) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          // Jika error lain (misal API key salah), langsung keluar
          throw e;
        }
      }
    }

    if (!text && lastError) {
      throw lastError;
    }

    return { success: true, insight: text };
  } catch (error: any) {
    console.error("[AI Insight] Error:", error.message);
    return {
      success: false,
      error: `Gagal menghasilkan insight: ${error.message}`,
    };
  }
}
