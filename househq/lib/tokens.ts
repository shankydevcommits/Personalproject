import { createHash, randomBytes, randomInt, createHmac } from "crypto";

/** A 4-digit numeric code as shown in the verify-to-download modal. */
export function generateVerificationCode(): string {
  return String(randomInt(0, 10000)).padStart(4, "0");
}

export function hashCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

/** Opaque token used in magic-link verification emails. */
export function generateMagicToken(): string {
  return randomBytes(24).toString("hex");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** HMAC-signed token so an unsubscribe link can't be guessed or forged. */
export function signUnsubscribeToken(email: string): string {
  const secret = process.env.UNSUBSCRIBE_SECRET;
  if (!secret) {
    throw new Error("UNSUBSCRIBE_SECRET is not configured.");
  }
  return createHmac("sha256", secret).update(email.toLowerCase()).digest("hex");
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = signUnsubscribeToken(email);
  if (expected.length !== token.length) return false;
  // constant-time-ish comparison
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  }
  return diff === 0;
}
