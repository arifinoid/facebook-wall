-- Facebook Wall — database schema
-- Run this in the Supabase SQL Editor.

create table posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  body text check (char_length(body) <= 280),
  created_at timestamptz default now()
);

-- Row Level Security: the anon key may only read and insert.
alter table public.posts enable row level security;

create policy "anon read posts"
  on public.posts
  for select
  to anon
  using (true);

create policy "anon insert posts"
  on public.posts
  for insert
  to anon
  with check (true);

-- Broadcast inserts so connected clients update without a refresh.
alter publication supabase_realtime add table public.posts;
