"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function updateUserSettings(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const settings = {
    user_id: user.id,
    lead_time_days: parseInt(formData.get("lead_time") as string),
    critical_threshold_days: parseInt(formData.get("critical") as string),
    watch_threshold_days: parseInt(formData.get("watch") as string),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("user_settings").upsert(settings);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  return { success: true };
}
