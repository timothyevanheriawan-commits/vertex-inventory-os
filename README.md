# Vertex Inventory OS

Inventory management SaaS with role-based access control, row-level security,
and an accessible admin UI. Built as a portfolio project to demonstrate
production-grade auth, data validation, and WCAG compliance.

## Features

- Role-based access control (RBAC) with Supabase Auth
- Row-Level Security (RLS) policies enforced at the database layer
- Input validation across all mutation paths
- WCAG-accessible UI (audited and remediated)
- Furniture catalog seed data for demo purposes

## Stack

- Next.js / React / TypeScript
- Tailwind CSS
- Supabase (Postgres, Auth, RLS)

## Setup

1. **Install dependencies**

npm install


2. **Create a Supabase project** and run the migrations in
   `supabase/migrations/`.

3. **Copy `.env.example` to `.env.local`** and fill in your Supabase URL and
   keys from Project Settings → API.

4. **Run the dev server**

npm run dev


   Open <http://localhost:3000>.

## Deployment

Deployed on Vercel: [vertex-inventory-os.vercel.app](https://vertex-inventory-os.vercel.app)

## Security

This project underwent a dedicated security audit covering auth, input
validation, and RLS policies. See commit history for the hardening pass.
