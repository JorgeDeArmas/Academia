// Supabase Edge Function to fetch similar creators from EchoTik API
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EchoTikCreator {
  avatar: string;
  avg_30d_price: number;
  category: string;
  contact_email: string;
  ec_score: number;
  first_crawl_dt: number;
  gender: string;
  influencer_video_duration_level: string;
  influencer_video_publish_hour: string;
  influencer_video_publish_week: string;
  interaction_rate: number;
  language: string;
  most_category_product: string;
  most_views_video: string;
  nick_name: string;
  off_mark: number;
  per_video_product_views_avg_7d_cnt: number;
  region: string;
  sales_flag: number;
  seller_id: string | null;
  show_case_flag: number;
  signature: string;
  total_comments_cnt: number;
  total_digg_1d_cnt: number;
  total_digg_30d_cnt: number;
  total_digg_7d_cnt: number;
  total_digg_90d_cnt: number;
  total_digg_cnt: number;
  total_followers_1d_cnt: number;
  total_followers_30d_cnt: number;
  total_followers_7d_cnt: number;
  total_followers_90d_cnt: number;
  total_followers_cnt: number;
  total_following_cnt: number;
  total_likes_cnt: number;
  total_live_cnt: number;
  total_live_sale_gmv_30d_amt: number;
  total_post_video_cnt: number;
  total_product_30d_cnt: number;
  total_product_cnt: number;
  total_sale_cnt: number;
  total_sale_gmv_30d_amt: number;
  total_sale_gmv_amt: number;
  total_shares_cnt: number;
  total_video_product_30d_cnt: number;
  total_video_sale_30d_cnt: number;
  total_video_sale_gmv_30d_amt: number;
  total_views_cnt: number;
  unique_id: string;
  user_id: string;
}

interface EchoTikResponse {
  code: number;
  message: string;
  data: EchoTikCreator[];
  requestId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get parameters from request
    const {
      category,
      region = "US",
      language = "es",
      pageNum = 1,
      pageSize = 10,
    } = await req.json();

    if (!category) {
      return new Response(JSON.stringify({ error: "Category is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get EchoTik credentials from environment
    const echotikUser = Deno.env.get("ECHOTIK_USER");
    const echotikPass = Deno.env.get("ECHOTIK_PASS");

    if (!echotikUser || !echotikPass) {
      throw new Error("EchoTik credentials not configured");
    }

    // Fetch creators from EchoTik API
    const echotikUrl = new URL(
      "https://open.echotik.live/api/v2/influencer/listV2"
    );
    echotikUrl.searchParams.set("influencer_category_name", category);
    echotikUrl.searchParams.set("region", region);
    echotikUrl.searchParams.set("language", language);
    echotikUrl.searchParams.set("page_num", pageNum.toString());
    echotikUrl.searchParams.set("page_size", Math.min(pageSize, 10).toString()); // Max 10 per API docs

    console.log("Fetching from EchoTik:", echotikUrl.toString());

    // Use Basic Authentication (Base64 encoded username:password)
    const authString = btoa(`${echotikUser}:${echotikPass}`);
    const echotikResponse = await fetch(echotikUrl.toString(), {
      method: "GET",
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/json",
      },
    });

    if (!echotikResponse.ok) {
      throw new Error(
        `EchoTik API error: ${echotikResponse.status} ${echotikResponse.statusText}`
      );
    }

    const echotikData: EchoTikResponse = await echotikResponse.json();

    if (echotikData.code !== 0) {
      throw new Error(`EchoTik API returned error: ${echotikData.message}`);
    }

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      db: { schema: "public" },
      auth: { persistSession: false },
    });

    // Helper function to batch fetch temporary avatar URLs from EchoTik
    const getBatchTemporaryUrls = async (
      coverUrls: string[]
    ): Promise<Map<string, string>> => {
      const urlMap = new Map<string, string>();

      // Filter only EchoTik URLs
      const echotikUrls = coverUrls.filter(
        (url) =>
          url && url.includes("echosell-images.tos-ap-southeast-1.volces.com")
      );

      if (echotikUrls.length === 0) {
        return urlMap;
      }

      // Process in batches of 10 (API limit)
      const batchSize = 10;
      for (let i = 0; i < echotikUrls.length; i += batchSize) {
        const batch = echotikUrls.slice(i, i + batchSize);

        try {
          const downloadUrl = new URL(
            "https://open.echotik.live/batch/cover/download"
          );
          downloadUrl.searchParams.set("cover_urls", batch.join(","));

          const authString = btoa(`${echotikUser}:${echotikPass}`);
          const response = await fetch(downloadUrl.toString(), {
            method: "GET",
            headers: {
              Authorization: `Basic ${authString}`,
            },
          });

          if (!response.ok) {
            console.error(`Batch download failed: ${response.status}`);
            continue;
          }

          const data = await response.json();

          // Map source URLs to destination URLs
          if (Array.isArray(data)) {
            data.forEach(
              (item: { source_cover_url: string; dest_cover_url: string }) => {
                if (item.source_cover_url && item.dest_cover_url) {
                  urlMap.set(item.source_cover_url, item.dest_cover_url);
                }
              }
            );
          }
        } catch (error) {
          console.error("Error in batch avatar URL fetch:", error);
        }
      }

      return urlMap;
    };

    // Parse and insert/update creators in database
    const creatorsData = echotikData.data.map((creator) => {
      // Parse JSON strings
      let mostCategoryProduct = null;
      try {
        if (
          creator.most_category_product &&
          creator.most_category_product !== "[]"
        ) {
          mostCategoryProduct = JSON.parse(creator.most_category_product);
        }
      } catch (e) {
        console.error("Error parsing most_category_product:", e);
      }

      let videoDurationLevel = null;
      try {
        if (
          creator.influencer_video_duration_level &&
          creator.influencer_video_duration_level !== "{}"
        ) {
          videoDurationLevel = JSON.parse(
            creator.influencer_video_duration_level
          );
        }
      } catch (e) {
        console.error("Error parsing video_duration_level:", e);
      }

      let videoPublishHour = null;
      try {
        if (
          creator.influencer_video_publish_hour &&
          creator.influencer_video_publish_hour !== "{}"
        ) {
          videoPublishHour = JSON.parse(creator.influencer_video_publish_hour);
        }
      } catch (e) {
        console.error("Error parsing video_publish_hour:", e);
      }

      // Map EchoTik API fields to database schema
      return {
        user_id: creator.user_id,
        unique_id: creator.unique_id,
        nickname: creator.nick_name,
        avatar_original_url: creator.avatar, // Store original URL
        signature: creator.signature,
        region: creator.region,
        language: creator.language,
        category: creator.category,
        // Follower metrics
        total_followers_cnt: creator.total_followers_cnt,
        follower_cnt_increase_1d: creator.total_followers_1d_cnt,
        follower_cnt_increase_7d: creator.total_followers_7d_cnt,
        follower_cnt_increase_30d: creator.total_followers_30d_cnt,
        follower_cnt_increase_90d: creator.total_followers_90d_cnt,
        // Content metrics
        total_video_cnt: creator.total_post_video_cnt,
        total_views_cnt: creator.total_views_cnt,
        total_digg_cnt: creator.total_digg_cnt,
        interaction_rate: creator.interaction_rate,
        // E-commerce metrics
        total_sale_gmv_amt: creator.total_sale_gmv_amt,
        total_sale_gmv_1d_amt: creator.total_digg_1d_cnt,
        total_sale_gmv_7d_amt: creator.total_digg_7d_cnt,
        total_sale_gmv_30d_amt: creator.total_sale_gmv_30d_amt,
        total_sale_gmv_90d_amt: creator.total_digg_90d_cnt,
        ec_score: creator.ec_score,
        // Product information
        total_product_cnt: creator.total_product_cnt,
        most_category_product: mostCategoryProduct,
        // Video patterns
        most_video_duration_range: videoDurationLevel,
        most_video_publish_time_range: videoPublishHour,
      };
    });

    // Fetch temporary avatar URLs for all creators in batch
    console.log("Fetching temporary avatar URLs in batch...");
    const avatarUrls = creatorsData.map((c) => c.avatar_original_url);
    const urlMap = await getBatchTemporaryUrls(avatarUrls);

    const creators = creatorsData.map((creatorData) => {
      const tempAvatarUrl =
        urlMap.get(creatorData.avatar_original_url) ||
        creatorData.avatar_original_url;
      return {
        ...creatorData,
        avatar_url: tempAvatarUrl, // Store temporary URL in avatar_url field
      };
    });

    // Upsert creators to database using REST API directly to bypass schema cache
    const restUrl = `${supabaseUrl}/rest/v1/echotik_creators`;

    console.log(`Upserting ${creators.length} creators to database...`);

    const restResponse = await fetch(restUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseServiceKey}`,
        apikey: supabaseServiceKey,
        // Use merge-duplicates with on-conflict to upsert based on user_id
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify(creators),
    });

    // If we get a 409 conflict, that means the data already exists - that's okay
    if (restResponse.status === 409) {
      console.log("Creators already exist, fetching from database...");

      // Return success with the data already in database
      return new Response(
        JSON.stringify({
          success: true,
          count: creators.length,
          message: "Creators already exist in database",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!restResponse.ok) {
      const errorText = await restResponse.text();
      console.error("REST API error:", errorText);
      throw new Error(
        `Failed to save creators via REST API: ${restResponse.status} - ${errorText}`
      );
    }

    const upsertedCreators = await restResponse.json();
    console.log(`Successfully saved ${upsertedCreators?.length || 0} creators`);
    return new Response(
      JSON.stringify({
        success: true,
        count: upsertedCreators?.length || 0,
        creators: upsertedCreators,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in fetch-similar-creators function:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
