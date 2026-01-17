"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function recordSale(formData: FormData) {
  const supabase = await createClient();

  const productId = formData.get("product_id") as string;
  const quantity = parseInt(formData.get("quantity") as string);
  const date = formData.get("sale_date") as string;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // USE THE RPC: This is a single atomic transaction
  const { error } = await supabase.rpc("record_sale_and_update_stock", {
    p_product_id: productId,
    p_user_id: user.id,
    p_quantity: quantity,
    p_sale_date: date,
  });

  if (error) {
    console.error("RPC Error:", error.message);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/sales");
  return { success: true };
}

export async function voidSale(saleId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.rpc("void_sale_and_restore_stock", {
    p_sale_id: saleId,
    p_user_id: user.id,
  });

  if (error) return { error: error.message };

  // This tells Next.js: "The data at these locations is now wrong, fetch it again"
  revalidatePath("/dashboard/sales");
  revalidatePath("/dashboard");

  return { success: true };
}