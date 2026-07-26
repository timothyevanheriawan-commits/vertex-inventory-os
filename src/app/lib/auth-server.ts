import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export interface VerifiedUser {
  id: string;
  email: string;
}

/**
 * Fast authentication reader for Server Components.
 * Reads the pre-verified user identity forwarded by middleware headers
 * to avoid making redundant Supabase Auth network round-trips.
 * Safely falls back to `supabase.auth.getUser()` if headers are missing.
 */
export async function getVerifiedUser(): Promise<VerifiedUser | null> {
  const headerList = await headers();
  const userId =
    headerList.get("x-user-id") || headerList.get("x-verified-user-id");
  const rawEmail =
    headerList.get("x-user-email") || headerList.get("x-verified-user-email");

  if (userId) {
    const email = rawEmail ? decodeURIComponent(rawEmail) : "";
    return { id: userId, email };
  }

  // Fall back safely to a Supabase server client getUser() call
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return { id: user.id, email: user.email ?? "" };
}
