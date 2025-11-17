-- Add avatar_original_url column to store the EchoTik URL
-- The avatar_url will store the temporary access URL

ALTER TABLE public.echotik_creators 
ADD COLUMN IF NOT EXISTS avatar_original_url text;

-- Create index on avatar_original_url for faster lookups
CREATE INDEX IF NOT EXISTS idx_echotik_creators_avatar_original_url 
ON public.echotik_creators(avatar_original_url);

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'echotik_creators'
  AND column_name IN ('avatar_url', 'avatar_original_url')
ORDER BY ordinal_position;
