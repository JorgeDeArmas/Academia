/**
 * Seed script to add a sample similar creator to the database
 * Usage: npx tsx scripts/seed-sample-creator.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedSampleCreator() {
  try {
    console.log('Starting to seed sample creator data...\n');

    // Get the current logged-in user (we'll need their ID)
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (usersError || !users || users.length === 0) {
      console.error('No users found in database. Please log in first.');
      process.exit(1);
    }

    const currentUser = users[0];
    console.log(`✓ Found user: ${currentUser.display_name} (${currentUser.id})\n`);

    // Create sample creator (miamix_boy)
    const sampleCreatorData = {
      tiktok_user_id: 'sample_miamix_boy_123456',
      display_name: 'Miamix Boy',
      username: 'miamix_boy',
      avatar_url: 'https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/placeholder.jpeg',
      language_preference: 'es',
      creator_category: 'Lifestyle & Entertainment',
    };

    const { data: existingCreator } = await supabase
      .from('users')
      .select('*')
      .eq('username', 'miamix_boy')
      .single();

    let creatorId: string;

    if (existingCreator) {
      console.log('✓ Sample creator already exists, using existing record\n');
      creatorId = existingCreator.id;
    } else {
      const { data: newCreator, error: creatorError } = await supabase
        .from('users')
        .insert(sampleCreatorData)
        .select()
        .single();

      if (creatorError || !newCreator) {
        console.error('Error creating sample creator:', creatorError);
        process.exit(1);
      }

      creatorId = newCreator.id;
      console.log(`✓ Created sample creator: ${newCreator.display_name} (${creatorId})\n`);
    }

    // Create similarity relationship
    const { data: existingSimilarity } = await supabase
      .from('creators_similar')
      .select('*')
      .eq('user_id', currentUser.id)
      .eq('similar_creator_id', creatorId)
      .single();

    if (!existingSimilarity) {
      const { error: similarityError } = await supabase
        .from('creators_similar')
        .insert({
          user_id: currentUser.id,
          similar_creator_id: creatorId,
          similarity_score: 87.5,
        });

      if (similarityError) {
        console.error('Error creating similarity relationship:', similarityError);
      } else {
        console.log('✓ Created similarity relationship (87.5% match)\n');
      }
    } else {
      console.log('✓ Similarity relationship already exists\n');
    }

    // Sample videos from miamix_boy
    const sampleVideos = [
      {
        user_id: creatorId,
        video_id: 'video_miamix_1',
        video_url: 'https://www.tiktok.com/@miamix_boy/video/7435608449653239074',
        cover_image_url: 'https://p16-sign-sg.tiktokcdn.com/obj/tos-alisg-p-0037/placeholder1.jpeg',
        title: 'Miami lifestyle vibes 🌴',
        description: 'Living the Miami dream! #miami #lifestyle #vibes',
        duration_seconds: 45,
        view_count: 125000,
        like_count: 8900,
        comment_count: 450,
        share_count: 320,
        created_at: new Date('2024-11-10').toISOString(),
      },
      {
        user_id: creatorId,
        video_id: 'video_miamix_2',
        video_url: 'https://www.tiktok.com/@miamix_boy/video/7434210856432109857',
        cover_image_url: 'https://p16-sign-sg.tiktokcdn.com/obj/tos-alisg-p-0037/placeholder2.jpeg',
        title: 'Best spots in Miami Beach 🏖️',
        description: 'Check out these amazing locations! #miamibeach #travel #beach',
        duration_seconds: 38,
        view_count: 98000,
        like_count: 7200,
        comment_count: 380,
        share_count: 290,
        created_at: new Date('2024-11-08').toISOString(),
      },
      {
        user_id: creatorId,
        video_id: 'video_miamix_3',
        video_url: 'https://www.tiktok.com/@miamix_boy/video/7432891234567890123',
        cover_image_url: 'https://p16-sign-sg.tiktokcdn.com/obj/tos-alisg-p-0037/placeholder3.jpeg',
        title: 'Downtown Miami nightlife 🌃',
        description: 'The city never sleeps! #nightlife #downtown #miami',
        duration_seconds: 52,
        view_count: 156000,
        like_count: 11200,
        comment_count: 620,
        share_count: 445,
        created_at: new Date('2024-11-05').toISOString(),
      },
    ];

    // Check if videos already exist
    for (const video of sampleVideos) {
      const { data: existingVideo } = await supabase
        .from('creator_videos')
        .select('*')
        .eq('video_id', video.video_id)
        .single();

      if (!existingVideo) {
        const { error: videoError } = await supabase
          .from('creator_videos')
          .insert(video);

        if (videoError) {
          console.error(`Error creating video ${video.video_id}:`, videoError);
        } else {
          console.log(`✓ Created video: ${video.title}`);
        }
      } else {
        console.log(`✓ Video already exists: ${video.title}`);
      }
    }

    console.log('\n✅ Sample creator data seeded successfully!');
    console.log('\nYou can now:');
    console.log('1. Go to https://academia-blond-chi.vercel.app/dashboard');
    console.log('2. See @miamix_boy in your similar creators');
    console.log('3. Click on videos to see the TikTok embed player\n');

  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedSampleCreator();
