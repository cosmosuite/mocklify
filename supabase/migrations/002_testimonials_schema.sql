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

-- Enable Row Level Security (RLS)
alter table public.testimonials enable row level security;

-- Create RLS policies for testimonials
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

-- Create indexes for better performance
create index testimonials_user_id_idx on public.testimonials (user_id);
create index testimonials_platform_idx on public.testimonials (platform);
create index testimonials_created_at_idx on public.testimonials (created_at desc);