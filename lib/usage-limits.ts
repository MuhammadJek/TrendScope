import prisma from "@/lib/prisma";

export const SAAS_PLANS = {
  FREE_USER: {
    maxKeywords: 5,
    maxProducts: 3,
    maxCompetitors: 1,
    refreshIntervalHours: 72, // limited refresh (3 days)
  },
  PRO_USER: {
    maxKeywords: 100,
    maxProducts: 50,
    maxCompetitors: 20,
    refreshIntervalHours: 24, // daily refresh
  },
  SUPER_ADMIN: {
    maxKeywords: 9999,
    maxProducts: 9999,
    maxCompetitors: 9999,
    refreshIntervalHours: 1,
  },
};

export type Role = keyof typeof SAAS_PLANS;

export async function getUserUsageStats(userId: string) {
  // Count current tracked entities for this user
  const [keywordsCount, productsCount, competitorsCount] = await Promise.all([
    prisma.trackedEntity.count({ where: { userId, type: "KEYWORD" } }),
    prisma.trackedEntity.count({ where: { userId, type: "PRODUCT" } }),
    prisma.trackedEntity.count({ where: { userId, type: "COMPETITOR" } }),
  ]);

  return {
    keywords: keywordsCount,
    products: productsCount,
    competitors: competitorsCount,
  };
}

export async function checkKeywordLimit(userId: string, userRole: string = "FREE_USER"): Promise<boolean> {
  const role = (SAAS_PLANS[userRole as Role] ? userRole : "FREE_USER") as Role;
  const limit = SAAS_PLANS[role].maxKeywords;
  
  const currentCount = await prisma.trackedEntity.count({
    where: { userId, type: "KEYWORD" }
  });

  return currentCount < limit;
}

export async function checkProductLimit(userId: string, userRole: string = "FREE_USER"): Promise<boolean> {
  const role = (SAAS_PLANS[userRole as Role] ? userRole : "FREE_USER") as Role;
  const limit = SAAS_PLANS[role].maxProducts;
  
  const currentCount = await prisma.trackedEntity.count({
    where: { userId, type: "PRODUCT" }
  });

  return currentCount < limit;
}

export async function checkCompetitorLimit(userId: string, userRole: string = "FREE_USER"): Promise<boolean> {
  const role = (SAAS_PLANS[userRole as Role] ? userRole : "FREE_USER") as Role;
  const limit = SAAS_PLANS[role].maxCompetitors;
  
  const currentCount = await prisma.trackedEntity.count({
    where: { userId, type: "COMPETITOR" }
  });

  return currentCount < limit;
}

