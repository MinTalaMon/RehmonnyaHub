-- RehmonnyaHub schema for Supabase Postgres.

create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  avatar_url text,
  bio text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.communities (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text unique not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id bigserial primary key,
  community_id uuid not null references public.communities(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  content text not null,
  image_url text,
  score integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.comments (
  id bigserial primary key,
  post_id bigint not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  content text not null,
  parent_comment_id bigint references public.comments(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.votes (
  id bigserial primary key,
  post_id bigint not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

create index if not exists idx_posts_created_at on public.posts(created_at desc);
create index if not exists idx_posts_score on public.posts(score desc);
create index if not exists idx_posts_community_id on public.posts(community_id);
create index if not exists idx_comments_post_id on public.comments(post_id);
create index if not exists idx_votes_post_id on public.votes(post_id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, username)
  values (new.id, split_part(new.email, '@', 1))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.users enable row level security;
alter table public.communities enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.votes enable row level security;

create policy "Public read users" on public.users for select using (true);
create policy "Users can update self" on public.users for update using (auth.uid() = id);
create policy "Users can insert self" on public.users for insert with check (auth.uid() = id);

create policy "Public read communities" on public.communities for select using (true);
create policy "Only admins manage communities" on public.communities for all using (
  exists(select 1 from public.users u where u.id = auth.uid() and u.is_admin = true)
);

create policy "Public read posts" on public.posts for select using (true);
create policy "Authenticated create posts" on public.posts for insert with check (auth.uid() = user_id);
create policy "Owner/admin delete posts" on public.posts for delete using (
  auth.uid() = user_id or exists(select 1 from public.users u where u.id = auth.uid() and u.is_admin = true)
);
create policy "Owner/admin update posts" on public.posts for update using (
  auth.uid() = user_id or exists(select 1 from public.users u where u.id = auth.uid() and u.is_admin = true)
);

create policy "Public read comments" on public.comments for select using (true);
create policy "Authenticated create comments" on public.comments for insert with check (auth.uid() = user_id);
create policy "Owner/admin delete comments" on public.comments for delete using (
  auth.uid() = user_id or exists(select 1 from public.users u where u.id = auth.uid() and u.is_admin = true)
);

create policy "Public read votes" on public.votes for select using (true);
create policy "Authenticated vote" on public.votes for insert with check (auth.uid() = user_id);
create policy "Authenticated update own vote" on public.votes for update using (auth.uid() = user_id);

-- Stored procedure for searching posts with prepared statements
create or replace function public.search_posts(
  search_query text default '',
  community_filter text default '',
  sort_order text default 'hot'
)
returns table (
  id bigint,
  title text,
  content text,
  image_url text,
  score integer,
  created_at timestamptz,
  community_id uuid,
  community_name text,
  community_slug text,
  user_id uuid,
  username text
)
language plpgsql
security definer
as $$
begin
  return query
  select
    p.id,
    p.title,
    p.content,
    p.image_url,
    p.score,
    p.created_at,
    p.community_id,
    c.name as community_name,
    c.slug as community_slug,
    p.user_id,
    u.username
  from public.posts p
  join public.communities c on p.community_id = c.id
  join public.users u on p.user_id = u.id
  where
    (community_filter = '' or c.slug = community_filter) and
    (search_query = '' or p.title ilike '%' || search_query || '%' or p.content ilike '%' || search_query || '%')
  order by
    case
      when sort_order = 'top' then p.score
      when sort_order = 'new' then extract(epoch from p.created_at)
      else p.score + (extract(epoch from p.created_at) - extract(epoch from now())) / 45000
    end desc
  limit 50;
end;
$$;

insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

create policy "Public read post images" on storage.objects
for select using (bucket_id = 'post-images');

create policy "Authenticated upload post images" on storage.objects
for insert with check (bucket_id = 'post-images' and auth.role() = 'authenticated');
