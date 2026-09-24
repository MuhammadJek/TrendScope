"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function getCurrentWorkspace() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { workspaceMembers: { include: { workspace: true } } },
  });
  if (!user || user.workspaceMembers.length === 0) return null;
  return user.workspaceMembers[0].workspace;
}

export async function getAuthedUserAndWorkspace() {
  const session = await auth();
  if (!session?.user?.id) return { user: null, workspace: null };
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { workspaceMembers: { include: { workspace: true } } },
  });
  if (!user) return { user: null, workspace: null };
  if (user.workspaceMembers.length === 0) {
    return { user, workspace: null };
  }
  return { user, workspace: user.workspaceMembers[0].workspace };
}
