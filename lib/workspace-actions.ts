"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * Mendapatkan workspace yang sedang aktif beserta membernya.
 * Untuk prototype, kita asumsikan user memiliki 1 workspace atau mengambil yang pertama.
 */
export async function getActiveWorkspace() {
  const session = await auth();
  const user = session?.user;
  
  if (!user || !user.id) {
    throw new Error("Unauthorized");
  }

  // Cek apakah user memiliki workspace
  let workspaceMember = await prisma.workspaceMember.findFirst({
    where: { userId: user.id },
    include: {
      workspace: {
        include: {
          members: {
            include: {
              user: {
                select: { id: true, name: true, email: true, image: true },
              },
            },
          },
        },
      },
    },
  });

  // Jika belum punya workspace, buatkan otomatis (default)
  if (!workspaceMember) {
    const newWorkspace = await prisma.workspace.create({
      data: {
        name: `Workspace ${user.name}`,
        slug: `workspace-${user.id}`,
        members: {
          create: {
            userId: user.id,
            role: "OWNER",
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
        },
      },
    });
    return newWorkspace;
  }

  return workspaceMember.workspace;
}

/**
 * Invite/Add member ke workspace berdasarkan email.
 * Jika email belum terdaftar di aplikasi, bisa return error atau bisa kita auto-create dummy user (untuk protoype).
 */
export async function inviteMemberAction(workspaceId: string, email: string, role: string) {
  const session = await auth();
  const currentUser = session?.user;
  if (!currentUser || !currentUser.id) throw new Error("Unauthorized");

  // Cari user target
  const targetUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!targetUser) {
    // Sebagai prototype, kembalikan error jika user belum register
    return { success: false, message: "User dengan email tersebut belum terdaftar di aplikasi." };
  }

  // Cek apakah sudah jadi member
  const existingMember = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: targetUser.id,
      },
    },
  });

  if (existingMember) {
    return { success: false, message: "User tersebut sudah berada di workspace ini." };
  }

  await prisma.workspaceMember.create({
    data: {
      workspaceId,
      userId: targetUser.id,
      role,
    },
  });

  revalidatePath("/dashboard/workspace");
  return { success: true, message: "Member berhasil diundang." };
}

/**
 * Remove member dari workspace
 */
export async function removeMemberAction(workspaceId: string, userId: string) {
  const session = await auth();
  const currentUser = session?.user;
  if (!currentUser || !currentUser.id) throw new Error("Unauthorized");

  // Cegah menghapus diri sendiri jika dia owner, atau logic lain, tapi untuk simpelnya:
  if (userId === currentUser.id) {
    return { success: false, message: "Tidak dapat menghapus diri sendiri." };
  }

  await prisma.workspaceMember.delete({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId,
      },
    },
  });

  revalidatePath("/dashboard/workspace");
  return { success: true, message: "Member berhasil dihapus." };
}

