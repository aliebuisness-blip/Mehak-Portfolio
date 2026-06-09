create extension if not exists "pgcrypto";

create table if not exists public.website_info (
  id int primary key default 1 check (id = 1),
  portfolio_name text not null default 'Creative Portfolio',
  intro_line text not null default '',
  main_title text not null default '',
  description text not null default '',
  primary_button_text text not null default 'View Work',
  secondary_button_text text not null default 'Contact',
  email text not null default '',
  phone text not null default '',
  instagram text not null default '',
  behance text not null default '',
  linkedin text not null default '',
  footer_text text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.website_info (id, portfolio_name, intro_line, main_title, description, primary_button_text, secondary_button_text, footer_text)
values (
  1,
  'Creative Portfolio',
  'Independent designer and maker',
  'Selected work with clarity, craft, and purpose.',
  'A modern portfolio powered by a simple CMS.',
  'View Work',
  'Contact',
  'Built with care.'
)
on conflict (id) do nothing;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  thumbnail_url text not null default '',
  show_on_home boolean not null default false,
  display_order int not null default 0,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.works (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category_id uuid not null references public.categories(id) on delete restrict,
  short_description text not null default '',
  full_description text not null default '',
  thumbnail_url text not null default '',
  gallery_images text[] not null default '{}',
  tools text[] not null default '{}',
  client_name text,
  project_link text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.works
add column if not exists gallery_images text[] not null default '{}';

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  subject text not null,
  message text not null,
  status text not null default 'unread' check (status in ('unread', 'read')),
  created_at timestamptz not null default now()
);

alter table public.website_info enable row level security;
alter table public.categories enable row level security;
alter table public.works enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "Public can read website info" on public.website_info;
create policy "Public can read website info"
on public.website_info for select
to anon, authenticated
using (true);

drop policy if exists "Admins can manage website info" on public.website_info;
create policy "Admins can manage website info"
on public.website_info for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories"
on public.categories for select
to anon, authenticated
using (status = 'active' or auth.role() = 'authenticated');

drop policy if exists "Admins can manage categories" on public.categories;
create policy "Admins can manage categories"
on public.categories for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read published works" on public.works;
create policy "Public can read published works"
on public.works for select
to anon, authenticated
using (status = 'published' or auth.role() = 'authenticated');

drop policy if exists "Admins can manage works" on public.works;
create policy "Admins can manage works"
on public.works for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can create contact messages" on public.contact_messages;
create policy "Public can create contact messages"
on public.contact_messages for insert
to anon, authenticated
with check (true);

drop policy if exists "Admins can read contact messages" on public.contact_messages;
create policy "Admins can read contact messages"
on public.contact_messages for select
to authenticated
using (true);

drop policy if exists "Admins can update contact messages" on public.contact_messages;
create policy "Admins can update contact messages"
on public.contact_messages for update
to authenticated
using (true)
with check (true);

drop policy if exists "Admins can delete contact messages" on public.contact_messages;
create policy "Admins can delete contact messages"
on public.contact_messages for delete
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read portfolio media" on storage.objects;
create policy "Public can read portfolio media"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'portfolio-media');

drop policy if exists "Admins can upload portfolio media" on storage.objects;
create policy "Admins can upload portfolio media"
on storage.objects for insert
to authenticated
with check (bucket_id = 'portfolio-media');

drop policy if exists "Admins can update portfolio media" on storage.objects;
create policy "Admins can update portfolio media"
on storage.objects for update
to authenticated
using (bucket_id = 'portfolio-media')
with check (bucket_id = 'portfolio-media');

drop policy if exists "Admins can delete portfolio media" on storage.objects;
create policy "Admins can delete portfolio media"
on storage.objects for delete
to authenticated
using (bucket_id = 'portfolio-media');
