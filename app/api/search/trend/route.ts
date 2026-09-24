import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getAuthedUserAndWorkspace } from "@/lib/workspace";
import { WikipediaProvider } from "@/lib/providers/wikipedia-provider";

const trendSchema = z.object({
  keyword: z.string().min(1).max(100),
  language: z.string().default("id"),
  autoFind: z.boolean().default(true),
});

export async function POST(req: Request) {
  try {
    const { user, workspace } = await getAuthedUserAndWorkspace();
    if (!user) return NextResponse.json({ error: "Unauthorized", code: "UNAUTHENTICATED" }, { status: 401 });
    if (!workspace) return NextResponse.json({ error: "No workspace", code: "NO_WORKSPACE" }, { status: 400 });

    const body = await req.json();
    const input = trendSchema.parse(body);
    const provider = new WikipediaProvider();
    
    let articleTitle = input.keyword;
    if (input.autoFind) {
      const searchRes = await provider.searchWikipediaArticle(input.keyword, input.language);
      if (searchRes.articleTitle) articleTitle = searchRes.articleTitle;
      else return NextResponse.json({
          keyword: input.keyword, article: null, language: input.language,
          fromCache: false, fetchedAt: new Date().toISOString(), totalViews: 0,
          peakViews: 0, peakDate: null, averageDailyViews: 0, dataPoints: [],
          provider: "WIKIPEDIA", dataStatus: "NOT_FOUND", articleUrl: "",
          disclaimer: "Article not found",
      });
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const startStr = startDate.toISOString().split("T")[0].replace(/-/g, "");
    const endStr = endDate.toISOString().split("T")[0].replace(/-/g, "");

    const pageviews = await provider.getWikipediaPageviews(articleTitle, input.language, startStr, endStr);
    let returnPoints = pageviews.dataPoints;

    if (user.role !== "PRO_USER" && user.role !== "SUPER_ADMIN") {
        returnPoints = returnPoints.slice(-7);
    }
    
    const gatedPageviews = { ...pageviews, dataPoints: returnPoints, isPro: user.role === "PRO_USER" || user.role === "SUPER_ADMIN" };

    await prisma.savedSearch.create({
      data: { workspaceId: workspace.id, keyword: input.keyword, language: input.language, provider: "WIKIPEDIA", resultCount: gatedPageviews.dataPoints.length }
    }).catch(() => {});

    return NextResponse.json(gatedPageviews);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to search trend", code: "INTERNAL_ERROR" }, { status: 500 });
  }
}
