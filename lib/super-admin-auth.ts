"use server";

import { cookies } from "next/headers";
import { compare } from "bcryptjs";

// Hardcoded super-admin credentials (hashed password)
const SUPER_ADMIN_USERNAME = "dzaki ganteng";
const SUPER_ADMIN_PASSWORD_HASH =
  "$2b$10$U1jacVreuD2XSf1lHPrBNO9KenbTn5hfsGVwrdRvktY9Me6Cix25y";

const COOKIE_NAME = "sa_token";
const COOKIE_VALUE = "sa_authenticated_session";

export async function superAdminLogin(
  _prev: { error: string },
  formData: FormData
): Promise<{ error: string }> {
  const username = (formData.get("username") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Username dan password wajib diisi." };
  }

  if (username !== SUPER_ADMIN_USERNAME) {
    return { error: "Kredensial tidak valid." };
  }

  const passwordMatch = await compare(password, SUPER_ADMIN_PASSWORD_HASH);
  if (!passwordMatch) {
    return { error: "Kredensial tidak valid." };
  }

  // Set an HttpOnly cookie to mark the session as super-admin
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, COOKIE_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/dzakiganteng",
    maxAge: 60 * 60 * 4, // 4 hours
  });

  return { error: "" }; // empty = success
}

export async function superAdminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isSuperAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === COOKIE_VALUE;
}
