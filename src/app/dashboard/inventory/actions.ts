"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import {
  productSchema,
  bulkProductArraySchema,
  stockUpdateSchema,
  toSafeErrorMessage,
} from "@/app/lib/validation";

export async function addProduct(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const parsed = productSchema.safeParse({
    name: formData.get("name") as string,
    sku: formData.get("sku") as string,
    category: (formData.get("category") as string) || "",
    stock_level: Number(formData.get("stock_level")),
    min_stock_threshold: Number(formData.get("min_stock_threshold")),
    unit_cost: Number(formData.get("unit_cost") || 0),
    unit_price: Number(formData.get("unit_price") || 0),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { error } = await supabase.from("products").insert({
    ...parsed.data,
    user_id: user.id,
  });

  if (error) {
    console.error("ADD PRODUCT ERROR:", error);
    return { error: toSafeErrorMessage(error) };
  }

  revalidatePath("/dashboard/inventory");
  return { success: true };
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  if (!productId || typeof productId !== "string") {
    return { error: "Invalid product id" };
  }

  // Ownership check as defense-in-depth, in addition to RLS.
  const { error, count } = await supabase
    .from("products")
    .delete({ count: "exact" })
    .eq("id", productId)
    .eq("user_id", user.id);

  if (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return { error: toSafeErrorMessage(error) };
  }

  if (!count) {
    // Either it never existed or it belongs to someone else — don't
    // distinguish, to avoid leaking which is the case.
    return { error: "Product not found." };
  }

  revalidatePath("/dashboard/inventory");
  return { success: true };
}

export async function updateProductStock(productId: string, newStock: number) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const parsed = stockUpdateSchema.safeParse({ productId, newStock });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { error, count } = await supabase
    .from("products")
    .update({ stock_level: parsed.data.newStock }, { count: "exact" })
    .eq("id", parsed.data.productId)
    .eq("user_id", user.id);

  if (error) {
    console.error("UPDATE STOCK ERROR:", error);
    return { error: toSafeErrorMessage(error) };
  }

  if (!count) {
    return { error: "Product not found." };
  }

  // Refresh all relevant pages to show the new stock immediately
  revalidatePath(`/dashboard/inventory/${parsed.data.productId}`);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/inventory");

  return { success: true };
}

export async function bulkAddProducts(products: unknown[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const parsed = bulkProductArraySchema.safeParse(products);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid import data" };
  }

  // Attach user_id to every row
  const productsWithUser = parsed.data.map((p) => ({
    ...p,
    user_id: user.id,
  }));

  const { error } = await supabase.from("products").insert(productsWithUser);

  if (error) {
    console.error("BULK ADD PRODUCTS ERROR:", error);
    return { error: toSafeErrorMessage(error) };
  }

  revalidatePath("/dashboard/inventory");
  revalidatePath("/dashboard");
  return { success: true, count: parsed.data.length };
}
