-- Create demo user if not exists
do $$
declare
    demo_user_id uuid;
begin
    -- Create demo user
    insert into auth.users (
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        aud,
        role
    )
    values (
        'demo@example.com',
        crypt('demo1234', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{"name":"Demo User"}',
        'authenticated',
        'authenticated'
    )
    on conflict (email) do nothing
    returning id into demo_user_id;

    -- Create user profile
    insert into public.users (id, email, name)
    values (demo_user_id, 'demo@example.com', 'Demo User')
    on conflict (id) do nothing;

end;
$$;