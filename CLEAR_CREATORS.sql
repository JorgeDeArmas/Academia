-- Clear existing creators so we can fetch them again with proper avatar URLs
DELETE FROM public.echotik_creators;

-- Verify table is empty
SELECT COUNT(*) as row_count FROM public.echotik_creators;
