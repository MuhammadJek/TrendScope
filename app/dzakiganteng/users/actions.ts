"use server";

import { isSuperAdmin } from "@/lib/super-admin-auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";

export async function deleteUserAction(id: string) {
  const authed = await isSuperAdmin();
  if (!authed) throw new Error("Unauthorized");

  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath("/dzakiganteng/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user", error);
    return { success: false, error: "Failed to delete user" };
  }
}

export async function toggleUserRoleAction(id: string, currentRole: string) {
  const authed = await isSuperAdmin();
  if (!authed) throw new Error("Unauthorized");

  // Cyclical role change for the admin panel
  let newRole = "FREE_USER";
  if (currentRole === "FREE_USER") newRole = "PRO_USER";
  else if (currentRole === "PRO_USER") newRole = "SUPER_ADMIN";
  else if (currentRole === "SUPER_ADMIN") newRole = "FREE_USER";
  else newRole = "FREE_USER"; // fallback
  
  try {
    await prisma.user.update({
      where: { id },
      data: { role: newRole }
    });
    revalidatePath("/dzakiganteng/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update role" };
  }
}

export async function createUserAction(formData: FormData) {
  const authed = await isSuperAdmin();
  if (!authed) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!name || !email || !password) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    const passwordHash = await hash(password, 10);
    await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: role || "FREE_USER",
        emailVerified: true // Assume admin created users are verified
      }
    });
    revalidatePath("/dzakiganteng/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create user (email might be taken)" };
  }
}

