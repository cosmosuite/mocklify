@@ .. @@
 -- Create users table
 create table if not exists public.users (
     id uuid references auth.users on delete cascade not null primary key,
-    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
+    created_at timestamptz default now() not null,
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

+-- Create function to handle new user creation
+create or replace function public.handle_new_user()
+returns trigger
+language plpgsql
+security definer set search_path = public
+as $$
+begin
+    insert into public.users (id, email)
+    values (new.id, new.email);
+    return new;
+end;
+$$;
+
+-- Drop existing trigger if exists
+drop trigger if exists on_auth_user_created on auth.users;
+
+-- Create trigger for new user creation
+create trigger on_auth_user_created
+    after insert on auth.users
+    for each row execute function public.handle_new_user();