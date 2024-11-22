-- Remove demo user if exists
do $$
begin
    -- Delete from auth.users
    delete from auth.users where email = 'demo@example.com';
    
    -- Delete from public.users
    delete from public.users where email = 'demo@example.com';
    
    -- Delete related data
    delete from public.testimonials where user_id in (
        select id from public.users where email = 'demo@example.com'
    );
    
    delete from public.payment_notifications where user_id in (
        select id from public.users where email = 'demo@example.com'
    );
end;
$$;