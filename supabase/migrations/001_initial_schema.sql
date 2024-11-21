-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Create testimonials table
create table public.testimonials (
    id text primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()),
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
create table public.payment_notifications (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()),
    platform text not null check (platform in ('stripe', 'paypal')),
    currency text not null,
    recipients jsonb not null,
    wallpaper text not null,
    custom_background text
);

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$;

-- Create updated_at triggers
create trigger handle_testimonials_updated_at
    before update on public.testimonials
    for each row
    execute function public.handle_updated_at();

create trigger handle_payment_notifications_updated_at
    before update on public.payment_notifications
    for each row
    execute function public.handle_updated_at();

-- Create indexes for better performance
create index testimonials_platform_idx on public.testimonials (platform);
create index testimonials_created_at_idx on public.testimonials (created_at desc);
create index payment_notifications_platform_idx on public.payment_notifications (platform);
create index payment_notifications_created_at_idx on public.payment_notifications (created_at desc);