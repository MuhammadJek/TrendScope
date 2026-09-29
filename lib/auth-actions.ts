"use server";

import { hash, compare } from "bcryptjs";
import { randomBytes } from "crypto";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import {
  SignupSchema,
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  type AuthFormState,
} from "@/lib/auth-definitions";
import { AuthError } from "next-auth";
import prisma from "@/lib/prisma";
import { sendEmail, buildVerificationEmail, APP_URL } from "@/lib/email";

// ---------------------------------------------------------------------------
// Register / Sign up
// ---------------------------------------------------------------------------
export async function signupAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const raw = {
    name: (formData.get("name") as string) || "",
    email: (formData.get("email") as string) || "",
    password: (formData.get("password") as string) || "",
    confirmPassword: (formData.get("confirmPassword") as string) || "",
    terms: formData.get("terms") === "on",
  };

  const validated = SignupSchema.safeParse(raw);
  if (!validated.success) {
    return { 
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
      values: { name: raw.name, email: raw.email, terms: raw.terms },
    };
  }

  const { name, email, password } = validated.data;

  // Check if email already registered via Prisma
  const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existingUser) {
    return { 
      errors: { email: ["An account with this email already exists."] },
      values: { name, email, terms: raw.terms },
    };
  }

  const passwordHash = await hash(password, 12);
  
  // Create user with emailVerified = false
  await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: "FREE_USER",
      emailVerified: false,
    }
  });

  // Create email verification token (valid 24 hours)
  await prisma.emailVerificationToken.deleteMany({ where: { email: email.toLowerCase() } });
  const token = randomBytes(32).toString("hex");
  await prisma.emailVerificationToken.create({
    data: {
      token,
      email: email.toLowerCase(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    }
  });

  // Send verification email
  const verificationUrl = `${APP_URL}/verify-email?token=${token}&email=${encodeURIComponent(email.toLowerCase())}`;
  try {
    await sendEmail({
      to: email,
      subject: "Verifikasi email TrendScope Anda",
      html: buildVerificationEmail(name, verificationUrl),
    });
  } catch (err) {
    console.error("Failed to send verification email:", err);
    // Tetap lanjut meski email gagal — user bisa resend nanti
  }

  redirect(`/verify-email?email=${encodeURIComponent(email.toLowerCase())}`);
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const raw = {
    email: (formData.get("email") as string) || "",
    password: (formData.get("password") as string) || "",
    remember: formData.get("remember") === "on",
  };

  const validated = LoginSchema.safeParse(raw);
  if (!validated.success) {
    return { 
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
      values: { email: raw.email, remember: raw.remember },
    };
  }

  const callbackUrl = (formData.get("callbackUrl") as string) || "/dashboard";

  try {
    await signIn("credentials", {
      email: validated.data.email,
      password: validated.data.password,
      redirect: true,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      // Do not expose whether the email exists
      return {
        message: "Invalid email or password. Please check your credentials and try again.",
        values: { email: raw.email, remember: raw.remember },
      };
    }
    // NEXT_REDIRECT is thrown by signIn when redirect: true — rethrow it
    throw error;
  }

  // Unreachable when redirect: true succeeds, but required for type safety
  return { success: true };
}

// ---------------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------------
export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}

// ---------------------------------------------------------------------------
// Forgot password
// ---------------------------------------------------------------------------
export async function forgotPasswordAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const raw = { email: (formData.get("email") as string) || "" };
  const validated = ForgotPasswordSchema.safeParse(raw);
  if (!validated.success) {
    return { 
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
      values: { email: raw.email },
    };
  }

  const { email } = validated.data;

  // TODO: Add rate limiting here (e.g. 3 requests per hour per IP)

  // Always run this regardless of whether the user exists to avoid
  // revealing account existence. The token is only created if user exists.
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (user) {
    // createResetToken(email); // logs link in dev mode
  }

  return {
    success: true,
    message:
      "If an account with that email exists, you will receive a reset link shortly.",
  };
}

// ---------------------------------------------------------------------------
// Reset password
// ---------------------------------------------------------------------------
export async function resetPasswordAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const raw = {
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const validated = ResetPasswordSchema.safeParse(raw);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as Record<string, string[]> };
  }

  // const { token, password } = validated.data;
  // TODO: implement real DB token consumption
  return { message: "Reset password not fully implemented with DB yet." };
}

// ---------------------------------------------------------------------------
// Verify email
// ---------------------------------------------------------------------------
export async function verifyEmailAction(token: string): Promise<AuthFormState> {
  if (!token) {
    return { message: "Verification token is missing." };
  }

  // Find token in DB
  const record = await prisma.emailVerificationToken.findUnique({ where: { token } });

  if (!record) {
    return { message: "This verification link is invalid or has already been used." };
  }

  if (record.expiresAt < new Date()) {
    // Delete expired token
    await prisma.emailVerificationToken.delete({ where: { token } }).catch(() => {});
    return { message: "This verification link has expired. Please request a new one." };
  }

  // Mark user as verified
  const updatedUser = await prisma.user.update({
    where: { email: record.email },
    data: { emailVerified: true },
  }).catch(() => null);

  if (!updatedUser) {
    return { message: "Account not found. Please register again." };
  }

  // Consume (delete) the token
  await prisma.emailVerificationToken.delete({ where: { token } }).catch(() => {});

  return {
    success: true,
    message: "Email verified successfully! You can now sign in.",
  };
}

// ---------------------------------------------------------------------------
// Resend verification email
// ---------------------------------------------------------------------------
export async function resendVerificationAction(email: string): Promise<AuthFormState> {
  // Always return success to avoid revealing account existence
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

  if (user && !user.emailVerified) {
    // Delete old tokens and create a new one
    await prisma.emailVerificationToken.deleteMany({ where: { email: email.toLowerCase() } });
    const token = randomBytes(32).toString("hex");
    await prisma.emailVerificationToken.create({
      data: {
        token,
        email: email.toLowerCase(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }
    });

    const verificationUrl = `${APP_URL}/verify-email?token=${token}&email=${encodeURIComponent(email.toLowerCase())}`;
    try {
      await sendEmail({
        to: email,
        subject: "Link verifikasi baru — TrendScope",
        html: buildVerificationEmail(user.name, verificationUrl),
      });
    } catch (err) {
      console.error("Failed to resend verification email:", err);
    }
  }

  return {
    success: true,
    message: "Jika akun Anda terdaftar dan belum diverifikasi, link baru telah dikirim.",
  };
}


// ---------------------------------------------------------------------------
// Update profile
// ---------------------------------------------------------------------------
export async function updateProfileAction(
  email: string,
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const name = (formData.get("name") as string | null)?.trim() || "";
  if (!name || name.length < 2) {
    return { 
      errors: { name: ["Name must be at least 2 characters."] },
      values: { name }
    };
  }

  try {
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { name }
    });
    return { success: true, message: "Profile updated." };
  } catch {
    return { message: "Failed to update profile. Please try again.", values: { name } };
  }
}

// ---------------------------------------------------------------------------
// Change password (authenticated)
// ---------------------------------------------------------------------------
export async function changePasswordAction(
  email: string,
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword) return { errors: { currentPassword: ["Current password is required."] } };
  if (!newPassword || newPassword.length < 8) {
    return { errors: { newPassword: ["Must be at least 8 characters."] } };
  }
  if (newPassword !== confirmPassword) {
    return { errors: { confirmPassword: ["Passwords do not match."] } };
  }

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) return { message: "User not found." };

  const valid = await compare(currentPassword, user.passwordHash);
  if (!valid) return { errors: { currentPassword: ["Current password is incorrect."] } };

  const newHash = await hash(newPassword, 12);
  await prisma.user.update({
    where: { email: email.toLowerCase() },
    data: { passwordHash: newHash }
  });

  return { success: true, message: "Password changed successfully." };
}

// ---------------------------------------------------------------------------
// Delete account
// ---------------------------------------------------------------------------
export async function deleteAccountAction(email: string): Promise<void> {
  await prisma.user.delete({ where: { email: email.toLowerCase() } });
  await signOut({ redirectTo: "/" });
}

