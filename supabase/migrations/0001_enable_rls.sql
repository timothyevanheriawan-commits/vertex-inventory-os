-- ============================================================================
-- Schema confirmed against the live database on 2026-07-25 for
-- inventory_logs (see that section below for the exact column list).
-- products, sales, and user_settings columns are still inferred from
-- application code only — spot-check those too before running this in
-- production:
--   select column_name, data_type, is_nullable
--   from information_schema.columns
--   where table_schema = 'public' and table_name = 'products'; -- (or 'sales', 'user_settings')
--
-- Run this on staging first, then test as two different user accounts to
-- confirm neither can see or mutate the other's rows.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
alter table public.products enable row level security;

create policy "products_select_own"
  on public.products for select
  using (auth.uid() = user_id);

create policy "products_insert_own"
  on public.products for insert
  with check (auth.uid() = user_id);

create policy "products_update_own"
  on public.products for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "products_delete_own"
  on public.products for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- sales
-- (app code passes p_user_id into the record_sale_and_update_stock /
-- void_sale_and_restore_stock RPCs, implying a user_id column exists here)
-- ---------------------------------------------------------------------------
alter table public.sales enable row level security;

create policy "sales_select_own"
  on public.sales for select
  using (auth.uid() = user_id);

-- Direct insert/update/delete on `sales` from the client is intentionally
-- NOT granted here — all writes should go through the two SECURITY DEFINER
-- RPCs below, which enforce their own ownership checks atomically with the
-- stock mutation. If those RPCs are not SECURITY DEFINER + do not verify
-- p_user_id against the authenticated caller, fix that first (see note at
-- the bottom of this file).

-- ---------------------------------------------------------------------------
-- user_settings
-- ---------------------------------------------------------------------------
alter table public.user_settings enable row level security;

create policy "user_settings_select_own"
  on public.user_settings for select
  using (auth.uid() = user_id);

create policy "user_settings_upsert_own"
  on public.user_settings for insert
  with check (auth.uid() = user_id);

create policy "user_settings_update_own"
  on public.user_settings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- inventory_logs
-- Confirmed schema (2026-07-25): id, product_id, user_id, previous_stock,
-- new_stock, change_amount, change_type, created_at. user_id IS NULLABLE.
-- ---------------------------------------------------------------------------
alter table public.inventory_logs enable row level security;

create policy "inventory_logs_select_own"
  on public.inventory_logs for select
  using (auth.uid() = user_id);

-- NOTE: because user_id is nullable, any existing row where user_id IS NULL
-- will become invisible to every user once this policy is active (null =
-- auth.uid() is never true in SQL — this is the safe failure mode, nothing
-- leaks, but it can look like "missing" audit history). Before/after
-- applying this migration, check for orphaned rows:
--   select count(*) from public.inventory_logs where user_id is null;
-- If that returns > 0, backfill user_id by joining through product_id:
--   update public.inventory_logs l
--   set user_id = p.user_id
--   from public.products p
--   where l.product_id = p.id and l.user_id is null;

-- ---------------------------------------------------------------------------
-- inventory_insights (VIEW)
-- Views do NOT automatically inherit RLS from underlying tables in older
-- Postgres/Supabase configurations. As of Postgres 15+, Supabase supports
-- `security_invoker` on views, which makes the view respect the querying
-- user's RLS policies on the underlying tables instead of the view owner's
-- (usually postgres/superuser) privileges. Without this, RLS on `products`
-- may be silently bypassed whenever the app queries this view.
-- ---------------------------------------------------------------------------
alter view public.inventory_insights set (security_invoker = true);

-- ============================================================================
-- ACTION REQUIRED: Audit record_sale_and_update_stock and
-- void_sale_and_restore_stock.
-- These RPCs are called with a p_user_id parameter supplied by the client
-- (via the authenticated user's session — see src/app/dashboard/sales/actions.ts).
-- If these functions are SECURITY DEFINER (bypassing RLS internally), they
-- MUST independently verify that the row being touched actually belongs to
-- p_user_id before mutating it — otherwise a malicious client could call the
-- RPC with someone else's UUID as p_user_id from a tampered request.
-- Example guard to add inside each function body:
--   if not exists (
--     select 1 from products
--     where id = p_product_id and user_id = p_user_id
--   ) then
--     raise exception 'Not authorized';
--   end if;
-- ============================================================================
