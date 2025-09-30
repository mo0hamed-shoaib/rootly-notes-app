-- 1) Profiles table linked to auth.users (optional but recommended)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- 2) Add user_id to each table with default to auth.uid()
alter table public.courses add column if not exists user_id uuid not null default auth.uid();
alter table public.notes add column if not exists user_id uuid not null default auth.uid();
alter table public.daily_entries add column if not exists user_id uuid not null default auth.uid();

-- 3) Fix the daily_entries unique constraint to be per-user (drop old unique if it exists)
do $$
begin
  if exists (
    select 1 from pg_indexes
    where schemaname = 'public' and indexname = 'daily_entries_date_key'
  ) then
    -- old unique constraint/index name may differ; try dropping constraint safely
    begin
      alter table public.daily_entries drop constraint daily_entries_date_key;
    exception when others then
      -- fallback: try drop index by name
      begin
        drop index if exists public.daily_entries_date_key;
      exception when others then
        null;
      end;
    end;
  end if;
end$$;

-- Now create a composite unique per user
create unique index if not exists daily_entries_user_date_unique
  on public.daily_entries (user_id, date);

-- 4) Enable RLS
alter table public.courses enable row level security;
alter table public.notes enable row level security;
alter table public.daily_entries enable row level security;

-- 5) Policies: owner-only CRUD
drop policy if exists "own courses" on public.courses;
create policy "own courses" on public.courses
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "own notes" on public.notes;
create policy "own notes" on public.notes
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "own daily_entries" on public.daily_entries;
create policy "own daily_entries" on public.daily_entries
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());