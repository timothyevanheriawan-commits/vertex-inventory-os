import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Escapes characters that are meaningful in PostgREST's filter grammar
 * (comma, parentheses, asterisk, and the ilike wildcard `%`) before they're
 * interpolated into a `.or()`/`.ilike()` string. Without this, user input
 * like `,category.eq.X` can inject additional filter clauses.
 */
export function escapePostgrestFilterValue(value: string): string {
  return value.replace(/[%,()*]/g, (char) => `\\${char}`).slice(0, 200);
}
