-- ========================================
-- RUN THIS IN SUPABASE SQL EDITOR TO RELOAD SCHEMA CACHE
-- ========================================
-- Navigate to: https://supabase.com/dashboard/project/tkipdechnrdobwpwgwpp/editor
-- Paste this SQL and click "Run"

-- Method 1: Send NOTIFY signal to reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';

-- Method 2: Verify the table exists and has the correct columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'echotik_creators'
ORDER BY ordinal_position;

-- Method 3: If the table doesn't show up, it means it wasn't created properly
-- Check if the table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'echotik_creators'
) as table_exists;
