import { NextRequest, NextResponse } from "next/server";
import { enqueueSync } from "@/lib/queue/sync-queue";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  // 1. Authenticate user
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { entityId, providerId, type, query } = body;

    if (!entityId || !providerId || !type || !query) {
      return NextResponse.json({ error: "Missing required fields for sync job" }, { status: 400 });
    }

    // 2. Queue the job in BullMQ
    const job = await enqueueSync({
      entityId,
      providerId,
      type,
      query
    });

    return NextResponse.json({ 
      success: true, 
      message: "Sync job enqueued",
      jobId: job.id 
    });

  } catch (error: any) {
    console.error("Failed to enqueue sync job:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

