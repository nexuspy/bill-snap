# BillSnap

Minimal SaaS invoicing & payment tracking built with Next.js 14, Supabase, Tailwind and Framer Motion.

## Stack
- Next.js 14 (App Router) + TypeScript
- Supabase (Auth + Postgres)
- TailwindCSS
- Framer Motion animations
- jsPDF for PDF exports
- Deploy on Vercel

## Environment
Create `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Supabase Table
Run SQL in Supabase:
```sql
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  client_name text,
  client_email text,
  services jsonb,
  tax numeric,
  discount numeric,
  notes text,
  total_amount numeric,
  status text check (status in ('Paid','Pending')) default 'Pending',
  public_id text unique,
  created_at timestamp with time zone default now()
);
```
Enable RLS and add policies:
```sql
alter table public.invoices enable row level security;
create policy "User can read own" on public.invoices for select using (auth.uid() = user_id);
create policy "User can insert own" on public.invoices for insert with check (auth.uid() = user_id);
create policy "User can update own" on public.invoices for update using (auth.uid() = user_id);
-- Public read by public_id
create policy "Public read by slug" on public.invoices for select using (true);
```

## Dev
```bash
pnpm i
pnpm dev
```
