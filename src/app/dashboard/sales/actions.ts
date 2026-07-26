"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { saleSchema, voidSaleSchema, toSafeErrorMessage } from "@/app/lib/validation";

export async function recordSale(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const parsed = saleSchema.safeParse({
    product_id: formData.get("product_id") as string,
    quantity: Number(formData.get("quantity")),
    sale_date: formData.get("sale_date") as string,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  // USE THE RPC: This is a single atomic transaction
  const { error } = await supabase.rpc("record_sale_and_update_stock", {
    p_product_id: parsed.data.product_id,
    p_user_id: user.id,
    p_quantity: parsed.data.quantity,
    p_sale_date: parsed.data.sale_date,
  });

  if (error) {
    console.error("RPC Error (recordSale):", error);
    return { error: toSafeErrorMessage(error) };
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

  const parsed = voidSaleSchema.safeParse({ saleId });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid sale id" };
  }

  const { error } = await supabase.rpc("void_sale_and_restore_stock", {
    p_sale_id: parsed.data.saleId,
    p_user_id: user.id,
  });

  if (error) {
    console.error("RPC Error (voidSale):", error);
    return { error: toSafeErrorMessage(error) };
  }

  // This tells Next.js: "The data at these locations is now wrong, fetch it again"
  revalidatePath("/dashboard/sales");
  revalidatePath("/dashboard");

  return { success: true };
}
