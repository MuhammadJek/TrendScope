import { Queue, Worker, Job } from "bullmq";
import { redis } from "./redis";
import { getProviderInstance } from "../providers/registry";
import prisma from "../prisma"; 

export const SYNC_QUEUE_NAME = "api-data-sync";

// Define the queue
export const syncQueue = new Queue(SYNC_QUEUE_NAME, {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000 * 60, // 1 minute
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export interface SyncJobData {
  entityId: string;     // e.g., TrackedEntity.id
  providerId: string;   // e.g., GOOGLE_ADS
  type: string;         // KEYWORD, PRODUCT, etc.
  query: string;        // "running shoes" or ASIN
}

// Helper to enqueue jobs
export async function enqueueSync(data: SyncJobData) {
  return syncQueue.add(`sync-${data.type}-${data.entityId}`, data);
}

// -----------------------------------------------------------------------------
// WORKER DEFINITION
// In Next.js, workers should ideally be run in a separate custom server or 
// long-running process. For simplicity in Vercel/serverless environments, 
// a Cron endpoint triggering `enqueueSync` is usually preferred, but if this 
// is running on a traditional server (Docker/VPS), the Worker runs here.
// -----------------------------------------------------------------------------

export const syncWorker = new Worker(
  SYNC_QUEUE_NAME,
  async (job: Job<SyncJobData>) => {
    const { entityId, providerId, type, query } = job.data;
    console.log(`[Job ${job.id}] Syncing ${type} "${query}" via ${providerId}...`);

    // 1. Fetch Provider Credentials from DB
    const connection = await prisma.apiConnection.findUnique({
      where: { provider: providerId },
    });

    if (!connection || connection.status !== "CONNECTED") {
      throw new Error(`Provider ${providerId} is not connected.`);
    }

    // 2. Instantiate Provider
    const provider = getProviderInstance(providerId, connection.encryptedCredentials);

    // 3. Execute Sync Strategy based on Entity Type
    if (type === "KEYWORD" && provider.supportsKeywordResearch === "SUPPORTED") {
      const results = await provider.searchKeywords!({ keyword: query });
      
      // 4. Save results to Cache / Analytics DB
      for (const res of results) {
        await prisma.keywordMetric.create({
          data: {
            keyword: res.keyword,
            searchVolume: res.searchVolume,
            competition: res.competition,
            cpc: res.averageCpc,
            source: res.source,
            collectedAt: res.collectedAt,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days cache
          }
        });
      }
      return results;
    }

    throw new Error(`Unsupported sync operation: ${type} on ${providerId}`);
  },
  { connection: redis }
);

syncWorker.on("completed", (job) => {
  console.log(`[Worker] Job ${job.id} completed successfully.`);
});

syncWorker.on("failed", (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed with error: ${err.message}`);
});

