import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const connections = await prisma.apiConnection.findMany();
  console.log("API Connections:");
  console.log(connections);

  const tracked = await prisma.trackedEntity.findMany();
  console.log("\nTracked Entities:");
  console.log(tracked);
}

main().catch(console.error).finally(() => prisma.$disconnect());

