-- Create handwritten_testimonials table
create table if not exists public.handwritten_testimonials (
    id text primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()),
    user_id uuid references public.users(id) on delete cascade,
    content text not null,
    author_name text not null,
    product_info text not null,
    tone text not null check (tone in ('enthusiastic', 'professional', 'casual', 'grateful')),
    font text not null,
    background_style text not null check (background_style in ('classic', 'notepad', 'journal', 'custom')),
    background_color text not null,
    text_color text not null,
    text_size integer not null check (text_size between 14 and 24),
    line_height numeric(3,1) not null check (line_height between 1.2 and 2.4),
    include_signature boolean not null default true
);

-- Enable Row Level Security (RLS)
alter table public.handwritten_testimonials enable row level security;

-- Create RLS policies
create policy "Users can view their own handwritten testimonials"
    on public.handwritten_testimonials for select
    using (user_id = auth.uid());

create policy "Users can insert their own handwritten testimonials"
    on public.handwritten_testimonials for insert
    with check (user_id = auth.uid());

create policy "Users can update their own handwritten testimonials"
    on public.handwritten_testimonials for update
    using (user_id = auth.uid());

create policy "Users can delete their own handwritten testimonials"
    on public.handwritten_testimonials for delete
    using (user_id = auth.uid());

-- Create indexes for better performance
create index handwritten_testimonials_user_id_idx on public.handwritten_testimonials (user_id);
create index handwritten_testimonials_created_at_idx on public.handwritten_testimonials (created_at desc);

-- Remove handwritten from testimonials platform check
alter table public.testimonials 
drop constraint if exists testimonials_platform_check;

alter table public.testimonials 
add constraint testimonials_platform_check 
check (platform in ('facebook', 'twitter', 'trustpilot', 'email'));