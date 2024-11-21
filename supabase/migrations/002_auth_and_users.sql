-- Create users table if not exists
create table if not exists public.users (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()),
    email text not null,
    name text,
    avatar_url text,
    settings jsonb default '{
        "language": "en",
        "timezone": "UTC",
        "email_notifications": true,
        "product_updates": true
    }'::jsonb,
    constraint users_email_key unique (email)
);

-- Add user_id column to testimonials if not exists
do $$ 
begin
    if not exists (select 1 from information_schema.columns 
                  where table_name = 'testimonials' and column_name = 'user_id') then
        alter table public.testimonials 
        add column user_id uuid references public.users(id) on delete cascade;
    end if;
end $$;

-- Add user_id column to payment_notifications if not exists
do $$ 
begin
    if not exists (select 1 from information_schema.columns 
                  where table_name = 'payment_notifications' and column_name = 'user_id') then
        alter table public.payment_notifications 
        add column user_id uuid references public.users(id) on delete cascade;
    end if;
end $$;

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.testimonials enable row level security;
alter table public.payment_notifications enable row level security;

-- Drop existing policies
drop policy if exists "Public read access" on public.testimonials;
drop policy if exists "Public insert access" on public.testimonials;
drop policy if exists "Public read access" on public.payment_notifications;
drop policy if exists "Public insert access" on public.payment_notifications;

-- Create public access policies (no auth required for now)
create policy "Public read access"
    on public.testimonials for select
    to public
    using (true);

create policy "Public insert access"
    on public.testimonials for insert
    to public
    with check (true);

create policy "Public read access"
    on public.payment_notifications for select
    to public
    using (true);

create policy "Public insert access"
    on public.payment_notifications for insert
    to public
    with check (true);

-- Create indexes if not exist
create index if not exists users_email_idx on public.users (email);
create index if not exists testimonials_user_id_idx on public.testimonials (user_id);
create index if not exists payment_notifications_user_id_idx on public.payment_notifications (user_id);