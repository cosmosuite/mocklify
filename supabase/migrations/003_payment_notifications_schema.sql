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

-- Enable Row Level Security (RLS)
alter table public.payment_notifications enable row level security;

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
create index payment_notifications_user_id_idx on public.payment_notifications (user_id);
create index payment_notifications_platform_idx on public.payment_notifications (platform);
create index payment_notifications_created_at_idx on public.payment_notifications (created_at desc);