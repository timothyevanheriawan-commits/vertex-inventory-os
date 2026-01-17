"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function addProduct(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const data = {
    user_id: user.id,
    name: formData.get("name") as string,
    sku: formData.get("sku") as string,
    category: formData.get("category") as string,
    stock_level: parseInt(formData.get("stock_level") as string),
    min_stock_threshold: parseInt(
      formData.get("min_stock_threshold") as string
    ),
    unit_cost: parseFloat((formData.get("unit_cost") as string) || "0"), // NEW
    unit_price: parseFloat((formData.get("unit_price") as string) || "0"), // NEW
  };

  const { error } = await supabase.from("products").insert(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/inventory");
  return { success: true };
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/inventory");
  return { success: true };
}

// THIS WAS THE MISSING FUNCTION
export async function updateProductStock(productId: string, newStock: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update({ stock_level: newStock })
    .eq("id", productId);

  if (error) {
    return { error: error.message };
  }

  // Refresh all relevant pages to show the new stock immediately
  revalidatePath(`/dashboard/inventory/${productId}`);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/inventory");

  return { success: true };
}

export async function bulkAddProducts(products: any[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // Attach user_id to every row
  const productsWithUser = products.map((p) => ({
    ...p,
    user_id: user.id,
  }));

  const { error } = await supabase.from("products").insert(productsWithUser);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/inventory");
  revalidatePath("/dashboard");
  return { success: true, count: products.length };
}