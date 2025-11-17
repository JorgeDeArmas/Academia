-- Insert sample users (mock Hispanic creators)
INSERT INTO users (id, tiktok_user_id, display_name, username, avatar_url, language_preference, creator_category) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'tiktok_001', 'María González', 'mariagonzalez_shop', 'https://via.placeholder.com/150', 'es', 'Moda y Belleza'),
  ('550e8400-e29b-41d4-a716-446655440002', 'tiktok_002', 'Carlos Rodríguez', 'carlos_tech', 'https://via.placeholder.com/150', 'es', 'Tecnología'),
  ('550e8400-e29b-41d4-a716-446655440003', 'tiktok_003', 'Ana Martínez', 'ana_cocina', 'https://via.placeholder.com/150', 'es', 'Cocina'),
  ('550e8400-e29b-41d4-a716-446655440004', 'tiktok_004', 'Luis Hernández', 'luis_fitness', 'https://via.placeholder.com/150', 'es', 'Fitness'),
  ('550e8400-e29b-41d4-a716-446655440005', 'tiktok_005', 'Sofia López', 'sofia_beauty', 'https://via.placeholder.com/150', 'es', 'Moda y Belleza');

-- Insert sample similar creator relationships
INSERT INTO creators_similar (user_id, similar_creator_id, similarity_score) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', 85.5),
  ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 72.3),
  ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 68.9);

-- Insert sample videos
INSERT INTO creator_videos (id, creator_id, video_id, title, description, thumbnail_url, video_url, view_count, like_count, comment_count, share_count) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'video_001', '¡Los mejores productos de maquillaje!', 'Descubre mis productos favoritos para un look perfecto', 'https://via.placeholder.com/400x600', 'https://example.com/video1', 125000, 8500, 450, 320),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'video_002', 'Rutina de skincare nocturna', 'Mi rutina completa para una piel radiante', 'https://via.placeholder.com/400x600', 'https://example.com/video2', 98000, 6200, 380, 280),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', 'video_003', 'Haul de ropa de verano', 'Mira todo lo que compré para el verano', 'https://via.placeholder.com/400x600', 'https://example.com/video3', 156000, 11200, 520, 420);

-- Insert sample products
INSERT INTO video_products (video_id, product_id, product_name, product_image_url, price, currency, sales_count, conversion_rate) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'prod_001', 'Labial Mate Rosa', 'https://via.placeholder.com/200', 15.99, 'USD', 450, 0.036),
  ('660e8400-e29b-41d4-a716-446655440001', 'prod_002', 'Base de Maquillaje', 'https://via.placeholder.com/200', 28.50, 'USD', 320, 0.026),
  ('660e8400-e29b-41d4-a716-446655440002', 'prod_003', 'Sérum Vitamina C', 'https://via.placeholder.com/200', 24.99, 'USD', 280, 0.029),
  ('660e8400-e29b-41d4-a716-446655440003', 'prod_004', 'Vestido Floral', 'https://via.placeholder.com/200', 45.00, 'USD', 890, 0.057);
