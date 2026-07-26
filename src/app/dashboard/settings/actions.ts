"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { userSettingsSchema, toSafeErrorMessage } from "@/app/lib/validation";

export async function updateUserSettings(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const parsed = userSettingsSchema.safeParse({
    lead_time_days: Number(formData.get("lead_time")),
    critical_threshold_days: Number(formData.get("critical")),
    watch_threshold_days: Number(formData.get("watch")),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const settings = {
    user_id: user.id,
    ...parsed.data,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("user_settings").upsert(settings);

  if (error) {
    console.error("UPDATE SETTINGS ERROR:", error);
    return { error: toSafeErrorMessage(error) };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  return { success: true };
}
