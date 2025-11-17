-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tiktok_user_id VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  language_preference VARCHAR(10) DEFAULT 'es',
  creator_category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create creators_similar table
CREATE TABLE IF NOT EXISTS creators_similar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  similar_creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  similarity_score DECIMAL(5,2) NOT NULL DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, similar_creator_id)
);

-- Create creator_videos table
CREATE TABLE IF NOT EXISTS creator_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_id VARCHAR(255) UNIQUE NOT NULL,
  title TEXT,
  description TEXT,
  cover_image_url TEXT,
  video_url TEXT NOT NULL,
  duration_seconds INTEGER,
  view_count BIGINT DEFAULT 0,
  like_count BIGINT DEFAULT 0,
  comment_count BIGINT DEFAULT 0,
  share_count BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  posted_at TIMESTAMP WITH TIME ZONE
);

-- Create video_products table
CREATE TABLE IF NOT EXISTS video_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL REFERENCES creator_videos(id) ON DELETE CASCADE,
  product_id VARCHAR(255) NOT NULL,
  product_name TEXT NOT NULL,
  product_image_url TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  sales_count INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,4),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(video_id, product_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_tiktok_user_id ON users(tiktok_user_id);
CREATE INDEX IF NOT EXISTS idx_creators_similar_user_id ON creators_similar(user_id);
CREATE INDEX IF NOT EXISTS idx_creators_similar_similar_creator_id ON creators_similar(similar_creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_videos_user_id ON creator_videos(user_id);
CREATE INDEX IF NOT EXISTS idx_creator_videos_video_id ON creator_videos(video_id);
CREATE INDEX IF NOT EXISTS idx_video_products_video_id ON video_products(video_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security but allow service role to bypass
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE creators_similar ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_products ENABLE ROW LEVEL SECURITY;

-- Create permissive policies that allow service role full access
CREATE POLICY "Enable all access for service role" ON users
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for service role" ON creators_similar
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for service role" ON creator_videos
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for service role" ON video_products
  FOR ALL USING (true) WITH CHECK (true);
