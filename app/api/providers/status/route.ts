import { NextResponse } from "next/server";
import { getAuthedUserAndWorkspace } from "@/lib/workspace";
import { YouTubeProvider } from "@/lib/providers/youtube-provider";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { user } = await getAuthedUserAndWorkspace();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const statuses = [];
    const ytKey = process.env.YOUTUBE_API_KEY;
    if (ytKey) {
      const ytProvider = new YouTubeProvider(ytKey);
      const ytHealth = await ytProvider.checkYouTubeHealth();
      statuses.push({
        id: "YOUTUBE",
        name: "YouTube Data API",
        status: ytHealth.status,
        message: ytHealth.message
      });
    } else {
      statuses.push({
        id: "YOUTUBE",
        name: "YouTube Data API",
        status: "NOT_CONFIGURED",
        message: "Missing YOUTUBE_API_KEY in .env"
      });
    }
    statuses.push({
      id: "WIKIPEDIA",
      name: "Wikimedia REST API",
      status: "CONNECTED",
      message: "Public access OK"
    });
    const dbConnections = await prisma.apiConnection.findMany({
      select: { id: true, name: true, status: true, lastErrorMessage: true }
    });
    for (const conn of dbConnections) {
      statuses.push({
        id: conn.id,
        name: conn.name,
        status: conn.status === "CONNECTED" ? "CONNECTED" : "ERROR",
        message: conn.lastErrorMessage || "OK"
      });
    }
    return NextResponse.json({ statuses });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
