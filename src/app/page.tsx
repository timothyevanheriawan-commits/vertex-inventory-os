import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import LandingContent from "@/components/landing/LandingContent";

export default async function LandingPage() {
  // 1. SESSION CHECK: Handled on the server for security and speed
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  // 2. Return the Client Component that holds the UI
  return <LandingContent />;
}
