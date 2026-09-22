"use server";

import { hash, compare } from "bcryptjs";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import {
  SignupSchema,
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  type AuthFormState,
} from "@/lib/auth-definitions";
import {
  createUser,
  getUserByEmail,
  updateUserPassword,
  createResetToken,
  consumeResetToken,
  createVerificationToken,
  consumeVerificationToken,
  markEmailVerified,
  deleteUser,
  updateUserProfile,
} from "@/lib/auth-store";
import { AuthError } from "next-auth";

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

  // Check if email already registered
  if (getUserByEmail(email)) {
    return { 
      errors: { email: ["An account with this email already exists."] },
      values: { name, email, terms: raw.terms },
    };
  }

  const passwordHash = await hash(password, 12);
  const user = createUser({ name, email, passwordHash });

  if (!user) {
    return { message: "Registration failed. Please try again." };
  }

  // Create email verification token (logs link in dev mode)
  createVerificationToken(email);

  // Automatically sign in after registration
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch {
    // If auto sign-in fails, redirect to login
    redirect("/login?registered=true");
  }

  redirect("/dashboard?welcome=true");
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
  const user = getUserByEmail(email);
  if (user) {
    createResetToken(email); // logs link in dev mode
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

  const { token, password } = validated.data;

  const email = consumeResetToken(token);
  if (!email) {
    return {
      message: "This reset link is invalid or has expired. Please request a new one.",
    };
  }

  const newHash = await hash(password, 12);
  const updated = updateUserPassword(email, newHash);

  if (!updated) {
    return { message: "Failed to update password. Please try again." };
  }

  redirect("/login?passwordReset=true");
}

// ---------------------------------------------------------------------------
// Verify email
// ---------------------------------------------------------------------------
export async function verifyEmailAction(token: string): Promise<AuthFormState> {
  const email = consumeVerificationToken(token);
  if (!email) {
    return { message: "This verification link is invalid or has expired." };
  }

  markEmailVerified(email);
  return { success: true, message: "Your email has been verified successfully." };
}

// ---------------------------------------------------------------------------
// Resend verification email
// ---------------------------------------------------------------------------
export async function resendVerificationAction(email: string): Promise<AuthFormState> {
  // TODO: Add rate limiting (e.g. 1 request per minute per email)
  const user = getUserByEmail(email);
  if (!user) {
    // Generic message to avoid revealing account existence
    return {
      success: true,
      message: "If your account exists, a new verification email has been sent.",
    };
  }

  if (user.emailVerified) {
    return { message: "Your email is already verified." };
  }

  createVerificationToken(email); // logs link in dev mode

  return {
    success: true,
    message: "A new verification email has been sent.",
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

  const updated = updateUserProfile(email, { name });
  if (!updated) {
    return { message: "Failed to update profile. Please try again.", values: { name } };
  }

  return { success: true, message: "Profile updated." };
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

  const user = getUserByEmail(email);
  if (!user) return { message: "User not found." };

  const valid = await compare(currentPassword, user.passwordHash);
  if (!valid) return { errors: { currentPassword: ["Current password is incorrect."] } };

  const newHash = await hash(newPassword, 12);
  updateUserPassword(email, newHash);

  return { success: true, message: "Password changed successfully." };
}

// ---------------------------------------------------------------------------
// Delete account
// ---------------------------------------------------------------------------
export async function deleteAccountAction(email: string): Promise<void> {
  deleteUser(email);
  await signOut({ redirectTo: "/" });
}

