-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Create users table
create table public.users (
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

-- Update testimonials table to include user_id
alter table public.testimonials 
add column user_id uuid references public.users(id) on delete cascade;

-- Update payment_notifications table to include user_id
alter table public.payment_notifications 
add column user_id uuid references public.users(id) on delete cascade;

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

-- Create RLS policies for users table
create policy "Users can view their own profile"
    on public.users for select
    using (auth.uid() = id);

create policy "Users can update their own profile"
    on public.users for update
    using (auth.uid() = id);

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

-- Create RLS policies for payment notifications
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
create index payment_notifications_user_id_idx on public.payment_notifications (user_id);

-- Migrate existing data to demo user
do $$
declare
    demo_user_id uuid;
begin
    -- Create demo user if not exists
    insert into auth.users (email, encrypted_password, email_confirmed_at)
    values ('demo@example.com', crypt('demo1234', gen_salt('bf')), now())
    on conflict (email) do nothing
    returning id into demo_user_id;

    -- Update existing testimonials
    update public.testimonials
    set user_id = demo_user_id
    where user_id is null;

    -- Update existing payment notifications
    update public.payment_notifications
    set user_id = demo_user_id
    where user_id is null;
end;
$$;