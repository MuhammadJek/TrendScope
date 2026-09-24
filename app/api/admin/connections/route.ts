import { NextRequest, NextResponse } from "next/server";
import { getProviderInstance, ProviderId } from "@/lib/providers/registry";
import { encryptSecret } from "@/lib/encryption";
import { isSuperAdmin } from "@/lib/super-admin-auth";

// Note: In a full Prisma setup, you'd import `prisma` here to save the connection to the DB.
// import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  // 1. Security Check
  const authed = await isSuperAdmin();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { providerId, credentials, name } = body;

    if (!providerId || !credentials) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2. Encrypt Credentials for secure testing and storage
    const credentialsJson = JSON.stringify(credentials);
    const encryptedCredentials = encryptSecret(credentialsJson);

    // 3. Initialize Provider and Test
    const provider = getProviderInstance(providerId, encryptedCredentials);
    const testResult = await provider.testConnection();

    if (!testResult.success) {
      return NextResponse.json({ 
        success: false, 
        message: testResult.message,
        latencyMs: testResult.latencyMs
      }, { status: 400 });
    }

    // 4. Save to Database (Mocked for now since Prisma isn't fully migrated yet)
    /*
    await prisma.apiConnection.upsert({
      where: { provider: providerId },
      update: {
        encryptedCredentials,
        status: "CONNECTED",
        lastTestedAt: new Date(),
        lastSuccessAt: new Date(),
      },
      create: {
        provider: providerId,
        name: name || provider.name,
        status: "CONNECTED",
        encryptedCredentials,
        lastTestedAt: new Date(),
        lastSuccessAt: new Date(),
      }
    });
    */

    return NextResponse.json({ 
      success: true, 
      message: testResult.message,
      provider: testResult.provider,
      latencyMs: testResult.latencyMs
    });

  } catch (error: any) {
    console.error("API Connection error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

