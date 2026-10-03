import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { trackKeywordAction } from "@/lib/market-actions";

export async function GET(request: Request) {
  // 1. Verifikasi Token Keamanan Cron Job (Opsional, tapi sangat disarankan untuk Production)
  // Untuk Vercel Cron, biasanya dikirim header `Authorization: Bearer <CRON_SECRET>`
  const authHeader = request.headers.get('authorization');
  
  // Jika di lokal (dev) atau tidak pakai secret, kita bypass dulu, atau gunakan env:
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  console.log("[CRON] Starting Daily Market Sync...");

  try {
    // 2. Ambil semua keyword yang saat ini dilacak oleh pengguna
    const keywords = await prisma.marketKeyword.findMany();

    if (keywords.length === 0) {
      return NextResponse.json({ success: true, message: "No keywords to track." });
    }

    let successCount = 0;
    let failCount = 0;

    // 3. Loop satu per satu untuk melakukan sinkronisasi data 
    // Kita jalankan secara berurutan (sequential) agar tidak terkena Rate Limit dari API pihak ketiga (Amazon/Shopee)
    for (const kw of keywords) {
      try {
        console.log(`[CRON] Fetching data for: ${kw.keyword} (${kw.platform})`);
        
        // Panggil action yang sama dengan saat tombol "Track" ditekan!
        const result = await trackKeywordAction(kw.keyword, kw.platform);
        
        if (result.success) {
          successCount++;
        } else {
          console.error(`[CRON] Failed for ${kw.keyword}:`, result.error);
          failCount++;
        }

        // Jeda waktu 2 detik antar request agar aman dari limit RapidAPI / scraping
        await new Promise((resolve) => setTimeout(resolve, 2000));

      } catch (err: any) {
        console.error(`[CRON] Exception for ${kw.keyword}:`, err);
        failCount++;
      }
    }

    console.log(`[CRON] Sync Completed. Success: ${successCount}, Failed: ${failCount}`);
    return NextResponse.json({
      success: true,
      message: `Daily market sync completed.`,
      stats: { success: successCount, failed: failCount }
    });

  } catch (error: any) {
    console.error("[CRON] Fatal Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

