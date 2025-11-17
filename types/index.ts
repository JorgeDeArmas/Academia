export interface User {
  id: string;
  tiktok_user_id: string;
  display_name: string;
  username: string;
  avatar_url?: string;
  language_preference: string;
  creator_category?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatorSimilar {
  id: string;
  user_id: string;
  similar_creator_id: string;
  similarity_score: number;
  created_at: string;
}

export interface CreatorVideo {
  id: string;
  creator_id: string;
  video_id: string;
  title: string;
  description?: string;
  thumbnail_url: string;
  video_url: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
  created_at: string;
  posted_at: string;
}

export interface VideoProduct {
  id: string;
  video_id: string;
  product_id: string;
  product_name: string;
  product_image_url: string;
  price: number;
  currency: string;
  sales_count?: number;
  conversion_rate?: number;
  created_at: string;
}

export interface SimilarCreatorWithDetails extends User {
  similarity_score: number;
  top_videos: CreatorVideo[];
}

export interface VideoWithProducts extends CreatorVideo {
  products: VideoProduct[];
}
