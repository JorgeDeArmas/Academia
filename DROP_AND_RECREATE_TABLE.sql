-- ========================================
-- DROP AND RECREATE ECHOTIK_CREATORS TABLE
-- ========================================
-- This will remove the old table and create a fresh one
-- Then force PostgREST to reload the schema

-- Step 1: Drop the table and all its dependencies
DROP TABLE IF EXISTS public.echotik_creators CASCADE;

-- Step 2: Create the table fresh
CREATE TABLE public.echotik_creators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- EchoTik user identifiers
  user_id text UNIQUE NOT NULL,
  unique_id text,
  nickname text,
  
  -- Profile information
  avatar_url text,
  signature text,
  region text,
  language text,
  category text,
  
  -- Follower metrics
  total_followers_cnt bigint DEFAULT 0,
  follower_cnt_increase_1d bigint DEFAULT 0,
  follower_cnt_increase_7d bigint DEFAULT 0,
  follower_cnt_increase_30d bigint DEFAULT 0,
  follower_cnt_increase_90d bigint DEFAULT 0,
  
  -- Content metrics
  total_video_cnt integer DEFAULT 0,
  total_views_cnt bigint DEFAULT 0,
  total_digg_cnt bigint DEFAULT 0,
  interaction_rate numeric(10, 6),
  
  -- E-commerce metrics
  total_sale_gmv_amt numeric(15, 2) DEFAULT 0,
  total_sale_gmv_1d_amt numeric(15, 2) DEFAULT 0,
  total_sale_gmv_7d_amt numeric(15, 2) DEFAULT 0,
  total_sale_gmv_30d_amt numeric(15, 2) DEFAULT 0,
  total_sale_gmv_90d_amt numeric(15, 2) DEFAULT 0,
  ec_score numeric(5, 2),
  
  -- Product information
  total_product_cnt integer DEFAULT 0,
  most_category_product jsonb,
  
  -- Video patterns
  most_video_duration_range jsonb,
  most_video_publish_time_range jsonb,
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 3: Create indexes
CREATE INDEX idx_echotik_creators_user_id ON public.echotik_creators(user_id);
CREATE INDEX idx_echotik_creators_unique_id ON public.echotik_creators(unique_id);
CREATE INDEX idx_echotik_creators_category ON public.echotik_creators(category);
CREATE INDEX idx_echotik_creators_region_language ON public.echotik_creators(region, language);
CREATE INDEX idx_echotik_creators_followers ON public.echotik_creators(total_followers_cnt DESC);
CREATE INDEX idx_echotik_creators_gmv ON public.echotik_creators(total_sale_gmv_30d_amt DESC);
CREATE INDEX idx_echotik_creators_ec_score ON public.echotik_creators(ec_score DESC);

-- Step 4: Enable RLS
ALTER TABLE public.echotik_creators ENABLE ROW LEVEL SECURITY;

-- Step 5: Create policies
CREATE POLICY "Allow authenticated users to view creators"
  ON public.echotik_creators
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow service role full access"
  ON public.echotik_creators
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Step 6: Create update trigger
CREATE TRIGGER update_echotik_creators_updated_at
  BEFORE UPDATE ON public.echotik_creators
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Step 7: Force PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

-- Step 8: Verify table was created with all columns
SELECT 
  'Table created with ' || COUNT(*) || ' columns' as status,
  string_agg(column_name, ', ' ORDER BY ordinal_position) as columns
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'echotik_creators';

-- Step 9: Check row count (should be 0)
SELECT COUNT(*) as row_count FROM public.echotik_creators;
