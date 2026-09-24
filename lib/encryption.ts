import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

// Get encryption key from environment
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
  console.warn("WARNING: ENCRYPTION_KEY is not set or is not 64 hex characters (32 bytes). Using a fallback key for development.");
}

// Ensure key is exactly 32 bytes
const key = ENCRYPTION_KEY && ENCRYPTION_KEY.length === 64 
  ? Buffer.from(ENCRYPTION_KEY, "hex")
  : Buffer.alloc(32, "dev-fallback-encryption-key-0000");

const ALGORITHM = "aes-256-gcm";

/**
 * Encrypts a plain text secret.
 * Returns a string in the format: iv:authTag:encryptedData (all hex)
 */
export function encryptSecret(plainText: string): string {
  const iv = randomBytes(12); // GCM standard IV size
  const cipher = createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag().toString("hex");
  
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts a previously encrypted secret.
 */
export function decryptSecret(encryptedString: string): string {
  const parts = encryptedString.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted string format");
  }
  
  const [ivHex, authTagHex, encryptedHex] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  decrypted += decipher.final("utf8");
  
  return decrypted;
}

/**
 * Masks a secret to show only the last 4 characters.
 * Useful for UI display.
 */
export function maskSecret(plainText: string): string {
  if (!plainText || plainText.length <= 4) return "••••";
  return `••••••••••••${plainText.slice(-4)}`;
}

