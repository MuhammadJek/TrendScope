import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getAuthedUserAndWorkspace } from "@/lib/workspace";
import { YouTubeProvider, YouTubeQuotaError } from "@/lib/providers/youtube-provider";

const youtubeSchema = z.object({
  query: z.string().min(1).max(100),
  regionCode: z.string().default("ID"),
  maxResults: z.number().min(1).max(50).default(20),
  order: z.enum(["relevance", "date", "viewCount", "rating"]).default("relevance"),
});

export async function POST(req: Request) {
  try {
    const { user, workspace } = await getAuthedUserAndWorkspace();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHENTICATED" }, { status: 401 });
    }
    if (!workspace) {
      return NextResponse.json({ error: "No workspace", code: "NO_WORKSPACE" }, { status: 400 });
    }

    const body = await req.json();
    const input = youtubeSchema.parse(body);

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "YouTube API Key not configured", code: "NOT_CONFIGURED" },
        { status: 500 }
      );
    }

    const provider = new YouTubeProvider(apiKey);
    const results = await provider.searchYouTubeVideos({
      query: input.query,
      regionCode: input.regionCode,
      maxResults: input.maxResults,
      order: input.order as any,
    });

    let returnVideos = results.videos;
    
    // Pro User Feature Gating
    if (user.role !== "PRO_USER" && user.role !== "SUPER_ADMIN") {
      returnVideos = returnVideos.slice(0, 3);
    }

    // Log search history
    await prisma.savedSearch.create({
      data: {
        workspaceId: workspace.id,
        keyword: input.query,
        country: input.regionCode,
        provider: "YOUTUBE",
        resultCount: returnVideos.length,
      }
    }).catch(() => {});

    // Save insights to cache
    for (const video of returnVideos) {
      await prisma.videoInsight.upsert({
        where: {
          workspaceId_keyword_videoId: {
            workspaceId: workspace.id,
            keyword: input.query.toLowerCase(),
            videoId: video.videoId
          }
        },
        create: {
          workspaceId: workspace.id,
          keyword: input.query.toLowerCase(),
          videoId: video.videoId,
          title: video.title,
          channelTitle: video.channelTitle,
          publishedAt: new Date(video.publishedAt),
          viewCount: video.metrics.viewCount ? BigInt(video.metrics.viewCount) : null,
          likeCount: video.metrics.likeCount ? BigInt(video.metrics.likeCount) : null,
          commentCount: video.metrics.commentCount ? BigInt(video.metrics.commentCount) : null,
          duration: video.duration,
          channelId: video.channelTitle,
          videoUrl: video.videoUrl,
          expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
          fetchedAt: new Date(),
        },
        update: {
          viewCount: video.metrics.viewCount ? BigInt(video.metrics.viewCount) : null,
          likeCount: video.metrics.likeCount ? BigInt(video.metrics.likeCount) : null,
          commentCount: video.metrics.commentCount ? BigInt(video.metrics.commentCount) : null,
          fetchedAt: new Date(),
        }
      }).catch(() => {});
    }

    return NextResponse.json({
      ...results,
      videos: returnVideos,
      isPro: user.role === "PRO_USER" || user.role === "SUPER_ADMIN"
    });
  } catch (error: any) {
    console.error("YouTube API error:", error);
    if (error instanceof YouTubeQuotaError) {
      return NextResponse.json(
        { error: "YouTube Quota Exceeded", code: "QUOTA_EXCEEDED" },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to search YouTube", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
