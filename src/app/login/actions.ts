"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// Generic, user-facing messages — never expose raw Supabase/Postgres errors,
// which can leak schema details or allow account-enumeration via message diffing.
const GENERIC_LOGIN_ERROR = "Invalid email or password.";
const GENERIC_SIGNUP_ERROR = "We couldn't create your account. Please try again.";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return redirect(`/login?message=${encodeURIComponent(GENERIC_LOGIN_ERROR)}`);
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("LOGIN ERROR:", error); // server-side only
    return redirect(`/login?message=${encodeURIComponent(GENERIC_LOGIN_ERROR)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password || password.length < 8) {
    return redirect(
      `/login?message=${encodeURIComponent(
        "Password must be at least 8 characters."
      )}`
    );
  }

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error("SIGNUP ERROR:", error); // server-side only
    return redirect(`/login?message=${encodeURIComponent(GENERIC_SIGNUP_ERROR)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
