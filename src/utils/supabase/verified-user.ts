import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export interface VerifiedUser {
  id: string;
  email: string | null;
}

/**
 * Returns the current user's id/email using the header that middleware
 * already set after verifying the session with Supabase Auth (a network
 * call). This avoids re-doing that same network round-trip on every single
 * page render — middleware is the single source of truth for verification.
 *
 * Falls back to a direct supabase.auth.getUser() call (network) only if the
 * header is missing — e.g. local dev edge cases, or if middleware's matcher
 * config is ever changed to exclude a route it shouldn't. This keeps the
 * fast path fast without silently breaking auth if middleware doesn't run.
 */
export async function getVerifiedUser(): Promise<VerifiedUser | null> {
  const hdrs = await headers();
  const id = hdrs.get("x-verified-user-id");

  if (id) {
    const encodedEmail = hdrs.get("x-verified-user-email");
    return {
      id,
      email: encodedEmail ? decodeURIComponent(encodedEmail) : null,
    };
  }

  // Fallback path — only hit if middleware didn't run for this request.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;
  return { id: user.id, email: user.email ?? null };
}
