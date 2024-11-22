-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Create users table
create table if not exists public.users (
    id uuid references auth.users on delete cascade not null primary key,
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

-- Create testimonials table
create table if not exists public.testimonials (
    id text primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()),
    user_id uuid references public.users(id) on delete cascade,
    platform text not null check (platform in ('facebook', 'twitter', 'trustpilot', 'email')),
    content text not null,
    title text,
    author_name text not null,
    author_handle text,
    author_avatar text not null,
    author_location text,
    author_verified boolean default false,
    author_review_count integer,
    metrics jsonb not null,
    tone text not null check (tone in ('positive', 'neutral', 'negative')),
    product_info text not null
);

-- Create payment_notifications table
create table if not exists public.payment_notifications (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()),
    user_id uuid references public.users(id) on delete cascade,
    platform text not null check (platform in ('stripe', 'paypal')),
    currency text not null,
    recipients jsonb not null,
    wallpaper text not null,
    custom_background text
);

-- Create function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
    insert into public.users (id, email)
    values (new.id, new.email);
    return new;
end;
$$;

-- Create trigger for new user creation
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.testimonials enable row level security;
alter table public.payment_notifications enable row level security;

-- Create RLS policies
create policy "Users can view their own profile"
    on public.users for select
    using (auth.uid() = id);

create policy "Users can update their own profile"
    on public.users for update
    using (auth.uid() = id);

create policy "Users can view their own testimonials"
    on public.testimonials for select
    using (user_id = auth.uid());

create policy "Users can insert their own testimonials"
    on public.testimonials for insert
    with check (user_id = auth.uid());

create policy "Users can update their own testimonials"
    on public.testimonials for update
    using (user_id = auth.uid());

create policy "Users can delete their own testimonials"
    on public.testimonials for delete
    using (user_id = auth.uid());

create policy "Users can view their own payment notifications"
    on public.payment_notifications for select
    using (user_id = auth.uid());

create policy "Users can insert their own payment notifications"
    on public.payment_notifications for insert
    with check (user_id = auth.uid());

create policy "Users can update their own payment notifications"
    on public.payment_notifications for update
    using (user_id = auth.uid());

create policy "Users can delete their own payment notifications"
    on public.payment_notifications for delete
    using (user_id = auth.uid());

-- Create indexes for better performance
create index users_email_idx on public.users (email);
create index testimonials_user_id_idx on public.testimonials (user_id);
create index testimonials_platform_idx on public.testimonials (platform);
create index testimonials_created_at_idx on public.testimonials (created_at desc);
create index payment_notifications_user_id_idx on public.payment_notifications (user_id);
create index payment_notifications_platform_idx on public.payment_notifications (platform);
create index payment_notifications_created_at_idx on public.payment_notifications (created_at desc);