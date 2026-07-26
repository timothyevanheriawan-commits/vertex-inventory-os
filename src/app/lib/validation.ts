import { z } from "zod";

/**
 * Centralized validation schemas for every Server Action that writes data.
 * Never trust client input — always parse with these before hitting Supabase.
 */

export const productSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  sku: z.string().trim().min(1, "SKU is required").max(50),
  category: z.string().trim().max(100).optional().or(z.literal("")),
  stock_level: z.number().int().min(0, "Stock cannot be negative").max(1_000_000),
  min_stock_threshold: z
    .number()
    .int()
    .min(0, "Threshold cannot be negative")
    .max(1_000_000),
  unit_cost: z.number().min(0, "Cost cannot be negative").max(10_000_000),
  unit_price: z.number().min(0, "Price cannot be negative").max(10_000_000),
});

export type ProductInput = z.infer<typeof productSchema>;

// Bulk import rows come from an untyped CSV parse, so coerce before validating.
export const bulkProductSchema = z.object({
  name: z.string().trim().min(1).max(200),
  sku: z.string().trim().min(1).max(50),
  category: z.string().trim().max(100).optional().or(z.literal("")),
  stock_level: z.coerce.number().int().min(0).max(1_000_000),
  min_stock_threshold: z.coerce.number().int().min(0).max(1_000_000),
  unit_cost: z.coerce.number().min(0).max(10_000_000),
  unit_price: z.coerce.number().min(0).max(10_000_000),
});

export const bulkProductArraySchema = z
  .array(bulkProductSchema)
  .min(1, "No rows to import")
  .max(5_000, "Import batch too large (max 5,000 rows)");

export const stockUpdateSchema = z.object({
  productId: z.string().uuid("Invalid product id"),
  newStock: z.number().int().min(0, "Stock cannot be negative").max(1_000_000),
});

export const saleSchema = z.object({
  product_id: z.string().uuid("Invalid product id"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(1_000_000),
  sale_date: z.string().refine((v) => !isNaN(Date.parse(v)), "Invalid date"),
});

export const voidSaleSchema = z.object({
  saleId: z.string().uuid("Invalid sale id"),
});

export const userSettingsSchema = z.object({
  lead_time_days: z.number().int().min(0).max(365),
  critical_threshold_days: z.number().int().min(0).max(365),
  watch_threshold_days: z.number().int().min(0).max(365),
});

/**
 * Maps known Supabase/Postgres error shapes to a safe, generic message so we
 * never leak table names, constraint names, or internal schema details to
 * the client. Always log the raw error server-side (console.error) alongside
 * this call.
 */
export function toSafeErrorMessage(error: { code?: string; message: string }): string {
  // Unique constraint violation (e.g. duplicate SKU)
  if (error.code === "23505") return "A record with this value already exists.";
  // Foreign key violation
  if (error.code === "23503") return "This action references data that no longer exists.";
  // Not-null violation
  if (error.code === "23502") return "A required field is missing.";
  // RLS / permission denied
  if (error.code === "42501") return "You don't have permission to perform this action.";
  return "Something went wrong. Please try again.";
}
