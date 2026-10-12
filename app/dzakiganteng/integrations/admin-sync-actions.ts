"use server";

import prisma from "@/lib/prisma";
import { isSuperAdmin } from "@/lib/super-admin-auth";
import { trackKeywordAction } from "@/lib/market-actions";
import { revalidatePath } from "next/cache";

export interface SyncRunReport {
  success: boolean;
  message: string;
  processedCount: number;
  failedCount: number;
  errors: string[];
  executionTimeMs: number;
  completedAt: string;
}

export async function triggerAuthorizedManualSync(): Promise<SyncRunReport> {
  const authorized = await isSuperAdmin();
  if (!authorized) {
    return {
      success: false,
      message: "Unauthorized: Super Admin credentials required.",
      processedCount: 0,
      failedCount: 0,
      errors: ["403 Forbidden: Insufficient administrative privileges."],
      executionTimeMs: 0,
      completedAt: new Date().toISOString(),
    };
  }

  const startTime = Date.now();
  const errors: string[] = [];
  let processed = 0;
  let failed = 0;

  try {
    const activeKeywords = await prisma.marketKeyword.findMany({
      take: 10,
      orderBy: { lastUpdated: "asc" },
    });

    for (const kw of activeKeywords) {
      try {
        const res = await trackKeywordAction(kw.keyword, kw.platform);
        if (res.error) {
          failed++;
          errors.push(`${kw.platform}/${kw.keyword}: ${res.error}`);
        } else {
          processed++;
        }
      } catch (err: any) {
        failed++;
        errors.push(`${kw.platform}/${kw.keyword}: ${err.message}`);
      }
    }

    revalidatePath("/dzakiganteng/integrations");
    revalidatePath("/dashboard");

    return {
      success: failed === 0,
      message: `Completed synchronization of ${processed} tracked entities (${failed} warnings/failures).`,
      processedCount: processed,
      failedCount: failed,
      errors,
      executionTimeMs: Date.now() - startTime,
      completedAt: new Date().toISOString(),
    };
  } catch (err: any) {
    return {
      success: false,
      message: "Fatal pipeline error during manual synchronization.",
      processedCount: processed,
      failedCount: failed + 1,
      errors: [err.message || "Unknown error"],
      executionTimeMs: Date.now() - startTime,
      completedAt: new Date().toISOString(),
    };
  }
}

export async function getAdminSystemHealthMetrics() {
  const authorized = await isSuperAdmin();
  if (!authorized) return null;

  const [
    totalKeywords,
    totalProducts,
    totalSnapshots,
    totalOpportunities,
    lastUpdatedKeyword,
  ] = await Promise.all([
    prisma.marketKeyword.count(),
    prisma.marketProduct.count(),
    prisma.marketSnapshot.count(),
    prisma.marketOpportunity.count(),
    prisma.marketKeyword.findFirst({
      orderBy: { lastUpdated: "desc" },
      select: { lastUpdated: true },
    }),
  ]);

  return {
    totalKeywords,
    totalProducts,
    totalSnapshots,
    totalOpportunities,
    lastSyncTime: lastUpdatedKeyword?.lastUpdated || null,
  };
}
