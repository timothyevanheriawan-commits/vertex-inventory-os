# Vertex Inventory OS

A multi-tenant inventory management system built to work the way a real B2B SaaS product
would: role-based access control, tenant isolation enforced at the database layer, and an
accessible admin UI, not just at the surface.

## Why tenant isolation is the core problem

Most inventory dashboards get RBAC right at the UI layer and stop there, hiding buttons a
user shouldn't click. That's not isolation. If the database itself doesn't enforce which
rows a user can see or touch, a misconfigured API route or a bug in a client component
can leak another tenant's data. Vertex is built around Postgres Row-Level Security (RLS)
as the actual boundary, so tenant isolation holds even if application-layer checks are
missed somewhere.

## Security audit

This project went through a dedicated security audit focused on exactly that boundary. It
found real gaps: RLS policies that didn't fully enforce tenant isolation on several tables,
meaning a query from the wrong context could reach rows outside its own tenant. Those
policies were rewritten and re-tested against cross-tenant access attempts, not just
happy-path queries.

What changed:
- Rewrote RLS policies to scope every table to the authenticated user's tenant, closing
  gaps where isolation was implicit (relying on application code) rather than enforced by
  the database
- Added negative-path tests: queries that should be rejected across tenant boundaries,
  not just checks that valid queries succeed
- Reviewed all mutation paths (create/update/delete) for the same class of gap, not just
  reads

## Features

- Role-based access control (RBAC) with Supabase Auth
- Row-Level Security policies enforced at the database layer, audited for tenant isolation
- Input validation on all mutation paths
- WCAG-audited and remediated UI (contrast, focus states, keyboard navigation)
- Furniture catalog seed data for demo purposes

## Tech stack

- Next.js / React / TypeScript
- Tailwind CSS
- Framer Motion
- Supabase (Postgres, Auth, RLS)

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Create a Supabase project** and run the migrations in `supabase/migrations/`.
3. **Copy `.env.example` to `.env.local`** and fill in your Supabase URL and keys from
   Project Settings → API.
4. **Run the dev server**
   ```bash
   npm run dev
   ```
   Open <http://localhost:3000>.

## Deployment

Deployed on Vercel: [vertex-inventory-os.vercel.app](https://vertex-inventory-os.vercel.app)

## What I'd add with more time

- Automated tests for the RLS policies (currently verified manually against cross-tenant
  queries) so isolation regressions get caught in CI, not in a manual audit pass
- Audit logging on sensitive mutations, for traceability beyond what RLS alone provides
