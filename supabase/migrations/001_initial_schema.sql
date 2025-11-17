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
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_id VARCHAR(255) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT NOT NULL,
  video_url TEXT NOT NULL,
  view_count BIGINT DEFAULT 0,
  like_count BIGINT DEFAULT 0,
  comment_count BIGINT DEFAULT 0,
  share_count BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  posted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
CREATE INDEX IF NOT EXISTS idx_creator_videos_creator_id ON creator_videos(creator_id);
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

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE creators_similar ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_products ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Create policies for creators_similar table
CREATE POLICY "Users can view similar creators" ON creators_similar
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Create policies for creator_videos table
CREATE POLICY "Users can view videos of their similar creators" ON creator_videos
  FOR SELECT USING (
    creator_id IN (
      SELECT similar_creator_id FROM creators_similar 
      WHERE user_id::text = auth.uid()::text
    )
  );

-- Create policies for video_products table
CREATE POLICY "Users can view products from accessible videos" ON video_products
  FOR SELECT USING (
    video_id IN (
      SELECT id FROM creator_videos
      WHERE creator_id IN (
        SELECT similar_creator_id FROM creators_similar 
        WHERE user_id::text = auth.uid()::text
      )
    )
  );
