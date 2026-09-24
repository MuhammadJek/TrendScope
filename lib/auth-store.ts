/**
 * In-memory user and token store.
 *
 * ⚠️ DEVELOPMENT PLACEHOLDER — NOT FOR PRODUCTION
 * ─────────────────────────────────────────────────
 * This file replaces a real database for local development.
 * To connect a real DB, replace each function with your ORM calls
 * (Prisma, Drizzle, Supabase, etc.).
 *
 * Data does NOT survive a server restart.
 */

import { randomBytes } from "crypto";

// ---------------------------------------------------------------------------
// Stored user shape
// ---------------------------------------------------------------------------
export type StoredUser = {
  id: string;
  name: string;
  email: string; // always lowercase
  passwordHash: string;
  emailVerified: boolean;
  createdAt: string;
  image?: string | null;
  role: "USER" | "ADMIN";
};

// ---------------------------------------------------------------------------
// In-memory stores
// ---------------------------------------------------------------------------
// TODO: replace with real DB
const users = new Map<string, StoredUser>(); // keyed by email

// Reset tokens: token → { email, expiresAt }
type ResetToken = { email: string; expiresAt: Date };
const resetTokens = new Map<string, ResetToken>();

// Verification tokens: token → { email, expiresAt }
const verificationTokens = new Map<string, { email: string; expiresAt: Date }>();

// ---------------------------------------------------------------------------
// User operations
// ---------------------------------------------------------------------------

/**
 * Create a new user. Returns the stored user or null if email already taken.
 */
export function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
}): StoredUser | null {
  // TODO: replace with real DB INSERT
  const email = data.email.toLowerCase();
  if (users.has(email)) return null;

  // Make the first user an ADMIN for prototype purposes
  const isFirstUser = users.size === 0;

  const user: StoredUser = {
    id: randomBytes(16).toString("hex"),
    name: data.name,
    email,
    passwordHash: data.passwordHash,
    emailVerified: false,
    createdAt: new Date().toISOString(),
    image: null,
    role: isFirstUser || email.includes("admin") ? "ADMIN" : "USER",
  };

  users.set(email, user);
  return user;
}

export function getAllUsers(): StoredUser[] {
  return Array.from(users.values());
}

/**
 * Retrieve a user by email. Returns null if not found.
 */
export function getUserByEmail(email: string): StoredUser | null {
  // TODO: replace with real DB SELECT
  return users.get(email.toLowerCase()) ?? null;
}

/**
 * Update a user's password hash.
 */
export function updateUserPassword(email: string, newHash: string): boolean {
  // TODO: replace with real DB UPDATE
  const user = users.get(email.toLowerCase());
  if (!user) return false;
  user.passwordHash = newHash;
  return true;
}

/**
 * Mark a user's email as verified.
 */
export function markEmailVerified(email: string): boolean {
  // TODO: replace with real DB UPDATE
  const user = users.get(email.toLowerCase());
  if (!user) return false;
  user.emailVerified = true;
  return true;
}

/**
 * Update a user's profile name and/or image.
 */
export function updateUserProfile(
  email: string,
  data: { name?: string; image?: string | null }
): StoredUser | null {
  // TODO: replace with real DB UPDATE
  const user = users.get(email.toLowerCase());
  if (!user) return null;
  if (data.name !== undefined) user.name = data.name;
  if (data.image !== undefined) user.image = data.image;
  return user;
}

/**
 * Delete a user account.
 */
export function deleteUser(email: string): boolean {
  // TODO: replace with real DB DELETE
  return users.delete(email.toLowerCase());
}

// ---------------------------------------------------------------------------
// Password reset tokens
// ---------------------------------------------------------------------------

/**
 * Create a password reset token (valid for 1 hour).
 * Returns the raw token string to include in the reset link.
 */
export function createResetToken(email: string): string {
  // TODO: replace with real DB token storage
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  resetTokens.set(token, { email: email.toLowerCase(), expiresAt });

  // In production, send email here or via dedicated email service.
  // TODO: replace console.log with real email send
  console.log(
    `[DEV] Password reset link: http://localhost:3000/reset-password?token=${token}`
  );

  return token;
}

/**
 * Validate and consume a reset token.
 * Returns the associated email on success, null if invalid/expired.
 */
export function consumeResetToken(token: string): string | null {
  // TODO: replace with real DB lookup and deletion
  const entry = resetTokens.get(token);
  if (!entry) return null;
  if (entry.expiresAt < new Date()) {
    resetTokens.delete(token);
    return null;
  }
  resetTokens.delete(token); // consumed — single-use
  return entry.email;
}

// ---------------------------------------------------------------------------
// Email verification tokens
// ---------------------------------------------------------------------------

/**
 * Create an email verification token (valid for 24 hours).
 */
export function createVerificationToken(email: string): string {
  // TODO: replace with real DB token storage
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  verificationTokens.set(token, { email: email.toLowerCase(), expiresAt });

  // TODO: replace console.log with real email send
  console.log(
    `[DEV] Verification link: http://localhost:3000/verify-email?token=${token}`
  );

  return token;
}

/**
 * Validate and consume a verification token.
 */
export function consumeVerificationToken(token: string): string | null {
  // TODO: replace with real DB lookup and deletion
  const entry = verificationTokens.get(token);
  if (!entry) return null;
  if (entry.expiresAt < new Date()) {
    verificationTokens.delete(token);
    return null;
  }
  verificationTokens.delete(token);
  return entry.email;
}

