"use server";

import prisma from "@/lib/prisma";
import { encryptSecret } from "@/lib/encryption";
import { isSuperAdmin } from "@/lib/super-admin-auth";
import { revalidatePath } from "next/cache";

export async function saveApiConnectionAction(providerId: string, name: string, formData: FormData) {
  const authed = await isSuperAdmin();
  if (!authed) throw new Error("Unauthorized");

  // Extract credentials based on provider
  let rawCredentials = {};
  
  if (providerId === "ENVATO") {
    rawCredentials = {
      personalToken: formData.get("personalToken") as string,
    };
  } else if (providerId === "GOOGLE_ADS") {
    rawCredentials = {
      developerToken: formData.get("developerToken") as string,
      clientId: formData.get("clientId") as string,
      clientSecret: formData.get("clientSecret") as string,
      refreshToken: formData.get("refreshToken") as string,
      customerId: formData.get("customerId") as string,
    };
  } else if (providerId === "DATAFORSEO_TRENDS") {
    rawCredentials = {
      login: formData.get("login") as string,
      password: formData.get("password") as string,
    };
  } else if (providerId === "SHOPIFY") {
    rawCredentials = {
      shopDomain: formData.get("shopDomain") as string,
      adminToken: formData.get("adminToken") as string,
    };
  }

  // Encrypt the credentials JSON
  const encryptedCredentials = encryptSecret(JSON.stringify(rawCredentials));

  // Upsert into database
  await prisma.apiConnection.upsert({
    where: { provider: providerId },
    update: {
      encryptedCredentials,
      status: "CONNECTED",
    },
    create: {
      provider: providerId,
      name,
      status: "CONNECTED",
      encryptedCredentials,
    }
  });

  revalidatePath("/dzakiganteng/integrations");
  return { success: true };
}

export async function disconnectApiAction(providerId: string) {
  const authed = await isSuperAdmin();
  if (!authed) throw new Error("Unauthorized");

  await prisma.apiConnection.delete({
    where: { provider: providerId },
  }).catch(() => {}); // Ignore if it doesn't exist

  revalidatePath("/dzakiganteng/integrations");
  return { success: true };
}

