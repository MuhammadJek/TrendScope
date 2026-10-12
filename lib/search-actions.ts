"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Helper to get or create a default workspace for the user
async function getDefaultWorkspace(userId: string) {
  // Check if user is in any workspace
  const membership = await prisma.workspaceMember.findFirst({
    where: { userId },
    include: { workspace: true },
  });

  if (membership) {
    return membership.workspace;
  }

  // If no workspace, create a default one
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const workspace = await prisma.workspace.create({
    data: {
      name: `Personal Workspace`,
      slug: `personal-${userId.slice(0, 8)}`,
      members: {
        create: {
          userId,
          role: "OWNER",
        },
      },
    },
  });

  return workspace;
}

export async function toggleSavedSearch(keyword: string, provider: string = "TIKTOK") {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const workspace = await getDefaultWorkspace(session.user.id);

  // Check if already saved
  const existing = await prisma.savedSearch.findFirst({
    where: {
      workspaceId: workspace.id,
      keyword: keyword.toLowerCase(),
      provider,
    },
  });

  if (existing) {
    // Delete if exists
    await prisma.savedSearch.delete({
      where: { id: existing.id },
    });
    revalidatePath(`/research/tiktok/result/${keyword}`);
    revalidatePath('/dashboard/saved-searches');
    return { saved: false };
  } else {
    // Create if not exists
    await prisma.savedSearch.create({
      data: {
        workspaceId: workspace.id,
        keyword: keyword.toLowerCase(),
        provider,
      },
    });
    revalidatePath(`/research/tiktok/result/${keyword}`);
    revalidatePath('/dashboard/saved-searches');
    return { saved: true };
  }
}

export async function getSavedSearches() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const workspace = await getDefaultWorkspace(session.user.id);

  const searches = await prisma.savedSearch.findMany({
    where: {
      workspaceId: workspace.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return searches;
}

export async function checkIsSaved(keyword: string, provider: string = "TIKTOK") {
  const session = await auth();
  if (!session?.user?.id) {
    return false;
  }

  const workspace = await getDefaultWorkspace(session.user.id);

  const existing = await prisma.savedSearch.findFirst({
    where: {
      workspaceId: workspace.id,
      keyword: keyword.toLowerCase(),
      provider,
    },
  });

  return !!existing;
}

