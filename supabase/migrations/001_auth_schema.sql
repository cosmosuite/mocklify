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

-- Create RLS policies for users table
create policy "Users can view their own profile"
    on public.users for select
    using (auth.uid() = id);

create policy "Users can update their own profile"
    on public.users for update
    using (auth.uid() = id);

-- Create indexes for better performance
create index users_email_idx on public.users (email);