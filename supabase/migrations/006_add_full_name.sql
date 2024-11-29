-- Remove full_name column if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 
               FROM information_schema.columns 
               WHERE table_name = 'users' 
               AND column_name = 'full_name') THEN
        -- Migrate any full_name data to name if needed
        UPDATE public.users
        SET name = full_name
        WHERE full_name IS NOT NULL AND name IS NULL;
        
        -- Drop the full_name column
        ALTER TABLE public.users DROP COLUMN full_name;
    END IF;
END $$;