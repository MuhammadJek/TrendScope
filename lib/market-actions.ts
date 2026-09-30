"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function trackKeywordAction(keyword: string, platform: string) {
  if (!keyword || keyword.trim() === "") {
    return { error: "Kata kunci tidak boleh kosong." };
  }

  const cleanKeyword = keyword.trim().toLowerCase();

  try {
    // Upsert the keyword to avoid duplicates
    const marketKeyword = await prisma.marketKeyword.upsert({
      where: {
        keyword_platform: {
          keyword: cleanKeyword,
          platform: platform,
        },
      },
      update: {
        lastUpdated: new Date(),
      },
      create: {
        keyword: cleanKeyword,
        platform: platform,
      },
    });

    revalidatePath("/research");
    return { success: true, keyword: marketKeyword };
  } catch (error) {
    console.error("Gagal menyimpan keyword:", error);
    return { error: "Terjadi kesalahan saat menyimpan kata kunci." };
  }
}

export async function getTrackedKeywords() {
  try {
    const keywords = await prisma.marketKeyword.findMany({
      orderBy: { createdAt: "desc" },
    });
    return keywords;
  } catch (error) {
    console.error("Gagal mengambil tracked keywords:", error);
    return [];
  }
}
