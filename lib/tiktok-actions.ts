"use server";

import prisma from "@/lib/prisma";
import { fetchTiktokData, TiktokTrendResult } from "./tiktok-api";

export async function searchTiktokAction(keyword: string): Promise<TiktokTrendResult> {
  const normalizedKeyword = keyword.toLowerCase().trim();
  
  // Set date ke hari ini pada pukul 00:00:00 untuk caching harian
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Cek Cache di Database (Dengan pengaman Try-Catch)
  try {
    const existingTrend = await prisma.tiktokTrend.findUnique({
      where: {
        keyword_date: {
          keyword: normalizedKeyword,
          date: today
        }
      },
      include: {
        videos: {
          orderBy: { viewsCount: 'desc' }
        }
      }
    });

    // Jika sudah ada data hari ini, langsung return!
    if (existingTrend && existingTrend.videos.length > 0) {
      return {
        keyword: existingTrend.keyword,
        totalViewsEstimate: Number(existingTrend.totalViewsEstimate || 0),
        videos: existingTrend.videos.map((v: any) => ({
          videoId: v.videoId,
          authorName: v.authorName,
          description: v.description || "",
          viewsCount: Number(v.viewsCount || 0),
          likesCount: Number(v.likesCount || 0),
          sharesCount: Number(v.sharesCount || 0),
          commentsCount: Number(v.commentsCount || 0),
          url: v.url
        }))
      };
    }
  } catch (error) {
    console.warn("⚠️ Gagal membaca cache Prisma (mungkin karena belum di-generate):", error);
    // Lanjut ke API call jika database belum siap
  }

  // 2. Fetch dari API (atau Mock jika limit habis / API kosong)
  const freshData = await fetchTiktokData(normalizedKeyword);

  // 3. Simpan ke Database (Dengan perbaikan tipe BigInt)
  try {
    await prisma.tiktokTrend.create({
      data: {
        keyword: normalizedKeyword,
        // Konversi Number ke BigInt agar Prisma tidak protes
        totalViewsEstimate: BigInt(freshData.totalViewsEstimate),
        date: today,
        videos: {
          create: freshData.videos.map(v => ({
            videoId: v.videoId,
            authorName: v.authorName,
            description: v.description,
            // Semua metrik dikonversi ke BigInt sesuai Prisma schema
            viewsCount: BigInt(v.viewsCount),
            likesCount: BigInt(v.likesCount),
            sharesCount: BigInt(v.sharesCount),
            commentsCount: BigInt(v.commentsCount),
            url: v.url
          }))
        }
      }
    });
  } catch (error) {
    console.error("⚠️ Gagal menyimpan TiktokTrend ke Prisma:", error);
    // Kita tetap me-return freshData agar UI tetap berjalan normal
  }

  return freshData;
}
