/**
 * TableTurn AI – Auth system
 *
 * Uses jose for JWT (Edge-compatible) + bcryptjs for password hashing.
 * Sessions are stored as HttpOnly cookies containing a signed JWT.
 */

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type UserRole =
  | "ADMIN"
  | "MARKETING_MANAGER"
  | "EVENT_MANAGER"
  | "VIEWER";

export interface SessionData {
  userId: string;
  organizationId: string;
  role: UserRole;
  email: string;
  name: string;
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const COOKIE_NAME = "tableturn_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

// ─────────────────────────────────────────────
// Session Management
// ─────────────────────────────────────────────

/**
 * Creates a signed JWT and sets it as an HttpOnly cookie.
 * Must be called inside a Server Action or Route Handler.
 */
export async function createSession(
  userId: string,
  orgId: string,
  role: UserRole,
  email: string,
  name: string
): Promise<void> {
  const secret = getJwtSecret();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);

  const token = await new SignJWT({
    userId,
    organizationId: orgId,
    role,
    email,
    name,
  } satisfies SessionData)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .setIssuer("tableturn-ai")
    .setAudience("tableturn-ai")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

/**
 * Reads and verifies the JWT session cookie.
 * Returns null if no session exists or the token is invalid/expired.
 */
export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get(COOKIE_NAME);

    if (!tokenCookie?.value) {
      return null;
    }

    const secret = getJwtSecret();
    const { payload } = await jwtVerify(tokenCookie.value, secret, {
      issuer: "tableturn-ai",
      audience: "tableturn-ai",
    });

    // Validate required fields exist in payload
    if (
      typeof payload.userId !== "string" ||
      typeof payload.organizationId !== "string" ||
      typeof payload.role !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string"
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      organizationId: payload.organizationId,
      role: payload.role as UserRole,
      email: payload.email,
      name: payload.name,
    };
  } catch {
    // Token expired, invalid signature, or malformed
    return null;
  }
}

/**
 * Clears the session cookie.
 * Must be called inside a Server Action or Route Handler.
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Requires a valid session or redirects to /login.
 * Use this in Server Components and Server Actions that require auth.
 *
 * @example
 * const session = await requireAuth();
 * // session is guaranteed to be SessionData here
 */
export async function requireAuth(): Promise<SessionData> {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

/**
 * Requires a specific role or redirects to /dashboard.
 */
export async function requireRole(
  allowedRoles: UserRole[]
): Promise<SessionData> {
  const session = await requireAuth();

  if (!allowedRoles.includes(session.role)) {
    redirect("/dashboard");
  }

  return session;
}

// ─────────────────────────────────────────────
// Password Utilities
// ─────────────────────────────────────────────

const BCRYPT_ROUNDS = 12;

/**
 * Hashes a plain-text password using bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Verifies a plain-text password against a bcrypt hash.
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
