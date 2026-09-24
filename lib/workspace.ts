"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function getCurrentWorkspace() {
  const { workspace } = await getAuthedUserAndWorkspace();
  return workspace;
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
    // Auto-create a workspace for the user if they don't have one (e.g. existing users)
    const newWorkspace = await prisma.workspace.create({
      data: {
        name: user.name ? user.name + "'s Workspace" : "My Workspace",
        slug: user.id.slice(0, 8),
        members: {
          create: {
            userId: user.id,
            role: "OWNER"
          }
        }
      }
    });
    return { user, workspace: newWorkspace };
  }
  
  return { user, workspace: user.workspaceMembers[0].workspace };
}
